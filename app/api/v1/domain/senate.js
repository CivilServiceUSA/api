/**
 * @module domain/senate
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var validator = require('validator');
var moment = require('moment');
var util = require('./util');
var config = require('../../../config');
var elasticsearchClient = require('../../../elasticsearch/client');

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
      'age',
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
      'biography',
      'bioguide',
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
      'govtrack',
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
      'photos',
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
      age: age,
      state_name: data.state_name,
      state_name_slug: data.state_name_slug,
      state_code: data.state_code,
      state_code_slug: data.state_code_slug,
      class: data.class,
      bioguide: data.bioguide,
      thomas: data.thomas,
      govtrack: data.govtrack,
      opensecrets: data.opensecrets,
      votesmart: data.votesmart,
      fec: data.fec,
      maplight: data.maplight,
      wikidata: data.wikidata,
      google_entity_id: data.google_entity_id,
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
      religion: data.religion,
      openly_lgbtq: data.openly_lgbtq,
      date_of_birth: data.date_of_birth,
      entered_office: data.entered_office,
      term_end: data.term_end,
      biography: data.biography,
      phone: data.phone,
      fax: data.fax,
      latitude: data.latitude,
      longitude: data.longitude,
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
      website: data.website,
      contact_page: data.contact_page,
      facebook_url: data.facebook_url,
      twitter_handle: data.twitter_handle,
      twitter_url: data.twitter_url,
      photo_url: data.photo_url,
      location: {
        lat: data.latitude,
        lon: data.longitude
      }
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
        '64x64': data[i].photo_url.replace('512x512', '64x64'),
        '128x128': data[i].photo_url.replace('512x512', '128x128'),
        '256x256': data[i].photo_url.replace('512x512', '256x256'),
        '512x512': data[i].photo_url,
        '1024x1024': data[i].photo_url.replace('512x512', '1024x1024')
      };

      data[i].bioguide_url = (!data[i].bioguide) ? null : 'http://bioguide.congress.gov/scripts/biodisplay.pl?index=' + data[i].bioguide;
      data[i].govtrack_url = (!data[i].govtrack) ? null : 'https://www.govtrack.us/congress/members/' + data[i].govtrack;

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
     * Filter By GovTrack
     */
    if (query.govtrack) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          govtrack: query.govtrack
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
        match: {
          title: query.title
        }
      });
    }

    /**
     * Filter By Party
     */
    if (query.party) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          party: query.party
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
        match: {
          gender: query.gender
        }
      });
    }

    /**
     * Filter By Ethnicity
     */
    if (query.ethnicity) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          ethnicity: query.ethnicity
        }
      });
    }

    /**
     * Filter By Religion
     */
    if (query.religion) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          religion: query.religion
        }
      });
    }

    /**
     * Filter By Openley LGBTQ
     */
    if (query.openlyLGBTQ) {
      andFilters = getAndFilters();
      andFilters.push({
        match: {
          openly_lgbtq: query.openlyLGBTQ
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
};
