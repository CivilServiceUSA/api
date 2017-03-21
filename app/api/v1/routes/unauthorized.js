/**
 * @module routes/unauthorized
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');
var router = express.Router(config.router);

/**
 * Unauthorized
 * @memberof module:routes/unauthorized
 * @name [GET] /unauthorized
 */
/* istanbul ignore next */
router.route('/unauthorized/').get(function(request, response) {
  response.json(util.createAPIResponse({
    error_messages: [
      'Invalid API Request. Either your API Key is invalid, or you are accessing our API from an invalid source.'
    ]
  }, request.query.fields));
});

module.exports = router;
