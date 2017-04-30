/**
 * @module domain/government
 * @version 1.1.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var Promise = require('bluebird');

var HouseDomain = require('./house');
var SenateDomain = require('./senate');
var CityCouncilDomain = require('./city_council');
var GovernorDomain = require('./governor');
var StateDomain = require('./state');

/**
 * Domain Profile
 * @type {object}
 */
module.exports = {
  /**
   * Get Government Data by either Zip Code or Geolocation
   * @param params
   */
  search: function(params) {

    if (!params || (( !params.latitude && !params.longitude) && !params.zipcode)) {
      return Promise.reject('Requires `latitude` and `longitude`, or `zipcode` Parameters.');
    }

    var house = new Promise(function (resolve) {
      resolve(HouseDomain.search(params));
    });

    var senate = new Promise(function (resolve) {
      resolve(SenateDomain.search(params));
    });

    var city_council = new Promise(function (resolve) {
      resolve(CityCouncilDomain.search(params));
    });

    var governor = new Promise(function (resolve) {
      resolve(GovernorDomain.search(params));
    });

    var state = new Promise(function (resolve) {
      resolve(StateDomain.search(params));
    });

    return Promise.all([house, senate, city_council, governor, state]).then(function(values) {

      var notices = _.union(values[0].notices, values[1].notices, values[2].notices, values[3].notices, values[4].notices);
      var warnings = _.union(values[0].warnings, values[1].warnings, values[2].warnings, values[3].warnings, values[4].warnings);
      var errors = _.union(values[0].errors, values[1].errors, values[2].errors, values[3].errors, values[4].errors);

      return {
        notices: notices,
        warnings: warnings,
        errors: errors,
        data: {
          house: values[0].data,
          senate: values[1].data,
          city_council: values[2].data,
          governor: values[3].data,
          state: values[4].data[0]
        }
      };
    });
  }
};
