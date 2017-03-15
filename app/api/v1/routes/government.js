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
var GovernmentDomain = require('../domain/government');

/**
 * Senate
 * @memberof module:routes/senate
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/government/zipcode/:zipcode').get(function(request, response) {
  var valid = (request.params.zipcode && request.params.zipcode.length === 5 && /^[0-9]{5}/.test(request.params.zipcode));

  if (valid) {
    GovernmentDomain.getZipcode(request.params.zipcode, request.query)
      .then(function(results){
        response.json(util.createAPIResponse(results));
      }).catch(function(error){
        response.json(util.createAPIResponse({
          errors: [error]
        }));
      });
  } else {
    response.json(util.createAPIResponse({
      errors: ['Invalid Zip Code']
    }));
  }

});

module.exports = router;
