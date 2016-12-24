/**
 * @module domain/bills
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var validator = require('validator');
var Promise = require('bluebird');

var util = require('./util');
var external = require('../../../external');
var config = require('../../../config');
var Bills = require('../../../models/civil_services/bills');

var DEFAULT_PAGE_SIZE = 30;

/**
 * Bills
 * @type {object}
 */
module.exports = {
  /**
   * Prepare For API Output
   * @param {object} data - Data to be processed for API Output
   * @return {object}
   */
  prepareForAPIOutput: function(data) {
    var i;
    var results = [];
    var fields = [
      'bill_id',
      'chamber',
      'city',
      'details_url',
      'long_description',
      'progress',
      'session_id',
      'short_description',
      'state',
      'status',
      'vote'
    ];

    if (typeof data === 'object') {
      for (i = 0; i < data.length; i++) {
        results.push(_.pick(data[i].dataValues, fields));
      }

      // Sort bills by chamber
      var preparedData = {
        upper: [],
        lower: []
      };

      for (i = 0; i < results.length; i++) {
        preparedData[results[i].chamber].push(results[i]);
      }

      return preparedData;
    } else {
      return results;
    }
  },

  /**
   * Search Bills
   * @param request
   * @property {enum} [status] - Status of Bill ['considering','passed','failed']
   * @property {enum} [progress] - Whether this bill passing is Good or Bad ['good','bad']
   * @property {enum} [chamber] - Which Chamber of Congress this bill is for ['upper','lower']
   * @property {string} [state] - Two Letter US State Code Abbreviation ( ISO 3166 )
   * @property {string} [city] - Specific City this Bill Belongs to
   * @property {string} [billId] - Unique Bill ID from Open States
   * @property {string} [repId] - Unique Representative ID from Open States
   * @property {string} [sessionId] - Unique Session ID from Open States
   * @property {string} [beforeDate] - Filter by Bills Created Before or On this Date
   * @property {string} [afterDate] - Filter by Bills Created After or On this Date
   * @returns {object}
   */
  searchBills: function (request) {

    var pageSize = DEFAULT_PAGE_SIZE;
    var page = 1;
    var offset;
    var i = 0;
    var j = 0;

    // Page size
    if (request.pageSize && validator.isInt(request.pageSize) && validator.toInt(request.pageSize, 10) >= 1) {
      pageSize = validator.toInt(request.pageSize, 10);
    }

    // Determine Page
    if (request.page && validator.isInt(request.page) && validator.toInt(request.page, 10) >= 1) {
      page = validator.toInt(request.page, 10);
    }

    offset = (page - 1) * pageSize;

    var searchParams = {
      published: {
        $eq: true
      }
    };

    /**
     * Filter by Status
     */
    if (request.status) {
      searchParams.status = {
        $eq: request.status
      };
    }

    /**
     * Filter by Progress
     */
    if (request.progress) {
      searchParams.progress = {
        $eq: request.progress
      };
    }

    /**
     * Filter by Chamber
     */
    if (request.chamber) {
      searchParams.chamber = {
        $eq: request.chamber
      };
    }

    /**
     * Filter by State
     */
    if (request.state) {
      searchParams.state = {
        $eq: request.state
      };
    }

    /**
     * Filter by City
     */
    if (request.city) {
      searchParams.city = {
        $like: request.city
      };
    }

    /**
     * Filter by Bills, using $and lookup since these can be typed a bunch of ways
     */
    if (request.billId) {
      var lookup_bill = request.billId.match(/[a-zA-Z]+|[0-9]+/g);

      searchParams.bill_id = {
        $and: []
      };

      for (i = 0; i < lookup_bill.length; i++) {
        searchParams.bill_id.$and.push({
          $like: '%' + lookup_bill[i] + '%'
        });
      }
    }

    /**
     * Filter by Session ID, using $and lookup since these can be typed a bunch of ways
     */
    if (request.sessionId) {
      var lookup_session = request.sessionId.match(/[a-zA-Z]+|[0-9]+/g);

      searchParams.session_id = {
        $and: []
      };

      for (i = 0; i < lookup_session.length; i++) {
        searchParams.session_id.$and.push({
          $like: '%' + lookup_session[i] + '%'
        });
      }
    }

    /**
     * Filter by Bills Created Before this Date
     */
    if (request.beforeDate) {
      searchParams.modified_date = {
        $lte: request.beforeDate
      };
    }

    /**
     * Filter by Bills Created Before this Date
     */
    if (request.afterDate) {
      searchParams.modified_date = {
        $gte: request.afterDate
      };
    }

    return Bills.findAndCountAll({
      limit: pageSize,
      offset: offset,
      where: searchParams
    })
    .then(function(data) {
      data.meta = {
        total: data.count,
        showing: data.rows.length,
        pages: Math.ceil(data.count / pageSize),
        page: page
      };

      if (data.rows.length > 0) {
        // Check if we should fetch Open States Data
        var fetchOpenStates = false;

        // Setup Bill Vote Response
        var vote = 'unknown';

        // Set Default Vote for each response
        for (i = 0; i < data.rows.length; i++) {
          data.rows[i].dataValues.vote = vote;
        }

        var firstRow = data.rows[0].dataValues;

        // Check if we have a result that we can actually fetch Open States with if searching for a specific Bill
        if(request.billId && request.repId && data.rows && (data.rows.length === 1 || data.rows.length === 2) && firstRow.state && firstRow.session_id && firstRow.bill_id) {
          /* istanbul ignore else */
          if (data.rows.length === 1) {
            fetchOpenStates = true;
          } else if (data.rows.length === 2 && firstRow.state === data.rows[1].dataValues.state && firstRow.session_id === data.rows[1].dataValues.session_id && firstRow.bill_id === data.rows[1].dataValues.bill_id) {
            fetchOpenStates = true;
          }
        }

        // Use the Data in our API rather than the search query as ours is mapped Open States and query might not be
        if (fetchOpenStates) {
          var openStatesURL = 'https://openstates.org/api/v1/bills/'+ encodeURIComponent(firstRow.state) +'/' + encodeURIComponent(firstRow.session_id) + '/' + encodeURIComponent(firstRow.bill_id) + '/?apikey=' + config.get('openStates.key');

          return external.getContent(openStatesURL)
            .then(function (response) {
              var openStates = JSON.parse(response);

              for (i = 0; i < openStates.votes.length; i++) {
                for (j = 0; j < openStates.votes[i].yes_votes.length; j++) {
                  /* istanbul ignore else */
                  if(openStates.votes[i].yes_votes[j].leg_id === request.repId) {
                    vote = 'supported';
                    break;
                  }
                }
                for (j = 0; j < openStates.votes[i].no_votes.length; j++) {
                  /* istanbul ignore else */
                  if (openStates.votes[i].no_votes[j].leg_id === request.repId) {
                    vote = 'opposed';
                    break;
                  }
                }
              }

              for (i = 0; i < data.rows.length; i++) {
                data.rows[i].dataValues.vote = vote;
              }

              return Promise.resolve(data);
            })
            .catch(function (err) {
              return Promise.reject('Unable to Get Content. ' + err);
            });
        } else {
          return Promise.resolve(data);
        }
      } else {
        return Promise.reject('Make Sure `state`, `sessionId` & `billId` are valid.');
      }
    })
    .catch(function (err) {
      return Promise.reject('Unable to Find Matching Bills. ' + err);
    });
  }
};
