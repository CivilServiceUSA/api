/**
 * @module domain/search
 * @version 1.1.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var Promise = require('bluebird');
var util = require('./util');

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

    if (!params.keyword || params.keyword.length < 3) {
      return Promise.reject('Search Endpoint Requires a `keyword` Parameter that\'s at least three characters.');
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

      var filterData = function (data, filters) {
        return _.omitBy(data, function(value, key) {
          return (filters.indexOf(key) === -1);
        });
      };

      var cleanData = function (data, type, filters) {
        if (typeof data !== 'undefined' && filters.length > 0) {
          if (Array.isArray(data)) {
            var filteredData = [];
            for (var i = 0; i < data.length; i++) {
              data[i].data_type = type;
              var filtered = filterData(data[i], filters);

              filteredData.push(filtered);
            }

            return filteredData;
          } else {

            return _.omitBy(data, function(value, key) {
              return (filters.indexOf(key) === -1);
            });
          }
        }
      };

      var filters = ['data_type', 'name', 'photo_url', 'civil_services_url'];
      var houseClean = cleanData(values[0].data, 'us-house-representative', filters);
      var senateClean = cleanData(values[1].data, 'us-senator', filters);
      var cityCouncilClean = cleanData(values[2].data, 'city-councilor', filters);
      var governorClean = cleanData(values[3].data, 'us-governor', filters);
      var stateClean = cleanData(values[4].data, 'us-state', filters);

      return {
        notices: notices,
        warnings: warnings,
        errors: errors,
        data: _.union(houseClean, senateClean, cityCouncilClean, governorClean, stateClean)
      };
    });
  }
};
