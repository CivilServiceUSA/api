/**
 * @module domain/users/auth
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('../../../../config');


/**
 * User auth utilities for creating, verifying, and refreshing auth tokens
 * @type {object}
 */
module.exports = {

  /**
   * @constant {number}
   */
  TOKEN_EXPIRATION_DAYS: 7,

  /**
   * @constant {string}
   */
  ISSUER: 'API',

  /**
   * Create a JWT token for the passed in Open Auth ID
   * @param {mixed} Open Auth ID of User
   * @return {mixed} Returns a string is a valid user id is extracted, otherwise returns false
   */
  createAuthToken: function(authID) {

    if(authID === null || authID === '') {
      return false;
    }

    return jwt.sign({
        authID: authID
      },
      config.get('secret'),
      {
        issuer: this.ISSUER,
        expiresIn: this.TOKEN_EXPIRATION_DAYS + 'd'
      }
    );
  },

  /**
   * Create a JWT token for the passed in user. Argument can be a user model instance or a user id
   * @param {mixed} user Either a Sequelize User model instance or a user id
   * @return {mixed} Returns a string is a valid user id is extracted, otherwise returns false
   */
  createUserToken: function(user) {
    var userId;

    if (_.isObject(user)) {
      userId = user.get('id');
    } else {
      userId = parseInt(user, 10);
      if (_.isNaN(userId)) {
        return false;
      }
    }

    return jwt.sign({
        userId: userId
      },
      config.get('secret'),
      {
        issuer: this.ISSUER,
        expiresIn: this.TOKEN_EXPIRATION_DAYS + 'd'
      }
    );
  },

  /**
   * Create a JWT token for the passed in IP Address
   * @param {mixed} ip Ip Address of User
   * @return {mixed} Returns a string is a valid user id is extracted, otherwise returns false
   */
  createWebsiteToken: function(ip) {

    if(ip === null || ip === '') {
      return false;
    }

    return jwt.sign({
        ipAddress: ip
      },
      config.get('secret'),
      {
        issuer: this.ISSUER,
        expiresIn: this.TOKEN_EXPIRATION_DAYS + 'd'
      }
    );
  },

  /**
   * Refresh the expiration date of the passed in token. Returns a new token for a valid token, or false for an expired token
   * @param  {string} token JWT token to refresh
   * @return {mixed}  Returns a new token string with a refreshed expiration date if valid, otherwise returns false
   */
  refreshToken: function(token) {
    var verified = this.verifyToken(token);
    if (verified) {
      return this.createUserToken(verified.userId);
    } else {
      return false;
    }
  },

  /**
   * Verify a JWT token. Returns false for an invalid or expired token otherwise returns the decoded token
   * @param  {string} token JWT token to verify
   * @return {mixed} Returns an object of decoded token data if valid, otherwise false
   */
  verifyToken: function(token) {
    try {
      return jwt.verify(token, config.get('secret'));
    } catch(err) {
      return false;
    }
  }
};
