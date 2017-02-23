/**
 * @module elasticsearch/update/senate
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var debug = require('../../debug');
var config = require('../../config');
var elasticsearchClient = require('../client');
var SenateModel = require('../../models/civil_services/senate');
var SenateDomain = require('../../api/v1/domain/senate');

var env = config.get('env');
var indexType = env + '_senate';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * Update Senate Index
 * @type {{update: SenateES.update}}
 */
var SenateES = {
  update: function(){
    elasticsearchClient.search({
      index: indexName,
      size: 0,
      body: {}
    })
    .then(function() {
      var params = {};

      return SenateModel.findAll(params);
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

          bulkActions.push(SenateDomain.prepareForElasticSearch(evt));
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

module.exports = SenateES;
