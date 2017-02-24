/**
 * @module routes/house
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');

var router = express.Router(config.router);
var HouseDomain = require('../domain/house');

/**
 * House
 * @memberof module:routes/house
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/house').get(function(request, response) {
  HouseDomain.search(request.query)
    .then(function(results){
      response.json(util.createAPIResponse(results));
    });
});

module.exports = router;
