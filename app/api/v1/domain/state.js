/**
 * @module domain/state
 * @version 1.1.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var State = require('../../../models/civil_services/state');
var util = require('./util');
var config = require('../../../config');
var elasticsearchClient = require('../../../elasticsearch/client');
var Promise = require('bluebird');
var validator = require('validator');
var ZipCode = require('../../../models/civil_services/zipcode');

var env = config.get('env');
var indexType = env + '_state';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

var DEFAULT_PAGE_SIZE = 30;

/**
 * Domain Profile
 * @type {object}
 */
module.exports = {
  /**
   * Prepare For API Output
   * @param {object} data - Data to be processed for API Output
   * @return {object}
   */
  prepareForAPIOutput: function(data) {
    var fields = [
      'admission_date',
      'admission_number',
      'capital_city',
      'capital_url',
      'civil_services_url',
      'constitution_url',
      'facebook_url',
      'landscape_background_url',
      'map_image_url',
      'name',
      'nickname',
      'photo_url',
      'population',
      'population_rank',
      'skyline_background_url',
      'state_code',
      'state_code_slug',
      'state_flag_url',
      'state_name',
      'state_name_slug',
      'state_seal_url',
      'twitter_handle',
      'twitter_url',
      'website'
    ];

    return _.pick(data._source, fields);
  },

  /**
   * Prepare For Elastic Search
   * @param {object} data - Data to be Processed for Elastic Search
   * @return {object}
   */
  prepareForElasticSearch: function(data) {
    return {
      admission_date: data.admission_date,
      admission_number: data.admission_number,
      capital_city: data.capital_city,
      capital_url: data.capital_url,
      civil_services_url: data.civil_services_url,
      constitution_url: data.constitution_url,
      facebook_url: data.facebook_url,
      landscape_background_url: data.landscape_background_url,
      map_image_url: data.map_image_url,
      name: data.state_name,
      nickname: data.nickname,
      photo_url: data.landscape_background_url,
      population: data.population,
      population_rank: data.population_rank,
      shape: data.shape,
      skyline_background_url: data.skyline_background_url,
      state_code: data.state_code,
      state_code_slug: data.state_code_slug,
      state_flag_url: data.state_flag_url,
      state_name: data.state_name,
      state_name_slug: data.state_name_slug,
      state_seal_url: data.state_seal_url,
      twitter_handle: data.twitter_handle,
      twitter_url: data.twitter_url,
      website: data.website
    };
  },

  /**
   * Extend Data - There are a few URL's we can provide with the core set of data we have collected
   * that are not really needed in our database as they can be automated.  So this method creates the data
   * we did not store in the database.
   * @param data
   * @returns {Array}
   */
  extendData: function (data) {
    var extended = [];

    for (var i = 0; i < data.length; i++) {
      data[i].state_flag = {
        large: data[i].state_flag_url,
        small: data[i].state_flag_url.replace('-large.png', '-small.png')
      };

      data[i].state_seal = {
        large: data[i].state_seal_url,
        small: data[i].state_seal_url.replace('-large.png', '-small.png')
      };

      data[i].map = {
        large: data[i].map_image_url,
        small: data[i].map_image_url.replace('-large.png', '-small.png')
      };

      data[i].landscape = {
        size_640x360: data[i].landscape_background_url.replace('1280x720', '640x360'),
        size_960x540: data[i].landscape_background_url.replace('1280x720', '960x540'),
        size_1280x720: data[i].landscape_background_url,
        size_1920x1080: data[i].landscape_background_url.replace('1280x720', '1920x1080')
      };

      data[i].skyline = {
        size_640x360: data[i].skyline_background_url.replace('1280x720', '640x360'),
        size_960x540: data[i].skyline_background_url.replace('1280x720', '960x540'),
        size_1280x720: data[i].skyline_background_url,
        size_1920x1080: data[i].skyline_background_url.replace('1280x720', '1920x1080')
      };

      data[i].civil_services_url = 'https://civil.services/state/' + data[i].state_name_slug;

      data[i].admission_date = (data[i].admission_date) ? data[i].admission_date.substring(0, 10) : null;


      var sorted = util.sortByKeys(data[i]);
      extended.push(sorted);
    }

    return extended;
  },

  /**
   * Get State
   * @param {number} state - State
   * @returns {*}
   */
  getState: function(state) {
    if (state) {
      return State.findOne({
          where: {
            $or: {
              state_name: state,
              state_name_slug: state,
              state_code: state
            }
          },
          order: [
            [
              'created_date', 'DESC'
            ]
          ]
        })
        .then(function(state) {
          if (state) {
            return {
              state_name: state.state_name,
              state_name_slug: state.state_name_slug,
              state_code: state.state_code,
              state_code_slug: state.state_code_slug,
              nickname: state.nickname,
              website: state.website,
              admission_date: state.admission_date,
              admission_number: state.admission_number,
              capital_city: state.capital_city,
              capital_url: state.capital_url,
              civil_services_url: 'https://civil.services/state/' + state.state_name_slug,
              population: state.population,
              population_rank: state.population_rank,
              constitution_url: state.constitution_url,
              state_flag: {
                large: state.state_flag_url,
                small: state.state_flag_url.replace('-large.png', '-small.png')
              },
              state_seal: {
                large: state.state_seal_url,
                small: state.state_seal_url.replace('-large.png', '-small.png')
              },
              map: {
                large: state.map_image_url,
                small: state.map_image_url.replace('-large.png', '-small.png')
              },
              landscape: {
                size_640x360: state.landscape_background_url.replace('1280x720', '640x360'),
                size_960x540: state.landscape_background_url.replace('1280x720', '960x540'),
                size_1280x720: state.landscape_background_url,
                size_1920x1080: state.landscape_background_url.replace('1280x720', '1920x1080')
              },
              skyline: {
                size_640x360: state.skyline_background_url.replace('1280x720', '640x360'),
                size_960x540: state.skyline_background_url.replace('1280x720', '960x540'),
                size_1280x720: state.skyline_background_url,
                size_1920x1080: state.skyline_background_url.replace('1280x720', '1920x1080')
              },
              twitter_handle: state.twitter_handle,
              twitter_url: state.twitter_url,
              facebook_url: state.facebook_url
            };
          } else {
            return Promise.reject('No found for ' + state);
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  },

  /**
   * Get State
   * @param {object} query - GET Parameters
   * @returns {*}
   */
  search: function (query) {

    // Defaults
    var andFilters;
    var pageSize = DEFAULT_PAGE_SIZE;
    var page = 1;
    var self = this;
    var searchParams = {
      index: indexName,
      type: indexType,
      body: {}
    };

    function getAndFilters() {
      if (!_.get(searchParams, 'body.query.bool.must')) {
        _.set(searchParams, 'body.query.bool.must', []);
      }

      return _.get(searchParams, 'body.query.bool.must');
    }

    // Page size
    if (query.pageSize && validator.isInt(query.pageSize) && validator.toInt(query.pageSize, 10) >= 1) {
      pageSize = validator.toInt(query.pageSize, 10);
    }

    searchParams.size = pageSize;

    // Determine Page
    if (query.page && validator.isInt(query.page) && validator.toInt(query.page, 10) >= 1) {
      page = validator.toInt(query.page, 10);
    }

    searchParams.from = (page - 1) * searchParams.size;

    // Sorting
    var sort = (query.sort) ? query.sort.split(',') : ['state_name'];
    var order = (query.order) ? query.order.toLowerCase().split(',') : ['asc'];

    searchParams.body.sort = {};

    for (var i = 0; i < sort.length; i++) {
      var sortOrder = (typeof order[i] !== 'undefined' && ( order[i] === 'asc' || order[i] === 'desc' )) ? order[i] : 'asc';
      searchParams.body.sort[sort[i]] = {
        order: sortOrder
      };
    }

    /**
     * Filter By State Name
     */
    if (query.name) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          state_name: query.name
        }
      });
    }

    /**
     * Filter By State Slug
     */
    if (query.slug) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          state_name_slug: query.slug
        }
      });
    }

    /**
     * Filter By State Code
     */
    if (query.code) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          state_code: query.code
        }
      });
    }

    /**
     * Filter By State Nickname
     */
    if (query.nickname) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          nickname: query.nickname
        }
      });
    }

    /**
     * Filter By Minimum Population
     */
    if (query.minPopulation) {
      andFilters = getAndFilters();
      andFilters.push({
        range: {
          population: {
            gte: parseInt(query.minPopulation, 0)
          }
        }
      });
    }

    /**
     * Filter By Maximum Population
     */
    if (query.maxPopulation) {
      andFilters = getAndFilters();
      andFilters.push({
        range: {
          population: {
            lte: parseInt(query.maxPopulation, 0)
          }
        }
      });
    }

    /**
     * Filter By Minimum Population
     */
    if (query.admittedBefore) {
      andFilters = getAndFilters();
      andFilters.push({
        range: {
          admission_date: {
            lte: query.admittedBefore
          }
        }
      });
    }

    /**
     * Filter By Maximum Population
     */
    if (query.admittedAfter) {
      andFilters = getAndFilters();
      andFilters.push({
        range: {
          admission_date: {
            gte: query.admittedAfter
          }
        }
      });
    }

    /**
     * Filter By Latitude, Longitude & Distance
     */
    if (query.latitude && query.longitude) {
      andFilters = getAndFilters();
      andFilters.push({
        geo_shape: {
          shape: {
            shape: {
              coordinates: [
                query.longitude,
                query.latitude
              ],
              type: 'circle',
              radius: '0.01km'
            }
          }
        }
      });
    }

    /**
     * Filter By Keyword
     */
    if (query.keyword) {
      andFilters = getAndFilters();
      andFilters.push({
        query_string: {
          query: '*' + query.keyword + '*',
          fields: ['state_name'],
          fuzziness: 'AUTO'
        }
      });
    }

    /**
     * Filter By Latitude & Longitude
     */
    if (query.zipcode) {
      return ZipCode.findOne({
        where: {
          zipcode: query.zipcode
        }
      })
        .then(function(zipcode) {
          if (zipcode && zipcode.state && zipcode.shape && zipcode.shape.coordinates) {
            andFilters = getAndFilters();
            andFilters.push({
              match: {
                state_code: zipcode.state
              }
            });

            return elasticsearchClient.search(searchParams)
              .then(function(result) {
                var data = result.hits.hits.map(self.prepareForAPIOutput);
                var extended = self.extendData(data);

                var notices = [];

                if (query.zipcode && result.hits.total > 1) {
                  notices.push('Try using `latitude` & `longitude` for more specific `house` district results.');
                }

                return {
                  notices: notices,
                  meta: {
                    total: result.hits.total,
                    showing: result.hits.hits.length,
                    pages: Math.ceil(result.hits.total / searchParams.size),
                    page: page
                  },
                  data: extended
                };
              })
              .catch(function(error) {
                return util.createAPIResponse({
                  errors: [ 'No Districts found for ' + query.zipcode + ' Zip Code' ]
                });
              });
          } else {
            return {
              errors: [ query.zipcode + ' Zip Code Not Found' ]
            };
          }
        }).catch(function(error) {
          return {
            errors: [ query.zipcode + ' Zip Code Not Found' ]
          };
        });
    } else {
      return elasticsearchClient.search(searchParams)
        .then(function(result) {
          var data = result.hits.hits.map(self.prepareForAPIOutput);
          var extended = self.extendData(data);

          return {
            meta: {
              total: result.hits.total,
              showing: result.hits.hits.length,
              pages: Math.ceil(result.hits.total / searchParams.size),
              page: page
            },
            data: extended
          };
        })
        .catch(function(error) {
          return util.createAPIResponse({
            errors: [error]
          });
        });
    }
  }
};
