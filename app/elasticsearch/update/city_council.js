/**
 * @module elasticsearch/update/city_council
 * @version 1.0.2
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var debug = require('../../debug');
var config = require('../../config');
var elasticsearchClient = require('../client');
var CityCouncilModel = require('../../models/civil_services/city_council');
var CityCouncilDomain = require('../../api/v1/domain/city_council');

var env = config.get('env');
var indexType = env + '_city_council';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * Update City Council Index
 * @type {{update: CityCouncilES.update}}
 */
var CityCouncilES = {
  update: function(){
    elasticsearchClient.search({
      index: indexName,
      size: 0,
      body: {}
    })
    .then(function() {
      var params = {};

      return CityCouncilModel.findAll(params);
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

          bulkActions.push(CityCouncilDomain.prepareForElasticSearch(evt));
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

module.exports = CityCouncilES;
