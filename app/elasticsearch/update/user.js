/**
 * @module elasticsearch/update/user
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var config = require('../../config');
var elasticsearchClient = require('../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_user';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

var UserModel = require('../../models/api/users');
var UserDomain = require('../../api/v1/domain/user');

/**
 * Update User Index
 * @type {{update: UserES.update}}
 */
var UserES = {
  update: function(userId){

    elasticsearchClient.search({
      index: indexName,
      size: 0,
      body: {}
    })
    .then(function(result) {

      var params = {
        where: {
          banned: false
        }
      };

      if(userId){
        params.where.id = userId;
      }

      return UserModel.findAll(params);
    })
    .then(function(user) {

      if (user.length) {
        var bulkActions = [];

        _.each(user, function(evt) {

          bulkActions.push({
            index: {
              _index: indexName,
              _type: indexType,
              _id: evt.id
            }
          });

          var userData = UserDomain.prepareForElasticSearch(evt);

          bulkActions.push(userData);
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
            debug.error('Error indexing ' + indexName);
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

module.exports = UserES;
