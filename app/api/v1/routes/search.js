/**
 * @module routes/search
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var search = require('../domain/search');
var util = require('./util');
var router = express.Router(config.router);

/**
 * Search
 * @memberof module:routes/search
 * @name [GET] /search
 * @property {string} query - Query String
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/search').get(function(request, response) {
  search.users(request.query)
    .then(function(users) {
      response.json(util.createAPIResponse({
        data: users
      }));
    })
    .catch(function(errors) {
      response.status(400);
      response.json(util.createAPIResponse({
        error: true,
        errors: [errors.toString()]
      }));
    });
});

/**
 * Search Users
 * @memberof module:routes/search
 * @name [GET] /search/user
 * @property {string} query - Query String
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/search/user').get(function(request, response) {
  search.users(request.query)
    .then(function(users) {
      response.json(util.createAPIResponse({
        data: users
      }));
    })
    .catch(function(errors) {
      response.status(400);
      response.json(util.createAPIResponse({
        error: true,
        errors: [errors.toString()]
      }));
    });
});

module.exports = router;
