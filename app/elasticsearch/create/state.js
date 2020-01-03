/**
 * @module elasticsearch/create/state
 * @version 1.0.2
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Promise = require('bluebird');
var config = require('../../config');
var client = require('../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_state';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * State Mapping
 * @type {{index: string, type: string, body: {}}}
 */
var mappings = {};

/**
 * State Mapping Body
 * @type {{properties: {id: {type: string}, state_name: {type: string}, state_name_slug: {type: string, index: string}, state_code: {type: string}, state_code_slug: {type: string, index: string}, nickname: {type: string}, website: {type: string, index: string}, admission_date: {type: string}, admission_number: {type: string}, capital_city: {type: string}, capital_url: {type: string, index: string}, population: {type: string}, population_rank: {type: string}, constitution_url: {type: string, index: string}, state_flag_url: {type: string, index: string}, state_seal_url: {type: string, index: string}, map_image_url: {type: string, index: string}, landscape_background_url: {type: string, index: string}, skyline_background_url: {type: string, index: string}, twitter_handle: {type: string, index: string}, twitter_url: {type: string, index: string}, facebook_url: {type: string, index: string}, shape: {type: (*), allowNull: boolean}}}}
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
    nickname: {
      type: 'keyword',
      index: true
    },
    website: {
      type: 'text'
    },
    admission_date: {
      type: 'date'
    },
    admission_number: {
      type: 'integer'
    },
    capital_city: {
      type: 'keyword',
      index: true
    },
    capital_url: {
      type: 'text'
    },
    population: {
      type: 'integer'
    },
    population_rank: {
      type: 'integer'
    },
    constitution_url: {
      type: 'keyword',
      index: true
    },
    state_flag_url: {
      type: 'keyword',
      index: true
    },
    state_seal_url: {
      type: 'keyword',
      index: true
    },
    map_image_url: {
      type: 'keyword',
      index: true
    },
    landscape_background_url: {
      type: 'text'
    },
    skyline_background_url: {
      type: 'text'
    },
    twitter_handle: {
      type: 'text'
    },
    twitter_url: {
      type: 'text'
    },
    facebook_url: {
      type: 'text'
    },
    shape: {
      type: 'geo_shape'
    }
  }
};

/**
 * Create State Index
 * @type {object}
 */
var State = client.indices.exists({
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

module.exports = State;
