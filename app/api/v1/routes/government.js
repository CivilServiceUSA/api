/**
 * @module routes/government
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var analytics = require('../../../analytics');
var util = require('./util');

var router = express.Router(config.router);
var GovernmentDomain = require('../domain/government');

/**
 * Senate
 * @memberof module:routes/government
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/government').get(function(request, response) {
  GovernmentDomain.search(request.query)
    .then(function(results){
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'Government', 'Search Results', request.query, results.length);

      response.json(util.createAPIResponse(results, request.query.fields));
    }).catch(function(error){
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'Government', 'Error', error.toString());

      response.json(util.createAPIResponse({
        errors: [error]
      }, request.query.fields)
    );
  });
});

module.exports = router;
