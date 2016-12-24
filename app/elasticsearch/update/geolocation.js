/**
 * @module elasticsearch/update/geolocation
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var debug = require('../../debug');
var config = require('../../config');
var logger = require('../../logger');
var elasticsearchClient = require('../client');
var ZipCodeModel = require('../../models/civil_services/zipcode');
var GeolocationDomain = require('../../api/v1/domain/geolocation');

var env = config.get('env');
var indexType = env + '_geolocation';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * Update Geolocation Index
 * @type {{update: GeolocationES.update}}
 */
var GeolocationES = {
  update: function(){
    elasticsearchClient.search({
      index: indexName,
      size: 0,
      body: {}
    })
    .then(function() {
      var params = {};

      return ZipCodeModel.findAll(params);
    })
    .then(function(geo) {

      if (geo.length) {
        var bulkActions = [];

        _.each(geo, function(evt) {
          bulkActions.push({
            index: {
              _index: indexName,
              _type: indexType,
              _id: evt.id
            }
          });

          bulkActions.push(GeolocationDomain.prepareForElasticSearch(evt));
        });

        elasticsearchClient
          .bulk({
            body: bulkActions
          })
          .then(function(result) {

            if(result.errors){
              for(var i = 0; i < result.items.length; i++){
                if(result.items[i].create && result.items[i].create.error){
                  debug.error('Error indexing ' + indexName + ' ' + result.items[i]._id);
                  debug.error(result.items[i].create.error);
                }
              }
            }

            debug.success(indexName + ' indexed ' + result.items.length + ' items');
            logger.log(indexName + ' indexed ' + result.items.length + ' items');
          })
          .catch(function(error) {
            debug.error('Error indexing ' + indexType);
            debug.error(error.status + ' ' + error.message);
          });

      } else {
        debug.warn('No new ' + indexName + ' found');
      }
    })
    .catch(function(error) {
      debug.error(error);
    });
  }
};

module.exports = GeolocationES;
