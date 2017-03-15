/**
 * @module routes/city_council
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');

var router = express.Router(config.router);
var CityCouncilDomain = require('../domain/city_council');

/**
 * Geolocation
 * @memberof module:routes/city_council/:state/:city
 * @name [GET] /city-council
 */
/* istanbul ignore next */
router.route('/city-council/:state/:city').get(function(request, response) {

  CityCouncilDomain.search(request.params.state, request.params.city, request.query)
    .then(function(results){
      response.json(util.createAPIResponse({
        data: results
      }));
    })
    .catch(function(error){
      response.json(util.createAPIResponse({
        errors: [error]
      }));
    });
});

module.exports = router;
