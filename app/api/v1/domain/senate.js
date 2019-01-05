/**
 * @module domain/senate
 * @version 1.0.4
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
var indexType = env + '_senate';
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
      'biography',
      'bioguide',
      'civil_services_url',
      'class',
      'contact_page',
      'date_of_birth',
      'entered_office',
      'ethnicity',
      'facebook_url',
      'fax',
      'fec',
      'first_name',
      'gender',
      'goes_by',
      'google_entity_id',
      'last_name',
      'latitude',
      'longitude',
      'maplight',
      'middle_name',
      'name',
      'name_slug',
      'name_suffix',
      'openly_lgbtq',
      'opensecrets',
      'party',
      'phone',
      'photo_url',
      'photo_url_sizes',
      'pronunciation',
      'religion',
      'state_code',
      'state_code_slug',
      'state_name',
      'state_name_slug',
      'term_end',
      'thomas',
      'title',
      'twitter_handle',
      'twitter_url',
      'votesmart',
      'website',
      'wikidata'
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
      biography: data.biography,
      bioguide: data.bioguide,
      civil_services_url: data.civil_services_url,
      class: data.class,
      contact_page: data.contact_page,
      date_of_birth: data.date_of_birth,
      entered_office: data.entered_office,
      ethnicity: data.ethnicity,
      facebook_url: data.facebook_url,
      fax: data.fax,
      fec: data.fec,
      first_name: data.first_name,
      gender: data.gender,
      goes_by: data.goes_by,
      google_entity_id: data.google_entity_id,
      last_name: data.last_name,
      latitude: parseFloat(data.latitude),
      location: {
        lat: parseFloat(data.latitude),
        lon: parseFloat(data.longitude)
      },
      longitude: parseFloat(data.longitude),
      maplight: data.maplight,
      middle_name: data.middle_name,
      name: data.name,
      name_slug: data.name_slug,
      name_suffix: data.name_suffix,
      openly_lgbtq: data.openly_lgbtq,
      opensecrets: data.opensecrets,
      party: data.party,
      phone: data.phone,
      photo_url: data.photo_url,
      photo_url_sizes: data.photo_url_sizes,
      pronunciation: data.pronunciation,
      religion: data.religion,
      shape: data.shape,
      state_code: data.state_code,
      state_code_slug: data.state_code_slug,
      state_name: data.state_name,
      state_name_slug: data.state_name_slug,
      term_end: data.term_end,
      thomas: data.thomas,
      title: data.title,
      twitter_handle: data.twitter_handle,
      twitter_url: data.twitter_url,
      votesmart: data.votesmart,
      website: data.website,
      wikidata: data.wikidata,
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
        size_64x64: (data[i].photo_url) ? data[i].photo_url.replace('512x512', '64x64') : null,
        size_128x128: (data[i].photo_url) ? data[i].photo_url.replace('512x512', '128x128') : null,
        size_256x256: (data[i].photo_url) ? data[i].photo_url.replace('512x512', '256x256') : null,
        size_512x512: (data[i].photo_url) ? data[i].photo_url : null,
        size_1024x1024: (data[i].photo_url) ? data[i].photo_url.replace('512x512', '1024x1024') : null
      };

      data[i].bioguide_url = (!data[i].bioguide) ? null : 'http://bioguide.congress.gov/scripts/biodisplay.pl?index=' + data[i].bioguide;
      data[i].opensecrets_url = (!data[i].opensecrets) ? null : 'https://www.opensecrets.org/politicians/summary.php?cid=' + data[i].opensecrets;
      data[i].opensecrets_url_tabs = {
        summary: (!data[i].opensecrets) ? null : 'https://www.opensecrets.org/politicians/summary.php?cid=' + data[i].opensecrets,
        elections: (!data[i].opensecrets) ? null : 'https://www.opensecrets.org/politicians/elections.php?cid=' + data[i].opensecrets,
        industries: (!data[i].opensecrets) ? null : 'https://www.opensecrets.org/politicians/industries.php?cid=' + data[i].opensecrets,
        pacs: (!data[i].opensecrets) ? null : 'https://www.opensecrets.org/politicians/pacs.php?cid=' + data[i].opensecrets,
        donors: (!data[i].opensecrets) ? null : 'https://www.opensecrets.org/politicians/contrib.php?cid=' + data[i].opensecrets,
        geography: (!data[i].opensecrets) ? null : 'https://www.opensecrets.org/politicians/geog.php?cid=' + data[i].opensecrets,
        expenditures: (!data[i].opensecrets) ? null : 'https://www.opensecrets.org/politicians/expend.php?cid=' + data[i].opensecrets,
        legislation: (!data[i].opensecrets) ? null : 'https://www.opensecrets.org/politicians/bills.php?cid=' + data[i].opensecrets,
        news: (!data[i].opensecrets) ? null : 'https://www.opensecrets.org/politicians/inthenews.php?cid=' + data[i].opensecrets,
        other: (!data[i].opensecrets) ? null : 'https://www.opensecrets.org/politicians/otherdata.php?cid=' + data[i].opensecrets
      };

      data[i].votesmart_url = (!data[i].votesmart) ? null : 'http://votesmart.org/candidate/' + data[i].votesmart;
      data[i].votesmart_url_tabs = {
        summary: (!data[i].votesmart) ? null : 'http://votesmart.org/candidate/' + data[i].votesmart,
        bio: (!data[i].votesmart) ? null : 'http://votesmart.org/candidate/biography/' + data[i].votesmart,
        votes: (!data[i].votesmart) ? null : 'http://votesmart.org/candidate/key-votes/' + data[i].votesmart,
        positions: (!data[i].votesmart) ? null : 'http://votesmart.org/candidate/political-courage-test/' + data[i].votesmart,
        ratings: (!data[i].votesmart) ? null : 'http://votesmart.org/candidate/evaluations/' + data[i].votesmart,
        speeches: (!data[i].votesmart) ? null : 'http://votesmart.org/candidate/public-statements/' + data[i].votesmart,
        funding: (!data[i].votesmart) ? null : 'http://votesmart.org/candidate/campaign-finance/' + data[i].votesmart
      };

      data[i].fec_url = (!data[i].fec) ? null : 'http://www.fec.gov/fecviewer/CandidateCommitteeDetail.do?candidateCommitteeId=' + data[i].fec;
      data[i].maplight_url = (!data[i].maplight) ? null : 'http://maplight.org/us-congress/legislator/' + data[i].maplight;
      data[i].wikidata_url = (!data[i].wikidata) ? null : 'https://www.wikidata.org/wiki/' + data[i].wikidata;

      data[i].civil_services_url = 'https://civil.services/us-senate/' + data[i].state_name_slug + '/senator/' + data[i].name_slug;

      data[i].date_of_birth = (data[i].date_of_birth) ? data[i].date_of_birth.substring(0, 10) : null;
      data[i].entered_office = (data[i].entered_office) ? data[i].entered_office.substring(0, 10) : null;
      data[i].term_end = (data[i].term_end) ? data[i].term_end.substring(0, 10) : null;

      var sorted = util.sortByKeys(data[i]);

      extended.push(sorted);
    }

    return extended;
  },

  /**
   * Search Senate
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
          fields: [
            'state_code_slug',
            'state_name_slug',
            'state_code',
            'state_name'
          ]
        }
      });
    }

    /**
     * Filter By Class
     */
    if (query.class) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          class: query.class
        }
      });
    }

    /**
     * Filter By Bioguide
     */
    if (query.bioguide) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          bioguide: query.bioguide
        }
      });
    }

    /**
     * Filter By Thomas
     */
    if (query.thomas) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          thomas: query.thomas
        }
      });
    }

    /**
     * Filter By OpenSecrets
     */
    if (query.opensecrets) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          opensecrets: query.opensecrets
        }
      });
    }

    /**
     * Filter By VoteSmart
     */
    if (query.votesmart) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          votesmart: query.votesmart
        }
      });
    }

    /**
     * Filter By FEC
     */
    if (query.fec) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          fec: query.fec
        }
      });
    }

    /**
     * Filter By MapLight
     */
    if (query.maplight) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          maplight: query.maplight
        }
      });
    }

    /**
     * Filter By WikiData
     */
    if (query.wikidata) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          wikidata: query.wikidata
        }
      });
    }

    /**
     * Filter By Google Entity ID
     */
    if (query.googleEntityId) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          google_entity_id: query.googleEntityId
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
          fields: [
            'name',
            'name_slug',
            'first_name',
            'last_name'
          ]
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
     * Filter By Religion
     */
    if (query.religion) {
      andFilters = getAndFilters();
      andFilters.push({
        terms: {
          religion: query.religion.split(','),
          minimum_should_match: 1
        }
      });
    }

    /**
     * Filter By Openley LGBTQ
     */
    if (query.openlyLGBTQ) {
      andFilters = getAndFilters();
      andFilters.push({
        terms: {
          openlyLGBTQ: query.openlyLGBTQ.split(','),
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
                    type: 'circle',
                    radius: '1km'
                  }
                }
              }
            });

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
