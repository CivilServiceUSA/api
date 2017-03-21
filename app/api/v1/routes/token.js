/**
 * @module routes/token
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');
var router = express.Router(config.router);
var auth = require('../domain/users/auth');

/**
 * Token
 * @memberof module:routes/token
 * @name [GET] /token
 */
/* istanbul ignore next */
router.route('/token').get(function(request, response) {

  var ipAddress = request.headers['x-forwarded-for'];
  var token = auth.createWebsiteToken(ipAddress);
  response.json(util.createAPIResponse({
    data: {
      token: token
    }
  }, request.query.fields));
});

module.exports = router;
