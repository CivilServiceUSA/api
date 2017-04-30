/**
 * @module routes/governor
 * @version 1.1.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var analytics = require('../../../analytics');
var util = require('./util');

var router = express.Router(config.router);
var GovernorDomain = require('../domain/governor');

/**
 * Governor
 * @memberof module:routes/governor
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/governor').get(function(request, response) {
  GovernorDomain.search(request.query)
    .then(function(results){
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'Governor', 'Search Results', request.query, results.length);

      response.json(util.createAPIResponse(results, request.query.fields));
    })
    .catch(function(error){
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'Governor', 'Error', error.toString());

      response.json(util.createAPIResponse({
        errors: ['Unable to Fetch Governor Data']
      }, request.query.fields));
    });
});

module.exports = router;
