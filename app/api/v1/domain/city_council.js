/**
 * @module domain/city_council
 * @version 1.1.0
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
      'civil_services_url',
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
      'photo_url_sizes',
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
      address_city: data.address_city,
      address_complete: data.address_complete,
      address_number: data.address_number,
      address_prefix: data.address_prefix,
      address_sec_unit_num: data.address_sec_unit_num,
      address_sec_unit_type: data.address_sec_unit_type,
      address_state: data.address_state,
      address_street: data.address_street,
      address_type: data.address_type,
      address_zipcode: data.address_zipcode,
      age: age,
      aliases: data.getAliases(),
      at_large: data.at_large,
      background_url: data.background_url,
      city_council_calendar_url: data.city_council_calendar_url,
      city_council_committees_url: data.city_council_committees_url,
      city_council_legislation_url: data.city_council_legislation_url,
      city_council_url: data.city_council_url,
      city_government_url: data.city_government_url,
      city_name: data.city_name,
      city_name_slug: data.city_name_slug,
      civil_services_url: data.civil_services_url,
      date_of_birth: data.date_of_birth,
      district: data.district,
      email: data.email,
      entered_office: data.entered_office,
      ethnicity: data.ethnicity,
      facebook_url: data.facebook_url,
      first_name: data.first_name,
      gender: data.gender,
      goes_by: data.goes_by,
      last_name: data.last_name,
      latitude: parseFloat(data.latitude),
      location: {
        lat: parseFloat(data.latitude),
        lon: parseFloat(data.longitude)
      },
      longitude: parseFloat(data.longitude),
      middle_name: data.middle_name,
      name: data.name,
      name_slug: data.name_slug,
      name_suffix: data.name_suffix,
      party: data.party,
      phone: data.phone,
      photo_url: data.photo_url,
      photo_url_sizes: data.photo_url_sizes,
      population: data.population,
      pronunciation: data.pronunciation,
      shape: data.shape,
      state_code: data.state_code,
      state_code_slug: data.state_code_slug,
      state_name: data.state_name,
      state_name_slug: data.state_name_slug,
      term_end: data.term_end,
      title: data.title,
      twitter_handle: data.twitter_handle,
      twitter_url: data.twitter_url,
      vacant: data.vacant,
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
      data[i].photo_url_sizes = {
        size_64x64: data[i].photo_url.replace('512x512', '64x64'),
        size_128x128: data[i].photo_url.replace('512x512', '128x128'),
        size_256x256: data[i].photo_url.replace('512x512', '256x256'),
        size_512x512: data[i].photo_url,
        size_1024x1024: data[i].photo_url.replace('512x512', '1024x1024')
      };

      data[i].date_of_birth = (data[i].date_of_birth) ? data[i].date_of_birth.substring(0, 10) : null;
      data[i].entered_office = (data[i].entered_office) ? data[i].entered_office.substring(0, 10) : null;
      data[i].term_end = (data[i].term_end) ? data[i].term_end.substring(0, 10) : null;

      data[i].civil_services_url = 'https://civil.services/city-council/' + data[i].state_name_slug + '/' + data[i].city_name_slug + '/councilor/' + data[i].name_slug;

      var sorted = util.sortByKeys(data[i]);

      extended.push(sorted);
    }

    return extended;
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
     * Filter By State
     */
    if (query.state) {
      andFilters = getAndFilters();
      andFilters.push({
        multi_match: {
          query: query.state,
          type: 'phrase',
          fields: ['state_name', 'state_code', 'state_code_slug']
        }
      });
    }

    /**
     * Filter By City
     */
    if (query.city) {
      andFilters = getAndFilters();
      andFilters.push({
        multi_match: {
          query: query.city,
          type: 'phrase',
          fields: ['city_name', 'city_name_slug']
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
        query_string: {
          query: query.name + '*',
          fields: ['name^2', 'first_name', 'last_name'],
          fuzziness: 'AUTO'
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
              type: 'point'
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
          fields: ['name', 'first_name', 'last_name', 'title'],
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

            andFilters.push({
              geo_shape: {
                shape: {
                  shape: {
                    coordinates: [
                      zipcode.longitude,
                      zipcode.latitude
                    ],
                    type: 'point'
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

                var data = result.hits.hits.map(self.prepareForAPIOutput);
                var extended = self.extendData(data);

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

          var data = result.hits.hits.map(self.prepareForAPIOutput);
          var extended = self.extendData(data);

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
            errors: [error]
          });
        });
    }
  }
};
