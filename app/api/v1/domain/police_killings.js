/**
 * @module domain/police_killings
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var validator = require('validator');
var Promise = require('bluebird');

var util = require('./util');
var PoliceKillings = require('../../../models/civil_services/police_killings');

var DEFAULT_PAGE_SIZE = 30;

/**
 * Police Killings
 * @type {object}
 */
module.exports = {
  /**
   * Prepare For API Output
   * @param {object} data - Data to be processed for API Output
   * @return {object}
   */
  prepareForAPIOutput: function(data) {
    var results = [];
    var fields = [
      'city',
      'killings',
      'state'
    ];

    for (var i = 0; i < data.length; i++) {
      results.push(_.pick(data[i].dataValues, fields));
    }

    return results;
  },

  /**
   * Search Police Killings
   * @param request
   * @property {string} [state] - Two Letter US State Code Abbreviation ( ISO 3166 )
   * @property {string} [city] - Specific City this Bill Belongs to
   * @property {number} [min] - Minimum Number of Police Killings
   * @property {number} [max] - Maximum Number of Police Killings
   * @property {string} [beforeDate] - Filter by Bills Created Before or On this Date
   * @property {string} [afterDate] - Filter by Bills Created After or On this Date
   * @returns {object}
   */
  searchPoliceKillings: function (request) {

    var pageSize = DEFAULT_PAGE_SIZE;
    var page = 1;
    var offset;

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
     * Filter by Minimum Killings
     */
    if (request.min) {
      searchParams.killings = {
        $gte: request.min
      };
    }

    /**
     * Filter by Maximum Killings
     */
    if (request.max) {
      searchParams.killings = {
        $lte: request.max
      };
    }

    /**
     * Filter by Killings Created Before this Date
     */
    if (request.beforeDate) {
      searchParams.modified_date = {
        $lte: request.beforeDate
      };
    }

    /**
     * Filter by Killings Created Before this Date
     */
    if (request.afterDate) {
      searchParams.modified_date = {
        $gte: request.afterDate
      };
    }

    return PoliceKillings.findAndCountAll({
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

      return Promise.resolve(data);
    });
  }
};
