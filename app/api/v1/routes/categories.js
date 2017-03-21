/**
 * @module routes/categories
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var validator = require('validator');
var _ = require('lodash');
var config = require('../../../config');
var elasticsearchClient = require('../../../elasticsearch/client');
var domain = require('../domain');
var util = require('./util');
var router = express.Router(config.router);
var analytics = require('../../../analytics');


var DEFAULT_PAGE_SIZE = 30;

var env = config.get('env');
var indexType = env + '_category';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * [GET] Categories
 * @memberof module:routes/categories
 * @name /categories/:slug?
 * @property {string} [slug] - Specific Category Slug
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/categories/:slug?').get(function(request, response) {

  // Defaults
  var pageSize = DEFAULT_PAGE_SIZE;
  var page = 1;

  var searchParams = {
    index: indexName,
    sort: 'id',
    body: {},
    where: {
      parent_id: null
    }
  };

  // Page size
  if (request.query.pageSize && validator.isInt(request.query.pageSize) && validator.toInt(request.query.pageSize, 10) >= 1) {
    pageSize = validator.toInt(request.query.pageSize, 10);
  }

  searchParams.size = pageSize;

  // Determine Page
  if (request.query.page && validator.isInt(request.query.page) && validator.toInt(request.query.page, 10) >= 1) {
    page = validator.toInt(request.query.page, 10);
  }

  searchParams.from = (page - 1) * searchParams.size;

  if(request.params.slug){
    searchParams.body = {
      query: {
        match: {
          slug: request.params.slug
        }
      }
    };
  }

  elasticsearchClient
    .search(searchParams)
    .then(function(result) {
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'Categories', 'Results', 'Params: ' + JSON.stringify(request.params), result.hits.total);

      response.json(util.createAPIResponse({
        meta: {
          total: result.hits.total,
          showing: result.hits.hits.length,
          pages: Math.ceil(result.hits.total/searchParams.size),
          page: page
        },
        data: result.hits.hits.map(domain.Category.prepareForAPIOutput)
      }));
    })
    .catch(function(error) {
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'Categories', 'Error', error.toString());

      response.json(util.createAPIResponse({
        errors: [error]
      }, request.query.fields));
    });
});

module.exports = router;
