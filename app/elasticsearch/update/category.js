/**
 * @module elasticsearch/update/category
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var config = require('../../config');
var elasticsearchClient = require('../client');
var domain = require('../../api/v1/domain');
var debug = require('../../debug');
var CategoryModel = require('../../models/api/categories');

var env = config.get('env');
var indexType = env + '_category';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * Update Category Index
 * @type {{update: CategoryES.update}}
 */
var CategoryES = {
  update: function(){
    elasticsearchClient.search({
        index: indexName,
        size: 0,
        body: {}
      })
      .then(function() {
        var params = {
          include: [{ model: CategoryModel, as: 'subcategories' }],
          where: {
            'parent_id': null
          },
          order: 'parent_id ASC'
        };

        return CategoryModel.findAll(params);
      })
      .then(function(categories) {

        if (categories.length) {
          var bulkActions = [];

          _.each(categories, function(evt) {
            bulkActions.push({
              index: {
                _index: indexName,
                _type: indexType,
                _id: evt.id
              }
            });

            bulkActions.push(domain.Category.prepareForElasticSearch(evt));
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

module.exports = CategoryES;
