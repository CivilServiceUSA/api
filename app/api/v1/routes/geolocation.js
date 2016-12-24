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

var router = express.Router(config.router);
var GeolocationDomain = require('../domain/geolocation');

/**
 * Geolocation
 * @memberof module:routes/geolocation
 * @name [GET] /geolocation/zipcode/:zipcode
 * @property {string} zipcode - Zipcode to Search For
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
        response.json(util.createAPIResponse({
          error: false,
          data: results.data
        }));
      });
  } else {
    response.json(util.createAPIResponse({
      error: true,
      errors: ['Invalid Zip Code'],
      data: []
    }));
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
        response.json(util.createAPIResponse({
          data: results
        }));
      })
      .catch(function (error) {
        response.json(util.createAPIResponse({
          error: true,
          errors: [error],
          data: []
        }));
      });
  } else {
    response.json(util.createAPIResponse({
      error: true,
      errors: ['Invalid IP Address'],
      data: []
    }));
  }
});

/**
 * Geolocation
 * @memberof module:routes/geolocation
 * @property {string} [zipcode] - Unique Zip Code
 * @property {string} [city] - City to use as Filter
 * @property {string} [county] - County to use as Filter
 * @property {string} [state] - State to use as Filter
 * @property {string} [type] - Type to use as Filter ['UNIQUE','PO BOX','STANDARD','MILITARY']
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
      response.json(util.createAPIResponse(results));
    });
});

module.exports = router;
