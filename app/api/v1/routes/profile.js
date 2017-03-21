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
          }, request.query.fields));
        })
        .catch(function(errors) {
          response.status(400);
          response.json(util.createAPIResponse({
            errors: [errors.toString()]
          }, request.query.fields));
        });
    } else {
      response.json(util.createAPIResponse({
        errors: ['Invalid API Authorization Token']
      }, request.query.fields));
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
          }, request.query.fields));
        })
        .catch(function(errors) {
          response.status(400);
          response.json(util.createAPIResponse({
            errors: [errors.toString()]
          }, request.query.fields));
        });
    } else {
      response.json(util.createAPIResponse({
        errors: ['Invalid API Authorization Token']
      }, request.query.fields));
    }
  });
});

module.exports = router;
