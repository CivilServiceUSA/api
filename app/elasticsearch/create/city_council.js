/**
 * @module elasticsearch/create/city_council
 * @version 1.0.2
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Promise = require('bluebird');
var config = require('../../config');
var client = require('../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_city_council';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * City Council Mapping
 * @type {{index: string, type: string, body: {}}}
 */
var mappings = {};

/**
 *
 * @type {{properties: {id: {type: string}, state_name: {type: string}, state_name_slug: {type: string, index: string}, state_code: {type: string}, state_code_slug: {type: string, index: string}, district: {type: string}, at_large: {type: string}, vacant: {type: string}, title: {type: string, index: string}, party: {type: string, index: string}, name: {type: string}, name_slug: {type: string, index: string}, first_name: {type: string}, middle_name: {type: string, index: string}, last_name: {type: string}, name_suffix: {type: string, index: string}, goes_by: {type: string, index: string}, pronunciation: {type: string, index: string}, gender: {type: string, index: string}, ethnicity: {type: string, index: string}, age: {type: string}, date_of_birth: {type: string}, entered_office: {type: string}, term_end: {type: string}, email: {type: string, index: string}, phone: {type: string, index: string}, latitude: {type: string, index: string}, longitude: {type: string, index: string}, address_complete: {type: string, index: string}, address_number: {type: string, index: string}, address_prefix: {type: string, index: string}, address_street: {type: string, index: string}, address_sec_unit_type: {type: string, index: string}, address_sec_unit_num: {type: string, index: string}, address_city: {type: string, index: string}, address_state: {type: string, index: string}, address_zipcode: {type: string, index: string}, address_type: {type: string, index: string}, population: {type: string}, background_url: {type: string, index: string}, city_government_url: {type: string, index: string}, city_council_url: {type: string, index: string}, city_council_calendar_url: {type: string, index: string}, city_council_legislation_url: {type: string, index: string}, city_council_committees_url: {type: string, index: string}, twitter_handle: {type: string, index: string}, twitter_url: {type: string, index: string}, facebook_url: {type: string, index: string}, photo_url: {type: string, index: string}, created_date: {type: string}, modified_date: {type: string}, deleted_at: {type: string}, location: {type: string}, shape: {type: string}, aliases: {type: string}}}}
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
      type: 'text',
      index: true
    },
    district: {
      type: 'text'
    },
    at_large: {
      type: 'boolean'
    },
    vacant: {
      type: 'boolean'
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
    email: {
      type: 'keyword',
      index: true
    },
    phone: {
      type: 'keyword',
      index: true
    },
    latitude: {
      type: 'float',
      index: false
    },
    longitude: {
      type: 'float',
      index: false
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
    population: {
      type: 'integer'
    },
    background_url: {
      type: 'keyword',
      index: true
    },
    city_government_url: {
      type: 'keyword',
      index: true
    },
    city_council_url: {
      type: 'keyword',
      index: true
    },
    city_council_calendar_url: {
      type: 'keyword',
      index: true
    },
    city_council_legislation_url: {
      type: 'keyword',
      index: true
    },
    city_council_committees_url: {
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
    facebook_url: {
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
 * Create City Council Index
 * @type {object}
 */
var CityCouncil = client.indices.exists({
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

module.exports = CityCouncil;