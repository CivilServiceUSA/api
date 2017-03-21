/**
 * @module routes/geolocation
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');
var ipaddr = require('ipaddr.js');
var analytics = require('../../../analytics');

var router = express.Router(config.router);
var GeolocationDomain = require('../domain/geolocation');

/**
 * Geolocation
 * @memberof module:routes/geolocation
 * @name [GET] /geolocation/zipcode/:zipcode
 * @property {string} zipcode - Zipcode to Search For
 * @property {string} [fields] - Comma Separated List of fields you want in the response
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/geolocation/zipcode/:zipcode').get(function(request, response) {

  var valid = (request.params.zipcode && request.params.zipcode.length === 5 && /^[0-9]{5}/.test(request.params.zipcode));

  if (valid) {
    GeolocationDomain.getZipcode(request.params.zipcode, request.query)
      .then(function(results){
        var apikey = (request.header('API-Key')) || request.query.apikey || null;
        analytics.trackEvent(apikey, 'Geolocation', 'Zip Code', request.params.zipcode, results.length);

        response.json(util.createAPIResponse({
          data: results.data
        }, request.query.fields));
      });
  } else {
    var apikey = (request.header('API-Key')) || request.query.apikey || null;
    analytics.trackEvent(apikey, 'Geolocation', 'Invalid Zip Code', request.params.zipcode);

    response.json(util.createAPIResponse({
      errors: ['Invalid Zip Code'],
      data: []
    }, request.query.fields));
  }
});

/**
 * Lookup Location Data from IP Address
 * @memberof module:routes/geolocation
 * @name [GET] /geolocation/ip/:ipaddress
 * @property {string} [ipaddress=Requester's IP Address] - IP Address to Search For
 */
/* istanbul ignore next */
router.route('/geolocation/ip/:ipaddress?').get(function(request, response) {

  var valid = true;
  var ip = request.params.ipaddress;

  if (ip) {
    valid = (ip && /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip));
  } else {
    ip = request.headers['x-forwarded-for'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.connection.socket.remoteAddress;
  }

  var addr = ipaddr.process(ip).toString();

  if (addr && valid) {
    GeolocationDomain.getIpAddress(addr, 'cities')
      .then(function (results) {
        var apikey = (request.header('API-Key')) || request.query.apikey || null;
        analytics.trackEvent(apikey, 'Geolocation', 'IP Address', request.query.apikey, results.length);

        response.json(util.createAPIResponse({
          data: results
        }, request.query.fields));
      })
      .catch(function (error) {
        var apikey = (request.header('API-Key')) || request.query.apikey || null;
        analytics.trackEvent(apikey, 'Geolocation', 'Error - IP Address', error.toString());

        response.json(util.createAPIResponse({
          errors: [error]
        }, request.query.fields));
      });
  } else {
    var apikey = (request.header('API-Key')) || request.query.apikey || null;
    analytics.trackEvent(apikey, 'Geolocation', 'Error - IP Address', 'Invalid IP Address');

    response.json(util.createAPIResponse({
      errors: ['Invalid IP Address']
    }, request.query.fields));
  }
});

/**
 * Geolocation
 * @memberof module:routes/geolocation
 * @property {string} [zipcode] - Unique Zip Code
 * @property {string} [city] - City to use as Filter
 * @property {string} [county] - County to use as Filter
 * @property {string} [state] - State to use as Filter
 * @property {number} [areaCode] - Area Code of Phone Number to use as Filter
 * @property {string} [timezone] - Time Zone of Location ( e.g. America/New_York )
 * @property {number} [minPopulation] - Minimum Population of Location
 * @property {number} [maxPopulation] - Maximum Population of Location
 * @property {number} [latitude] - Latitude to base Location on
 * @property {number} [longitude] - Longitude to base Location on
 * @property {string} [distance=5mi] - Distance from Latitude & Longitude ( e.g. 5mi, 10km )
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/geolocation').get(function(request, response) {
  GeolocationDomain.getLocation(request.query)
    .then(function(results){
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'Geolocation', 'Search Results', JSON.stringify(request.query));

      response.json(util.createAPIResponse(results, request.query.fields));
    })
    .catch(function (error) {
      var apikey = (request.header('API-Key')) || request.query.apikey || null;
      analytics.trackEvent(apikey, 'Geolocation', 'Error', error.toString());

      response.json(util.createAPIResponse({
        errors: [error]
      }, request.query.fields));
    });
});

module.exports = router;
