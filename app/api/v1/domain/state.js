/**
 * @module domain/profile
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var State = require('../../../models/civil_services/state');

/**
 * Domain Profile
 * @type {object}
 */
module.exports = {
  /**
   * Get State
   * @param {number} state - State
   * @returns {*}
   */
  getState: function(state) {
    if (state) {
      return State.findOne({
          where: {
            state_name_slug: state
          },
          order: [
            [
              'created_date', 'DESC'
            ]
          ]
        })
        .then(function(state) {
          if (state) {
            return {
              state_name: state.state_name,
              state_name_slug: state.state_name_slug,
              state_code: state.state_code,
              state_code_slug: state.state_code_slug,
              nickname: state.nickname,
              website: state.website,
              admission_date: state.admission_date,
              admission_number: state.admission_number,
              capital_city: state.capital_city,
              capital_url: state.capital_url,
              population: state.population,
              population_rank: state.population_rank,
              constitution_url: state.constitution_url,
              state_flag: {
                large: state.state_flag_url,
                small: state.state_flag_url.replace('-large.png', '-small.png')
              },
              state_seal: {
                large: state.state_seal_url,
                small: state.state_seal_url.replace('-large.png', '-small.png')
              },
              map: {
                large: state.map_image_url,
                small: state.map_image_url.replace('-large.png', '-small.png')
              },
              landscape: {
                size_640x360: state.landscape_background_url.replace('1280x720', '640x360'),
                size_960x540: state.landscape_background_url.replace('1280x720', '960x540'),
                size_1280x720: state.landscape_background_url,
                size_1920x1080: state.landscape_background_url.replace('1280x720', '1920x1080')
              },
              skyline: {
                size_640x360: state.skyline_background_url.replace('1280x720', '640x360'),
                size_960x540: state.skyline_background_url.replace('1280x720', '960x540'),
                size_1280x720: state.skyline_background_url,
                size_1920x1080: state.skyline_background_url.replace('1280x720', '1920x1080')
              },
              twitter_handle: state.twitter_handle,
              twitter_url: state.twitter_url,
              facebook_url: state.facebook_url
            };
          } else {
            return Promise.reject('No found for ' + state);
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  }
};
