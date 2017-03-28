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
var mapping = {
  index: indexName,
  type: indexType,
  body: {}
};

/**
 * State Mapping Body
 * @type {{properties: {id: {type: string}, state_name: {type: string}, state_name_slug: {type: string, index: string}, state_code: {type: string}, state_code_slug: {type: string, index: string}, nickname: {type: string}, website: {type: string, index: string}, admission_date: {type: string}, admission_number: {type: string}, capital_city: {type: string}, capital_url: {type: string, index: string}, population: {type: string}, population_rank: {type: string}, constitution_url: {type: string, index: string}, state_flag_url: {type: string, index: string}, state_seal_url: {type: string, index: string}, map_image_url: {type: string, index: string}, landscape_background_url: {type: string, index: string}, skyline_background_url: {type: string, index: string}, twitter_handle: {type: string, index: string}, twitter_url: {type: string, index: string}, facebook_url: {type: string, index: string}, shape: {type: (*), allowNull: boolean}}}}
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
    nickname: {
      type: 'string',
      index: 'not_analyzed'
    },
    website: {
      type: 'string',
      index: 'no'
    },
    admission_date: {
      type: 'date'
    },
    admission_number: {
      type: 'integer',
      index: 'not_analyzed'
    },
    capital_city: {
      type: 'string',
      index: 'not_analyzed'
    },
    capital_url: {
      type: 'string',
      index: 'no'
    },
    population: {
      type: 'integer',
      index: 'not_analyzed'
    },
    population_rank: {
      type: 'integer',
      index: 'not_analyzed'
    },
    constitution_url: {
      type: 'string',
      index: 'no'
    },
    state_flag_url: {
      type: 'string',
      index: 'no'
    },
    state_seal_url: {
      type: 'string',
      index: 'no'
    },
    map_image_url: {
      type: 'string',
      index: 'no'
    },
    landscape_background_url: {
      type: 'string',
      index: 'no'
    },
    skyline_background_url: {
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
    facebook_url: {
      type: 'string',
      index: 'no'
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

module.exports = State;
