/**
 * @module domain/profile
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var Promise = require('bluebird');

var db = require('../../../config/sequelize');
var House = require('../../../models/civil_services/house');
var Senate = require('../../../models/civil_services/senate');
var State = require('../../../models/civil_services/state');
var GeolocationDomain = require('./geolocation');

var state_code = '';
var government = {};

var getZipCode = function(zipcode) {
  return new Promise(function (resolve, reject) {
    GeolocationDomain.getZipcode(zipcode, null)
    .then(function(results){
      return resolve(results.data);
    });
  });
};

var getState = function(state_code) {
  return new Promise(function (resolve, reject) {
    State.findOne({
      where: {
        state_code: state_code
      }
    })
      .then(function(state) {
        if (state) {
          resolve(state);
        } else {
          reject('No found for ' + state);
        }
      });
  });
};

var getHouseData = function(zipcode) {
  return new Promise(function (resolve, reject) {
    var query = '' +
      'SELECT h.*, ST_ASGeoJSON(h.shape) FROM house h ' +
      'WHERE ( ' +
      'MBRContains(h.shape, (SELECT z.shape FROM zipcode z WHERE z.zipcode = :zipcode AND z.state = h.state_code)) OR ' +
      'MBROverlaps(h.shape, (SELECT z.shape FROM zipcode z WHERE z.zipcode = :zipcode AND z.state = h.state_code)) ' +
      ') AND ( ' +
      'ST_Contains(h.shape, (SELECT z.shape FROM zipcode z WHERE z.zipcode = :zipcode AND z.state = h.state_code)) OR ' +
      'ST_Overlaps(h.shape, (SELECT z.shape FROM zipcode z WHERE z.zipcode = :zipcode AND z.state = h.state_code)) ' +
      ')';

    db.dbApi.query(query, { replacements: { zipcode: zipcode }, model: House }).then(function(projects) {
      return resolve(projects);
    }).catch(function() {
      government.notice = true;
      government.notices.push('No House Data for ' + zipcode);
      return resolve(null);
    });
  });
};

var getSenateData = function(state_code) {
  return new Promise(function (resolve, reject) {
    Senate.findAll({
      where: {
        state_code: state_code
      }
    })
      .then(function(state) {
        if (state) {
          resolve(state);
        } else {
          reject('No found for ' + state);
        }
      });
  });
};

/**
 * Domain Profile
 * @type {object}
 */
module.exports = {
  /**
   * Get Government Data by Zip Code
   * @param zipcode
   */
  getZipcode: function(zipcode) {
    state_code = '';
    government = {
      notice: false,
      notices: [],
      data: {
        zipcode: {},
        state: {},
        house: [],
        senate: []
      }
    };

    return new Promise(function (resolve, reject) {

      getZipCode(zipcode).then(function(zipdata){
        government.data.zipcode = zipdata[0];
        state_code = zipdata[0].state;
      }).then(function(){
        return getState(state_code).then(function(response){
          government.data.state = response;
        });
      }).then(function(){
        return getHouseData(zipcode).then(function(response){
          government.data.house = response;
        });
      }).then(function(){
        return getSenateData(state_code).then(function(response){
          government.data.senate = response;
        });
      }).then(function(){
        resolve(government);
      });

      // getHouseData(zipcode).then(function(response){
      //   government.data.house = response;
      // }).then(function(){
      //   resolve(government);
      // }).then(function(){
      //   resolve(government);
      // });
    });
  }
};
