/**
 * @module routes/city_council
 * @version 1.0.3
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');
var analytics = require('../../../analytics');

var router = express.Router(config.router);
var CityCouncilDomain = require('../domain/city_council');

/**
 * Geolocation
 * @memberof module:routes/city_council
 * @name [GET] /city-council
 */
/* istanbul ignore next */
router.route('/city-council').get(function(request, response) {

  CityCouncilDomain.search(request.query)
    .then(function(results){
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'City Council', 'Search Results', 'Query: ' + JSON.stringify(request.query), results.length);

      response.json(util.createAPIResponse(results, request.query.fields));
    })
    .catch(function(error){
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'City Council', 'Error - ' + util.titleCase(request.params.city) + ', ' + request.params.state.toUpperCase(), error.toString());

      response.json(util.createAPIResponse({
        errors: ['Unable to Fetch City Council Data']
      }, request.query.fields));
    });
});

/**
 * Geolocation
 * @memberof module:routes/city_council/:state/:city
 * @name [GET] /city-council
 */
/* istanbul ignore next */
router.route('/city-council/:state/:city').get(function(request, response) {

  request.query.state = request.params.state;
  request.query.city = request.params.city;

  CityCouncilDomain.search(request.query)
    .then(function(results){
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'City Council', util.titleCase(request.params.city) + ', ' + request.params.state.toUpperCase(), 'Query: ' + JSON.stringify(request.query), results.length);

      response.json(util.createAPIResponse(results, request.query.fields));
    })
    .catch(function(error){
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'City Council', 'Error - ' + util.titleCase(request.params.city) + ', ' + request.params.state.toUpperCase(), error.toString());

      response.json(util.createAPIResponse({
        errors: [error]
      }, request.query.fields));
    });
});

module.exports = router;
