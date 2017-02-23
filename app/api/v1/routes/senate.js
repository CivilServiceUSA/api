/**
 * @module routes/senate
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');

var router = express.Router(config.router);
var SenateDomain = require('../domain/senate');

/**
 * Senate
 * @memberof module:routes/senate
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
router.route('/senate').get(function(request, response) {
  SenateDomain.search(request.query)
    .then(function(results){
      response.json(util.createAPIResponse(results));
    });
});

module.exports = router;
