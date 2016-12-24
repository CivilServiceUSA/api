/**
 * @module middlewear/require_auth
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var jwt = require('express-jwt');
var config = require('../config');

/**
 * Require Auth
 * @type {object}
 */
module.exports = jwt({
  secret: config.get('secret')
});
