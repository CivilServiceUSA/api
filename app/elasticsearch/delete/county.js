/**
 * @module elasticsearch/delete/county
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var config = require('../../config');
var client = require('./../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_county';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * Delete County Index
 * @type {object}
 */
var County = client.indices.delete({
  index: indexName
})
.then(function() {
  debug.success('Index Deleted: ' + indexName);
})
.catch(function(error) {
  debug.error(error.status + ' ' + error.message);
});

module.exports = County;
