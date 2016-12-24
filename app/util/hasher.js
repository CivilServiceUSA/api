/**
 * @module util/hasher
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var bcrypt = require('bcrypt');
var Promise = require('bluebird');

var SALT_LENGTH = 8;

/**
 * Promise-based encryption generation and verification
 * @type {object}
 */
module.exports = {

  /**
   * Generate an encrypted string from the passed in string
   * @param  {string} str
   * @return {object} Promise object that passes a string on success
   */
  generate: function(str) {
    var hash = Promise.promisify(bcrypt.hash);
    return hash(str, SALT_LENGTH);
  },

  /**
   * Verify an unencrypted string against an encrypted one
   * @param  {string} plainString   Unencrypted string
   * @param  {string} encodedString Encrypted string
   * @return {object} Promise object that passes a boolean
   */
  verify: function(plainString, encodedString) {
    var compare = Promise.promisify(bcrypt.compare);
    return compare(plainString, encodedString);
  }
};
