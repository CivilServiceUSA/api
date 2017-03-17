/**
 * @module elasticsearch/update/county
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var debug = require('../../debug');
var config = require('../../config');
var elasticsearchClient = require('../client');
var CountyModel = require('../../models/civil_services/county');
var CountyDomain = require('../../api/v1/domain/county');

var env = config.get('env');
var indexType = env + '_county';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * Update County Index
 * @type {{update: CountyES.update}}
 */
var CountyES = {
  update: function(){
    elasticsearchClient.search({
      index: indexName,
      size: 0,
      body: {}
    })
    .then(function() {
      var params = {};

      return CountyModel.findAll(params);
    })
    .then(function(data) {
      if (data.length) {
        var bulkActions = [];

        _.each(data, function(evt) {
          bulkActions.push({
            index: {
              _index: indexName,
              _type: indexType,
              _id: evt.id
            }
          });

          bulkActions.push(CountyDomain.prepareForElasticSearch(evt));
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
            debug.error(error);
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

module.exports = CountyES;
