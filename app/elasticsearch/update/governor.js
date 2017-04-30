/**
 * @module elasticsearch/update/governor
 * @version 1.1.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var debug = require('../../debug');
var config = require('../../config');
var elasticsearchClient = require('../client');
var GovernorModel = require('../../models/civil_services/governor');
var GovernorDomain = require('../../api/v1/domain/governor');

var env = config.get('env');
var indexType = env + '_governor';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * Update Governor Index
 * @type {{update: GovernorES.update}}
 */
var GovernorES = {
  update: function(){
    elasticsearchClient.search({
      index: indexName,
      size: 0,
      body: {}
    })
    .then(function() {
      var params = {};

      return GovernorModel.findAll(params);
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

          bulkActions.push(GovernorDomain.prepareForElasticSearch(evt));
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

module.exports = GovernorES;
