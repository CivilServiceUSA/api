/**
 * @module elasticsearch/create/governor
 * @version 1.1.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Promise = require('bluebird');
var config = require('../../config');
var client = require('../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_governor';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * Governor Mapping
 * @type {{index: string, type: string, body: {}}}
 */
var mapping = {
  index: indexName,
  type: indexType,
  body: {}
};

/**
 * Governor Mapping Body
 * @type {{properties: {id: {type: string}, state_name: {type: string}, state_name_slug: {type: string, index: string}, state_code: {type: string}, state_code_slug: {type: string, index: string}, votesmart: {type: string}, title: {type: string, index: string}, party: {type: string, index: string}, name: {type: string}, name_slug: {type: string, index: string}, first_name: {type: string}, middle_name: {type: string, index: string}, last_name: {type: string}, name_suffix: {type: string, index: string}, goes_by: {type: string, index: string}, pronunciation: {type: string, index: string}, gender: {type: string, index: string}, ethnicity: {type: string, index: string}, religion: {type: string, index: string}, openly_lgbtq: {type: string, index: string}, age: {type: string}, date_of_birth: {type: string}, entered_office: {type: string}, term_end: {type: string}, biography: {type: string, index: string}, phone: {type: string, index: string}, fax: {type: string, index: string}, latitude: {type: string, index: string}, longitude: {type: string, index: string}, address_complete: {type: string, index: string}, address_number: {type: string, index: string}, address_prefix: {type: string, index: string}, address_street: {type: string, index: string}, address_sec_unit_type: {type: string, index: string}, address_sec_unit_num: {type: string, index: string}, address_city: {type: string, index: string}, address_state: {type: string, index: string}, address_zipcode: {type: string, index: string}, address_type: {type: string, index: string}, website: {type: string, index: string}, contact_page: {type: string, index: string}, facebook_url: {type: string, index: string}, twitter_handle: {type: string, index: string}, twitter_url: {type: string, index: string}, photo_url: {type: string, index: string}, created_date: {type: string}, modified_date: {type: string}, deleted_at: {type: string}, location: {type: string}, shape: {type: string}, aliases: {type: string}}}}
 */
mapping.body[indexType] = {
  properties: {
    id: {
      type: 'integer'
    },
    state_name: {
      type: 'string'
    },
    state_name_slug: {
      type: 'string',
      index: 'no'
    },
    state_code: {
      type: 'string'
    },
    state_code_slug: {
      type: 'string',
      index: 'no'
    },
    votesmart: {
      type: 'string'
    },
    title: {
      type: 'string',
      index: 'not_analyzed'
    },
    party: {
      type: 'string',
      index: 'not_analyzed'
    },
    name: {
      type: 'string'
    },
    name_slug: {
      type: 'string',
      index: 'no'
    },
    first_name: {
      type: 'string'
    },
    middle_name: {
      type: 'string',
      index: 'no'
    },
    last_name: {
      type: 'string'
    },
    name_suffix: {
      type: 'string',
      index: 'no'
    },
    goes_by: {
      type: 'string',
      index: 'no'
    },
    pronunciation: {
      type: 'string',
      index: 'no'
    },
    gender: {
      type: 'string',
      index: 'not_analyzed'
    },
    ethnicity: {
      type: 'string',
      index: 'not_analyzed'
    },
    religion: {
      type: 'string',
      index: 'not_analyzed'
    },
    openly_lgbtq: {
      type: 'string',
      index: 'not_analyzed'
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
      type: 'string',
      index: 'no'
    },
    phone: {
      type: 'string',
      index: 'no'
    },
    fax: {
      type: 'string',
      index: 'no'
    },
    latitude: {
      type: 'float',
      index: 'no'
    },
    longitude: {
      type: 'float',
      index: 'no'
    },
    address_complete: {
      type: 'string',
      index: 'no'
    },
    address_number: {
      type: 'string',
      index: 'no'
    },
    address_prefix: {
      type: 'string',
      index: 'no'
    },
    address_street: {
      type: 'string',
      index: 'no'
    },
    address_sec_unit_type: {
      type: 'string',
      index: 'no'
    },
    address_sec_unit_num: {
      type: 'string',
      index: 'no'
    },
    address_city: {
      type: 'string',
      index: 'no'
    },
    address_state: {
      type: 'string',
      index: 'no'
    },
    address_zipcode: {
      type: 'string',
      index: 'no'
    },
    address_type: {
      type: 'string',
      index: 'no'
    },
    website: {
      type: 'string',
      index: 'no'
    },
    contact_page: {
      type: 'string',
      index: 'no'
    },
    facebook_url: {
      type: 'string',
      index: 'no'
    },
    twitter_handle: {
      type: 'string',
      index: 'no'
    },
    twitter_url: {
      type: 'string',
      index: 'no'
    },
    photo_url: {
      type: 'string',
      index: 'no'
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
      type: 'geo_point',
      lat_lon: true
    },
    shape: {
      type: 'geo_shape',
      tree_levels: 26,
      tree: 'quadtree'
    },
    aliases: {
      type: 'string'
    }
  }
};

/**
 * Create Governor Index
 * @type {object}
 */
var Governor = client.indices.exists({
  index: indexName
}).then(function(exists) {
  if ( !exists) {
    return client.indices.create({
      index: indexName,
      ignore: [404]
    });
  } else {
    return Promise.resolve();
  }
})
.then(function() {
  client.indices.putMapping(mapping)
    .then(function() {
      debug.success('Index Created: ' + indexName);
    })
    .catch(function(error) {
      debug.error('Error applying ' + indexType + ' mapping');
      debug.error(error.status + ' ' + error.message);
    });
})
.catch(function(error) {
  debug.error('There was an error creating the ' + indexType + ' index');
  debug.error(error.status + ' ' + error.message);
});

module.exports = Governor;
