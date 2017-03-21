/**
 * @module routes/senate
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var analytics = require('../../../analytics');
var util = require('./util');

var router = express.Router(config.router);
var SenateDomain = require('../domain/senate');

/**
 * Senate
 * @memberof module:routes/senate
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/senate').get(function(request, response) {
  SenateDomain.search(request.query)
    .then(function(results){
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'Senate', 'Search Results', request.query, results.length);

      response.json(util.createAPIResponse(results, request.query.fields));
    });
});

module.exports = router;
