/**
 * @module elasticsearch/client
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var config = require('../config');
var elasticsearch = require('elasticsearch');

/**
 * Client
 * @type {object}
 */
module.exports = new elasticsearch.Client({
  host: config.get('elasticsearch.host'),
  apiVersion: config.get('elasticsearch.apiVersion'),
  requestTimeout: config.get('elasticsearch.requestTimeout'),
  log: config.get('elasticsearch.log')
});
