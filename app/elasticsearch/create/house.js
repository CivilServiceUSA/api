/**
 * @module elasticsearch/create/house
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Promise = require('bluebird');
var config = require('../../config');
var client = require('../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_house';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * House Mapping
 * @type {{index: string, type: string, body: {}}}
 */
var mappings = {};

/**
 * House Mapping Body
 * @type {{properties: {id: {type: string}, state_name: {type: string}, state_name_slug: {type: string, index: string}, state_code: {type: string}, state_code_slug: {type: string, index: string}, district: {type: string}, at_large: {type: string}, vacant: {type: string}, bioguide: {type: string}, thomas: {type: string}, opensecrets: {type: string}, votesmart: {type: string}, fec: {type: string}, maplight: {type: string}, wikidata: {type: string}, google_entity_id: {type: string}, title: {type: string}, party: {type: string}, name: {type: string}, name_slug: {type: string, index: string}, first_name: {type: string}, middle_name: {type: string, index: string}, last_name: {type: string}, name_suffix: {type: string, index: string}, goes_by: {type: string, index: string}, pronunciation: {type: string, index: string}, gender: {type: string}, ethnicity: {type: string}, religion: {type: string}, openly_lgbtq: {type: string}, age: {type: string}, date_of_birth: {type: string}, entered_office: {type: string}, term_end: {type: string}, biography: {type: string, index: string}, phone: {type: string, index: string}, fax: {type: string, index: string}, latitude: {type: string, index: string}, longitude: {type: string, index: string}, address_complete: {type: string, index: string}, address_number: {type: string, index: string}, address_prefix: {type: string, index: string}, address_street: {type: string, index: string}, address_sec_unit_type: {type: string, index: string}, address_sec_unit_num: {type: string, index: string}, address_city: {type: string, index: string}, address_state: {type: string, index: string}, address_zipcode: {type: string, index: string}, address_type: {type: string, index: string}, website: {type: string, index: string}, contact_page: {type: string, index: string}, facebook_url: {type: string, index: string}, twitter_handle: {type: string, index: string}, twitter_url: {type: string, index: string}, photo_url: {type: string, index: string}, created_date: {type: string}, modified_date: {type: string}, deleted_at: {type: string}, location: {type: string}}}}
 */
mappings[indexName] = {
  properties: {
    id: {
      type: 'integer'
    },
    state_name: {
      type: 'text'
    },
    state_name_slug: {
      type: 'keyword',
      index: true
    },
    state_code: {
      type: 'text'
    },
    state_code_slug: {
      type: 'keyword',
      index: true
    },
    district: {
      type: 'integer'
    },
    at_large: {
      type: 'boolean'
    },
    vacant: {
      type: 'boolean'
    },
    bioguide: {
      type: 'text'
    },
    thomas: {
      type: 'text'
    },
    opensecrets: {
      type: 'text'
    },
    votesmart: {
      type: 'text'
    },
    fec: {
      type: 'text'
    },
    maplight: {
      type: 'text'
    },
    wikidata: {
      type: 'text'
    },
    google_entity_id: {
      type: 'text'
    },
    title: {
      type: 'keyword',
      index: true
    },
    party: {
      type: 'keyword',
      index: true
    },
    name: {
      type: 'text'
    },
    name_slug: {
      type: 'keyword',
      index: true
    },
    first_name: {
      type: 'text'
    },
    middle_name: {
      type: 'keyword',
      index: true
    },
    last_name: {
      type: 'text'
    },
    name_suffix: {
      type: 'keyword',
      index: true
    },
    goes_by: {
      type: 'keyword',
      index: true
    },
    pronunciation: {
      type: 'keyword',
      index: true
    },
    gender: {
      type: 'keyword',
      index: true
    },
    ethnicity: {
      type: 'keyword',
      index: true
    },
    religion: {
      type: 'keyword',
      index: true
    },
    openly_lgbtq: {
      type: 'keyword',
      index: true
    },
    age: {
      type: 'integer'
    },
    date_of_birth: {
      type: 'date'
    },
    entered_office: {
      type: 'date'
    },
    term_end: {
      type: 'date'
    },
    biography: {
      type: 'keyword',
      index: true
    },
    phone: {
      type: 'keyword',
      index: true
    },
    fax: {
      type: 'keyword',
      index: true
    },
    latitude: {
      type: 'float'
    },
    longitude: {
      type: 'float'
    },
    address_complete: {
      type: 'keyword',
      index: true
    },
    address_number: {
      type: 'keyword',
      index: true
    },
    address_prefix: {
      type: 'keyword',
      index: true
    },
    address_street: {
      type: 'keyword',
      index: true
    },
    address_sec_unit_type: {
      type: 'keyword',
      index: true
    },
    address_sec_unit_num: {
      type: 'keyword',
      index: true
    },
    address_city: {
      type: 'keyword',
      index: true
    },
    address_state: {
      type: 'keyword',
      index: true
    },
    address_zipcode: {
      type: 'keyword',
      index: true
    },
    address_type: {
      type: 'keyword',
      index: true
    },
    website: {
      type: 'keyword',
      index: true
    },
    contact_page: {
      type: 'keyword',
      index: true
    },
    facebook_url: {
      type: 'keyword',
      index: true
    },
    twitter_handle: {
      type: 'keyword',
      index: true
    },
    twitter_url: {
      type: 'keyword',
      index: true
    },
    photo_url: {
      type: 'keyword',
      index: true
    },
    created_date: {
      type: 'date'
    },
    modified_date: {
      type: 'date'
    },
    deleted_at: {
      type: 'date'
    },
    location: {
      type: 'geo_point'
    },
    shape: {
      type: 'geo_shape'
    },
    aliases: {
      type: 'text'
    }
  }
};

/**
 * Create House Index
 * @type {object}
 */
var House = client.indices.exists({
  index: indexName
}).then(function(exists) {
  if ( !exists) {
    return client.indices.createIndex({
      index: indexName,
      body: {
        mappings
      }
    }, {
      ignore: [404]
    });
  } else {
    return Promise.resolve();
  }
})
// .then(function() {
//   client.indices.putMapping(mapping)
//     .then(function() {
//       debug.success('Index Created: ' + indexName);
//     })
//     .catch(function(error) {
//       debug.error('Error applying ' + indexType + ' mapping');
//       debug.error(error.status + ' ' + error.message);
//     });
// })
.catch(function(error) {
  debug.error('There was an error creating the ' + indexType + ' index');
  debug.error(error.status + ' ' + error.message);
});

module.exports = House;