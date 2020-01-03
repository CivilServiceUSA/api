/**
 * @module elasticsearch/create/geolocation
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Promise = require('bluebird');
var config = require('../../config');
var client = require('../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_geolocation';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * Geolocation Mapping
 * @type {{index: string, type: string, body: {}}}
 */
var mappings = {};

/**
 * Geolocation Mapping Body
 * @type {{properties: {zipcode: {type: string}, type: {type: string}, decommissioned: {type: string, index: string}, primary_city: {type: string, index_analyzer: string, search_analyzer: string}, acceptable_cities: {type: string, index: string}, unacceptable_cities: {type: string, index: string}, county: {type: string, index_analyzer: string, search_analyzer: string}, timezone: {type: string, index_analyzer: string, search_analyzer: string}, area_codes: {type: string}, world_region: {type: string, index: string}, country: {type: string}, latitude: {type: string}, longitude: {type: string}, estimated_population: {type: string, index: string}, created_date: {type: string, format: string}, modified_date: {type: string, format: string}, deleted_at: {type: string, format: string}}}}
 */
mappings[indexName] = {
  properties: {
    id: {
      type: 'integer'
    },
    zipcode: {
      type: 'text'
    },
    primary_city: {
      type: 'text'
    },
    acceptable_cities: {
      type: 'keyword',
      index: true
    },
    unacceptable_cities: {
      type: 'keyword',
      index: true
    },
    state: {
      type: 'text'
    },
    county: {
      type: 'text'
    },
    timezone: {
      type: 'text'
    },
    area_codes: {
      type: 'text'
    },
    latitude: {
      type: 'float'
    },
    longitude: {
      type: 'float'
    },
    estimated_population: {
      type: 'integer'
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
    }
  }
};

/**
 * Create Geolocation Index
 * @type {object}
 */
var Geolocation = client.indices.exists({
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

module.exports = Geolocation;