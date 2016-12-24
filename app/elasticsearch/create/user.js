/**
 * @module elasticsearch/create/user
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Promise = require('bluebird');
var config = require('../../config');
var client = require('../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_user';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * User Mapping
 * @type {{index: string, type: string, body: {}}}
 */
var mapping = {
  index: indexName,
  type: indexType,
  body: {}
};

/**
 * User Mapping Body
 * @type {{properties: {activated: {type: string}, username: {type: string}, first_name: {type: string}, last_name: {type: string}, company_name: {type: string}, profile_name: {type: string}, location: {type: string}, profile_link_website: {type: string}, profile_link_twitter: {type: string}, profile_link_1: {type: string}, profile_link_2: {type: string}, profile_link_3: {type: string}, banned: {type: string}}}}
 */
mapping.body[indexType] = {
  properties: {
    activated: {
      type: 'boolean'
    },
    username: {
      type: 'string'
    },
    first_name: {
      type: 'string'
    },
    last_name: {
      type: 'string'
    },
    company_name: {
      type: 'string'
    },
    profile_name: {
      type: 'string'
    },
    location: {
      type: 'string'
    },
    profile_link_website: {
      type: 'string'
    },
    profile_link_twitter: {
      type: 'string'
    },
    profile_link_1: {
      type: 'string'
    },
    profile_link_2: {
      type: 'string'
    },
    profile_link_3: {
      type: 'string'
    },
    banned: {
      type: 'boolean'
    }
  }
};

/**
 * Create User Index
 * @type {object}
 */
var User = client.indices.exists({
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

module.exports = User;
