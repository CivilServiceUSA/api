/**
 * @module domain/city_council
 * @version 1.0.2
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var validator = require('validator');
var moment = require('moment');
var util = require('./util');
var config = require('../../../config');
var elasticsearchClient = require('../../../elasticsearch/client');
var ZipCode = require('../../../models/civil_services/zipcode');

var env = config.get('env');
var indexType = env + '_city_council';
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
      'address_city',
      'address_complete',
      'address_number',
      'address_prefix',
      'address_sec_unit_num',
      'address_sec_unit_type',
      'address_state',
      'address_street',
      'address_type',
      'address_zipcode',
      'age',
      'aliases',
      'at_large',
      'background_url',
      'city_council_calendar_url',
      'city_council_committees_url',
      'city_council_legislation_url',
      'city_council_url',
      'city_government_url',
      'city_name',
      'city_name_slug',
      'date_of_birth',
      'district',
      'email',
      'entered_office',
      'ethnicity',
      'facebook_url',
      'first_name',
      'gender',
      'goes_by',
      'last_name',
      'latitude',
      'longitude',
      'middle_name',
      'name',
      'name_slug',
      'name_suffix',
      'party',
      'phone',
      'photo_url',
      'population',
      'pronunciation',
      'state_code',
      'state_code_slug',
      'state_name',
      'state_name_slug',
      'term_end',
      'title',
      'twitter_handle',
      'twitter_url',
      'vacant'
    ];

    return _.pick(data._source, fields);
  },

  /**
   * Prepare For Elastic Search
   * @param {object} data - Data to be Processed for Elastic Search
   * @return {object}
   */
  prepareForElasticSearch: function(data) {
    var birthday = moment(data.date_of_birth);
    var age = (!data.date_of_birth) ? null : moment().diff(birthday, 'years');

    return {
      age: age,
      state_name: data.state_name,
      state_name_slug: data.state_name_slug,
      state_code: data.state_code,
      state_code_slug: data.state_code_slug,
      city_name: data.state_name,
      city_name_slug: data.state_name_slug,
      district: data.district,
      at_large: data.at_large,
      vacant: data.vacant,
      title: data.title,
      party: data.party,
      name: data.name,
      name_slug: data.name_slug,
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      name_suffix: data.name_suffix,
      goes_by: data.goes_by,
      pronunciation: data.pronunciation,
      gender: data.gender,
      ethnicity: data.ethnicity,
      date_of_birth: data.date_of_birth,
      entered_office: data.entered_office,
      term_end: data.term_end,
      email: data.email,
      phone: data.phone,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      address_complete: data.address_complete,
      address_number: data.address_number,
      address_prefix: data.address_prefix,
      address_street: data.address_street,
      address_sec_unit_type: data.address_sec_unit_type,
      address_sec_unit_num: data.address_sec_unit_num,
      address_city: data.address_city,
      address_state: data.address_state,
      address_zipcode: data.address_zipcode,
      address_type: data.address_type,
      population: data.population,
      background_url: data.background_url,
      city_government_url: data.city_government_url,
      city_council_url: data.city_council_url,
      city_council_calendar_url: data.city_council_calendar_url,
      city_council_legislation_url: data.city_council_legislation_url,
      city_council_committees_url: data.city_council_committees_url,
      twitter_handle: data.twitter_handle,
      twitter_url: data.twitter_url,
      facebook_url: data.facebook_url,
      photo_url: data.photo_url,
      location: {
        lat: parseFloat(data.latitude),
        lon: parseFloat(data.longitude)
      },
      shape: data.shape,
      aliases: data.getAliases()
    };
  },

  /**
   * Search City COuncil
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
    var sort = (query.sort) ? query.sort.split(',') : ['state_code', 'city_name_slug', 'district'];
    var order = (query.order) ? query.order.toLowerCase().split(',') : ['asc', 'asc', 'asc'];

    searchParams.body.sort = {};

    for (var i = 0; i < sort.length; i++) {
      var sortOrder = (typeof order[i] !== 'undefined' && ( order[i] === 'asc' || order[i] === 'desc' )) ? order[i] : 'asc';
      searchParams.body.sort[sort[i]] = {
        order: sortOrder
      };
    }

    /**
     * Filter By State
     */
    if (query.state) {
      andFilters = getAndFilters();
      andFilters.push({
        multi_match: {
          query: query.state,
          type: 'phrase',
          fields: ['state_name', 'state_code']
        }
      });
    }

    /**
     * Filter By District
     */
    if (query.district) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          district: query.district
        }
      });
    }

    /**
     * Filter By at Large
     */
    if (query.atLarge) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          at_large: query.atLarge
        }
      });
    }

    /**
     * Filter By Vacant
     */
    if (query.vacant) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          vacant: query.vacant
        }
      });
    }

    /**
     * Filter By Title
     */
    if (query.title) {
      andFilters = getAndFilters();
      andFilters.push({
        terms: {
          title: query.title.split(','),
          minimum_should_match: 1
        }
      });
    }

    /**
     * Filter By Party
     */
    if (query.party) {
      andFilters = getAndFilters();
      andFilters.push({
        terms: {
          party: query.party.split(','),
          minimum_should_match: 1
        }
      });
    }

    /**
     * Filter By Name
     */
    if (query.name) {
      andFilters = getAndFilters();
      andFilters.push({
        multi_match: {
          query: query.name,
          type: 'phrase',
          fields: ['name', 'first_name', 'last_name']
        }
      });
    }

    /**
     * Filter By Gender
     */
    if (query.gender) {
      andFilters = getAndFilters();
      andFilters.push({
        terms: {
          gender: query.gender.split(','),
          minimum_should_match: 1
        }
      });
    }

    /**
     * Filter By Ethnicity
     */
    if (query.ethnicity) {
      andFilters = getAndFilters();
      andFilters.push({
        terms: {
          ethnicity: query.ethnicity.split(','),
          minimum_should_match: 1
        }
      });
    }

    /**
     * Filter By Age
     */
    if (query.age) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          age: query.age
        }
      });
    }

    /**
     * Filter By Minimum Age
     */
    if (query.minAge) {
      andFilters = getAndFilters();
      andFilters.push({
        range: {
          age: {
            gte: parseInt(query.minAge, 0)
          }
        }
      });
    }

    /**
     * Filter By Maximum Age
     */
    if (query.maxAge) {
      andFilters = getAndFilters();
      andFilters.push({
        range: {
          age: {
            lte: parseInt(query.maxAge, 0)
          }
        }
      });
    }

    /**
     * Filter By Term End Date
     */
    if (query.termEnds) {
      andFilters = getAndFilters();
      andFilters.push({
        range: {
          term_end: {
            lte: (parseInt(query.termEnd, 0) + 1).toString(),
            gte: parseInt(query.termEnd, 0).toString(),
            format: 'yyyy'
          }
        }
      });
    }

    /**
     * Filter By Term End Before Date
     */
    if (query.termEndsBefore) {
      andFilters = getAndFilters();
      andFilters.push({
        range: {
          term_end: {
            lt: parseInt(query.termEndsBefore, 0).toString(),
            format: 'yyyy'
          }
        }
      });
    }

    /**
     * Filter By Term End After Date
     */
    if (query.termEndsAfter) {
      andFilters = getAndFilters();
      andFilters.push({
        range: {
          term_end: {
            gt: parseInt(query.termEndsAfter, 0).toString(),
            format: 'yyyy'
          }
        }
      });
    }

    /**
     * Filter By Entered Office Date
     */
    if (query.enteredOffice) {
      andFilters = getAndFilters();
      andFilters.push({
        range: {
          entered_office: {
            lte: (parseInt(query.enteredOffice, 0) + 1).toString(),
            gte: parseInt(query.enteredOffice, 0).toString(),
            format: 'yyyy'
          }
        }
      });
    }

    /**
     * Filter By Entered Office Before Date
     */
    if (query.enteredOfficeBefore) {
      andFilters = getAndFilters();
      andFilters.push({
        range: {
          entered_office: {
            lt: parseInt(query.enteredOfficeBefore, 0).toString(),
            format: 'yyyy'
          }
        }
      });
    }

    /**
     * Filter By Entered Office After Date
     */
    if (query.enteredOfficeAfter) {
      andFilters = getAndFilters();
      andFilters.push({
        range: {
          entered_office: {
            gt: parseInt(query.enteredOfficeAfter, 0).toString(),
            format: 'yyyy'
          }
        }
      });
    }

    /**
     * Filter By Latitude & Longitude
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
              radius: '0.25km'
            }
          }
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

            andFilters.push({
              geo_shape: {
                shape: {
                  shape: {
                    coordinates: zipcode.shape.coordinates,
                    type: 'polygon'
                  }
                }
              }
            });

            return elasticsearchClient.search(searchParams)
              .then(function(result) {
                var notices = [];

                // Should normally only have three results ( Councilor, Mayor & District Attorney )
                if (query.zipcode && result.hits.total > 3) {
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
                  data: result.hits.hits.map(self.prepareForAPIOutput)
                };
              })
              .catch(function(error) {
                return util.createAPIResponse({
                  errors: [ query.zipcode + ' Zip Code Not Found' ]
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
          var notices = [];

          // Should normally only have three results ( Councilor, Mayor & District Attorney )
          if (query.zipcode && result.hits.total > 3) {
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
            data: result.hits.hits.map(self.prepareForAPIOutput)
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
