/**
 * @module routes/profile
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var profile = require('../domain/profile');
var util = require('./util');
var router = express.Router(config.router);

/**
 * Profile Activity
 * @memberof module:routes/profile
 * @name [GET] /profile/activity
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/profile/activity').get(function(request, response) {

  util.isValidUser(request, function(validUserId){

    if(validUserId){
      profile.getActivity(validUserId)
        .then(function(activity) {
          response.json(util.createAPIResponse({
            data: activity
          }));
        })
        .catch(function(errors) {
          response.status(400);
          response.json(util.createAPIResponse({
            error: true,
            errors: [errors.toString()]
          }));
        });
    } else {
      response.json(util.createAPIResponse({
        error: true,
        errors: ['Invalid API Authorization Token']
      }));
    }
  });
});

/**
 * Profile Notifications
 * @memberof module:routes/profile
 * @name [GET] /profile/notifications
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/profile/notifications').get(function(request, response) {

  util.isValidUser(request, function(validUserId){
    if(validUserId){
      profile.getNotifications(validUserId)
        .then(function(user) {
          response.json(util.createAPIResponse({
            data: user.publicJSON()
          }));
        })
        .catch(function(errors) {
          response.status(400);
          response.json(util.createAPIResponse({
            error: true,
            errors: [errors.toString()]
          }));
        });
    } else {
      response.json(util.createAPIResponse({
        error: true,
        errors: ['Invalid API Authorization Token']
      }));
    }
  });
});

module.exports = router;
