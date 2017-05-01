/**
 * @module domain/indexer
 * @version 1.1.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var Promise = require('bluebird');
var md5 = require('md5');
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
  fetch: function() {

    var house = new Promise(function (resolve) {
      resolve(HouseDomain.search({
        pageSize: '500',
        sort: 'state_code,district'
      }));
    });

    var senate = new Promise(function (resolve) {
      resolve(SenateDomain.search({
        pageSize: '500',
        sort: 'state_code,last_name'
      }));
    });

    var city_council = new Promise(function (resolve) {
      resolve(CityCouncilDomain.search({
        pageSize: '500',
        sort: 'state_code,district,last_name'
      }));
    });

    var governor = new Promise(function (resolve) {
      resolve(GovernorDomain.search({
        pageSize: '500',
        sort: 'state_code,last_name'
      }));
    });

    var state = new Promise(function (resolve) {
      resolve(StateDomain.search({
        pageSize: '500',
        sort: 'state_code'
      }));
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

      var filters = ['data_type', 'name', 'title', 'photo_url_sizes', 'skyline', 'state_name', 'state_code', 'city_name', 'civil_services_url'];
      var houseClean = cleanData(values[0].data, 'us-house-representative', filters);
      var senateClean = cleanData(values[1].data, 'us-senator', filters);
      var cityCouncilClean = cleanData(values[2].data, 'city-councilor', filters);
      var governorClean = cleanData(values[3].data, 'us-governor', filters);
      var stateClean = cleanData(values[4].data, 'us-state', filters);

      var data = _.union(houseClean, senateClean, cityCouncilClean, governorClean, stateClean);
      var prepared = [];

      for (var i = 0; i < data.length; i++) {

        var keywords = [];
        var description = '';
        var title = '';
        var photo = '';
        var name = data[i].name.replace(/\s+/g, ' ').trim();

        switch (data[i].data_type) {
          case 'us-house-representative':
            title = util.titleCase(data[i].title) + ' ' + name;
            description = 'Accountability Reports, Demographic Data & Contact Information for ' + data[i].state_name + ' U.S. House ' + util.titleCase(data[i].title) + ' ' + name;
            keywords = description.replace(' &', '').replace(' for', '').split(' ');
            photo = data[i].photo_url_sizes.size_256x256;
            break;

          case 'us-senator':
            title = util.titleCase(data[i].title) + ' ' + name;
            description = 'Accountability Reports, Demographic Data & Contact Information for ' + data[i].state_name + ' U.S. ' + util.titleCase(data[i].title) + ' ' + name;
            keywords = description.replace(' &', '').replace(' for', '').split(' ');
            photo = data[i].photo_url_sizes.size_256x256;
            break;

          case 'us-governor':
            title = util.titleCase(data[i].title) + ' ' + name;
            description = 'Demographic Data & Contact Information for ' + data[i].state_name + ' U.S. State ' + util.titleCase(data[i].title) + ' ' + name;
            keywords = description.replace(' &', '').replace(' for', '').split(' ');
            photo = data[i].photo_url_sizes.size_256x256;
            break;

          case 'city-councilor':
            title = util.titleCase(data[i].title) + ' ' + name;
            description = 'Demographic Data & Contact Information for ' + data[i].city_name + ', ' + data[i].state_code + ' - City ' + util.titleCase(data[i].title) + ' ' + name;
            keywords = description.replace(' &', '').replace(' for', '').replace(' - ', ' ').replace(',', '').split(' ');
            photo = data[i].photo_url_sizes.size_256x256;
            break;

          case 'us-state':
            title = 'State of ' + data[i].name;
            description = 'Information on U.S. State ' + name;
            keywords = description.split(' ');
            photo = data[i].skyline.size_640x360;
            break;
        }

        if (name !== '') {
          prepared.push({
            domain: 'app.civil.services',
            identifier: md5(data[i].civil_services_url),
            title: title,
            description: description,
            web_url: data[i].civil_services_url,
            url: photo,
            keywords: keywords,
            lifetime: 1440
          });
        }
      }

      return {
        notices: notices,
        warnings: warnings,
        errors: errors,
        data: prepared
      };
    });
  }
};
