/**
 * @module routes/state
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var analytics = require('../../../analytics');
var util = require('./util');

var router = express.Router(config.router);
var StateDomain = require('../domain/state');

/**
 * Senate
 * @memberof module:routes/state/:state
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/state').get(function(request, response) {
  StateDomain.search(request.query)
    .then(function(results){
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'State', 'Search Results', request.query, results.length);

      response.json(util.createAPIResponse(results, request.query.fields));
    });
});

/**
 * Senate
 * @memberof module:routes/state/:state
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/state/:state').get(function(request, response) {
  StateDomain.getState(request.params.state)
    .then(function(results){
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'State', util.titleCase(request.params.state), request.params, results.length);

      response.json(util.createAPIResponse({
        data: results
      }, request.query.fields));
    });
});

module.exports = router;
