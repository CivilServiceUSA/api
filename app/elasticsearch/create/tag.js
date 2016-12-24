/**
 * @module elasticsearch/create/tag
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Promise = require('bluebird');
var config = require('../../config');
var client = require('../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_tag';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * Tag Mapping
 * @type {{index: string, type: string, body: {}}}
 */
var mapping = {
  index: indexName,
  type: indexType,
  body: {}
};

/**
 * Tag Mapping Body
 * @type {{properties: {id: {type: string}, parent_id: {type: string}, name: {type: string}, slug: {type: string}}}}
 */
mapping.body[indexType] = {
  properties: {
    name: {
      type: 'string'
    },
    slug: {
      type: 'string'
    }
  }
};

/**
 * Create Tag Index
 * @type {object}
 */
var Tag = client.indices.exists({
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

module.exports = Tag;
