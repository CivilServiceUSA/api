/**
 * @module domain/city_council
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var turf = require('@turf/turf');
var CityCouncil = require('../../../models/civil_services/city_council');

/**
 * Geolocation
 * @type {object}
 */
module.exports = {
  /**
   * Search City Council Listings
   * @param {string} state - Two Letter Abbreviation of State
   * @param {string} city - Official Name of the city ( not abbreviated )
   * @param {object} query - Search Params
   * @returns {*}
   */
  search: function (state, city, query) {
    return new Promise(function (resolve, reject) {

      if (state && state.length === 2 && city && city.length !== 0) {

        if (query.latitude && !isNaN(parseFloat(query.latitude)) && query.longitude && !isNaN(parseFloat(query.longitude))) {
          var latitude = parseFloat(query.latitude);
          var longitude = parseFloat(query.longitude);

          state = state.toLowerCase();
          city = city.toLowerCase().replace(/[^a-z- ]/gi, '').replace(/ /gi, '-');

          // Fix City Names
          if (city === 'new-york') {
            city = 'new-york-city';
          }

          var fileName = state + '-' + city + '-city-council.geojson';
          var filePath = path.resolve(__dirname, '../../../geojson/' + fileName);

          fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
              return reject('We do not currently support this `state` and/or `city`.');
            }

            var point = {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
              }
            };

            var inside = false;
            var polygon = {};
            var response = {};
            var geojson = JSON.parse(data);

            for (var i = 0; i < geojson.features.length; i++) {
              polygon = geojson.features[i];
              inside = turf.inside(point, polygon);

              if (inside) {
                response = polygon.properties;
                break;
              }
            }

            if (inside) {
              CityCouncil.findAll({
                where: {
                  district_number: {
                    $or: {
                      $like: parseInt(response.district_number),
                      $eq: null
                    }
                  },
                  state: response.state,
                  city: {
                    $like: '%' + response.city + '%'
                  }
                }
              })
              .then(function(searchResults) {
                if(searchResults){

                  var cleanData = {};

                  for (var i = 0; i < searchResults.length; i++) {
                    if (searchResults[i].title === 'mayor') {

                      cleanData.mayor = {
                        state: searchResults[i].state,
                        city: searchResults[i].city,
                        representative: searchResults[i].representative,
                        district_number: searchResults[i].district_number,
                        party: searchResults[i].party.toLowerCase(),
                        email: searchResults[i].email,
                        phone: searchResults[i].phone,
                        twitter_url: searchResults[i].twitter_url,
                        facebook_url: searchResults[i].facebook_url,
                        photo_url: searchResults[i].photo_url
                      };

                    } else if (searchResults[i].title === 'district_attorney') {

                      cleanData.district_attorney = {
                        state: searchResults[i].state,
                        city: searchResults[i].city,
                        representative: searchResults[i].representative,
                        district_number: searchResults[i].district_number,
                        party: searchResults[i].party.toLowerCase(),
                        email: searchResults[i].email,
                        phone: searchResults[i].phone,
                        twitter_url: searchResults[i].twitter_url,
                        facebook_url: searchResults[i].facebook_url,
                        photo_url: searchResults[i].photo_url
                      };

                    } else if (searchResults[i].title === 'council_member') {

                      cleanData.council_member = {
                        state: searchResults[i].state,
                        city: searchResults[i].city,
                        representative: searchResults[i].representative,
                        district_number: searchResults[i].district_number,
                        party: searchResults[i].party.toLowerCase(),
                        email: searchResults[i].email,
                        phone: searchResults[i].phone,
                        twitter_url: searchResults[i].twitter_url,
                        facebook_url: searchResults[i].facebook_url,
                        photo_url: searchResults[i].photo_url
                      };
                    }
                  }

                  if (searchResults.length > 0) {
                    return resolve(cleanData);
                  }
                }

                return reject('While we did find the correct City Council District, we failed to find the complete City Council member data.');
              }).catch(function(error) {
                return reject(error);
              });

            } else {
              return reject('We do not have data for this `state` and/or `city`.');
            }
          });
        } else {
          CityCouncil.findOne({
            where: {
              state: state,
              city: {
                $like: '%' + city.replace(/-/gi, ' ') + '%'
              }
            }
          })
          .then(function(searchResults) {
            return (searchResults) ? resolve({ supported: true }) : resolve({ supported: false });
          }).catch(function(error) {
            return reject(error);
          });
        }
      } else {
        return reject('Missing required `state` and/or `city` search parameters.');
      }
    });
  }
};
