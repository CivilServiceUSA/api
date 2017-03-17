/**
 * @module domain/profile
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var Promise = require('bluebird');

var HouseDomain = require('./house');
var SenateDomain = require('./senate');

/**
 * Domain Profile
 * @type {object}
 */
module.exports = {
  /**
   * Get Government Data by Zip Code
   * @param zipcode
   */
  search: function(params) {

    var house = new Promise(function (resolve, reject) {
      resolve(HouseDomain.search(params));
    });

    var senate = new Promise(function (resolve, reject) {
      resolve(SenateDomain.search(params));
    });

    return Promise.all([house, senate]).then(function(values) {

      var notices = _.union(values[0].notices, values[1].notices);
      var warnings = _.union(values[0].warnings, values[1].warnings);
      var errors = _.union(values[0].errors, values[1].errors);

      return {
        notices: notices,
        warnings: warnings,
        errors: errors,
        data: {
          house: values[0].data,
          senate: values[1].data
        }
      };
    });
  }
};
