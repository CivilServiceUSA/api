/**
 * @module routes/tags
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

var DEFAULT_PAGE_SIZE = 30;

var env = config.get('env');
var indexType = env + '_tag';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * Tags
 * @memberof module:routes/tags
 * @name [GET] /tags
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/tags').get(function(request, response) {

  // Defaults
  var pageSize = DEFAULT_PAGE_SIZE;
  var page = 1;

  var searchParams = {
    index: indexName,
    sort: 'id',
    body: {}
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

  elasticsearchClient
    .search(searchParams)
    .then(function(result) {
      response.json(util.createAPIResponse({
        meta: {
          total: result.hits.total,
          showing: result.hits.hits.length,
          pages: Math.ceil(result.hits.total/searchParams.size),
          page: page
        },
        data: result.hits.hits.map(domain.Tag.prepareForAPIOutput)
      }, request.query.fields));
    })
    .catch(function(error) {
      response.json(util.createAPIResponse({
        errors: [error]
      }, request.query.fields));
    });
});

module.exports = router;
