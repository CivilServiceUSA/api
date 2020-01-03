/**
 * @module elasticsearch/create/category
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Promise = require('bluebird');
var config = require('../../config');
var client = require('../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_category';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * Category Mapping
 * @type {{index: string, type: string, body: {}}}
 */
var mappings = {};

/**
 * Category Mapping Body
 * @type {{properties: {id: {type: string}, parent_id: {type: string}, name: {type: string}, slug: {type: string}}}}
 */
mappings[indexName] = {
  properties: {
    id: {
      type: 'integer'
    },
    parent_id: {
      type: 'integer'
    },
    name: {
      type: 'text'
    },
    slug: {
      type: 'text'
    }
  }
};

/**
 * Create Category Index
 * @type {object}
 */
var Category = client.indices.exists({
  index: indexName
}).then(function(exists) {
  if ( !exists) {
    return client.indices.createIndex({
      index: indexName,
      body: {
        mappings
      }
    },{
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

module.exports = Category;