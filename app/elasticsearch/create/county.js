/**
 * @module elasticsearch/create/county
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Promise = require('bluebird');
var config = require('../../config');
var client = require('../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_county';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * County Mapping
 * @type {{index: string, type: string, body: {}}}
 */
var mapping = {
  index: indexName,
  type: indexType,
  body: {}
};

/**
 * County Mapping Body
 * @type {{properties: {id: {type: string}, fips: {type: string}, state_name: {type: string}, state_code: {type: string}, name: {type: string}, shape: {type: string, tree_levels: number}}}}
 */
mapping.body[indexType] = {
  properties: {
    id: {
      type: 'integer'
    },
    fips: {
      type: 'string'
    },
    state_name: {
      type: 'string'
    },
    state_code: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    shape: {
      type: 'geo_shape',
      tree_levels: 26,
      tree: 'quadtree'
    }
  }
};

/**
 * Create County Index
 * @type {object}
 */
var County = client.indices.exists({
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

module.exports = County;
