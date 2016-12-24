/**
 * @module domain/users/local_auth_strategy
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var LocalStrategy = require('passport-local').Strategy;
var User = require('../../../../models/api/users');
var hasher = require('../../../../util/hasher');

/**
 * Local Auth Strategy
 * @type {object}
 */
module.exports = new LocalStrategy(
  /**
   * @name Local Authentication Strategy
   * @property {string} username - Username for Login
   * @property {string} password - Password for Login
   * @property {callback} cb - Requested Callback Handler
   */
  function(username, password, cb) {
    User.findOne({
      where: {
        username: username.toLowerCase()
      }
    })
    .then(function(user) {
      if ( !user) {
        return cb('Incorrect Username');
      }

      if (!user.isActive()) {
        return cb('Account is Either Inactive of Banned');
      }

      hasher.verify(password, user.password)
      .then(function(isValid) {
        if (isValid === true) {
          return cb(null, user);
        } else {
          return cb('Incorrect Password');
        }
      });
    })
    .catch(cb);
  }
);
