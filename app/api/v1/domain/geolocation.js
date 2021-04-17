/**
 * @module domain/geolocation
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var validator = require('validator');
var util = require('./util');
var config = require('../../../config');
var elasticsearchClient = require('../../../elasticsearch/client');
var mmdbreader = require('maxmind-db-reader');
var Promise = require('bluebird');

var env = config.get('env');
var indexType = env + '_geolocation';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

var DEFAULT_PAGE_SIZE = 30;

/**
 * Geolocation
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
      'alternate_city_names',
      'area_codes',
      'city',
      'county',
      'estimated_population',
      'location',
      'state',
      'timezone',
      'zipcode'
    ];

    return _.pick(data._source, fields);
  },

  /**
   * Prepare For Elastic Search
   * @param {object} data - Data to be Processed for Elastic Search
   * @param {object} data.id - Tag ID
   * @param {object} data.name - Tag Name
   * @param {object} data.slug - Tag Slug
   * @return {object}
   */
  prepareForElasticSearch: function(data) {
    return {
      alternate_city_names: (data.acceptable_cities && data.acceptable_cities.length > 0) ? data.acceptable_cities.split(', ') : [],
      area_codes: (data.area_codes && data.area_codes.length > 0) ? data.area_codes.split(',') : [],
      city: data.primary_city,
      county: data.county,
      estimated_population: data.estimated_population,
      id: data.id,
      latitude: parseFloat(data.latitude),
      location: {
        lat: parseFloat(data.latitude),
        lon: parseFloat(data.longitude)
      },
      longitude: parseFloat(data.longitude),
      state: data.state,
      timezone: data.timezone,
      zipcode: data.zipcode
    };
  },

  /**
   *
   * @param {string} zipcode
   * @returns {*}
   */
  getZipcode: function (zipcode) {

    var self = this;
    var searchParams = {
      index: indexName,
      body: {
        query: {
          match: {
            zipcode: zipcode
          }
        }
      }
    };

    return elasticsearchClient.search(searchParams)
      .then(function(result) {
        var data = result.hits.hits.map(self.prepareForAPIOutput);
        return {
          data: data
        };
      })
      .catch(function(error) {
        return {
          errors: [error],
          data: null
        };
      });
  },

  /**
   * Get Location
   * @param {object} query - GET Parameters
   * @returns {*}
   */
  getLocation: function (query) {

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

    function setGeoFilters(filter) {
      if (!_.get(searchParams, 'body.query.filtered.filter')) {
        _.set(searchParams, 'body.query.filtered.filter', filter);
      }
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
    var sort = (query.sort) ? query.sort.split(',') : [];
    var order = (query.order) ? query.order.toLowerCase().split(',') : [];

    searchParams.body.sort = {};

    for (var i = 0; i < sort.length; i++) {
      var sortOrder = (typeof order[i] !== 'undefined' && ( order[i] === 'asc' || order[i] === 'desc' )) ? order[i] : 'asc';
      searchParams.body.sort[sort[i]] = {
        order: sortOrder
      };
    }

    /**
     * Filter By Unique Zip Code
     */
    if (query.zipcode) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          zipcode: query.zipcode
        }
      });
    }

    /**
     * Filter By City
     */
    if (query.city) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          city: query.city.toLowerCase()
        }
      });

      andFilters.push({
        match: {
          alternate_city_names: query.city.toLowerCase()
        }
      });
    }

    /**
     * Filter By County
     */
    if (query.county) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          county: query.county.toLowerCase()
        }
      });
    }

    /**
     * Filter By State
     */
    if (query.state) {
      andFilters = getAndFilters();
      andFilters.push({
        term: {
          state: query.state.toLowerCase()
        }
      });
    }

    /**
     * Filter By Type
     */
    if (query.type) {
      andFilters = getAndFilters();
      andFilters.push({
        term: {
          type: query.type.toLowerCase()
        }
      });
    }

    /**
     * Filter By Area Code
     */
    if (query.areaCode) {
      andFilters = getAndFilters();
      andFilters.push({
        term: {
          area_codes: query.areaCode
        }
      });
    }

    /**
     * Filter By Time Zone
     */
    if (query.timezone) {
      andFilters = getAndFilters();
      andFilters.push({
        term: {
          timezone: query.timezone.toLowerCase()
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
          estimated_population: {
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
          estimated_population: {
            lte: parseInt(query.maxPopulation, 0)
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
              type: 'point'
            }
          }
        }
      });
    }

    return elasticsearchClient.search(searchParams)
      .then(function(result) {
        return {
          meta: {
            total: result.hits.total,
            showing: result.hits.hits.length,
            pages: Math.ceil(result.hits.total / searchParams.size),
            page: page
          },
          data: result.hits.hits.map(self.prepareForAPIOutput)
        };
      })
      .catch(function(error) {
        return util.createAPIResponse({
          errors: [error]
        });
      });
  },

  /**
   * Get IP Address
   * @param {string} ip - IP Address to Lookup
   * @param {string} source - Data Source [ 'cities', 'countries' ]
   * @returns {*}
   */
  getIpAddress: function (ip, source) {
    var possibleSources = ['cities', 'countries'];

    return new Promise(function (resolve, reject) {
      if (possibleSources.indexOf(source) !== -1) {
        mmdbreader.open('./app/flat-db/' + source + '.mmdb',function(err, cities) {
          cities.getGeoData(ip, function(err, geodata) {
            if (err) {
              reject(err);
            } else {
              resolve(geodata);
            }
          });
        });
      } else {
        reject('Invalid Source');
      }
    });
  }
};
