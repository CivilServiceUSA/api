/**
 * @module domain/profile
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var Activity = require('../../../models/api/user_activity');
var User = require('../../../models/api/users');
var md5 = require('md5');

/**
 * Domain Profile
 * @type {object}
 */
module.exports = {
  /**
   * Get User Activity
   * @param {number} userId - User ID
   * @returns {*}
   */
  getActivity: function(userId) {
    if (userId) {
      return Activity.findAll({
          include: [
            {
              model: User,
              as: 'User'
            },
            {
              model: User,
              as: 'Following'
            }
          ],
          where: {
            user_id: userId
          },
          order: [
            [
              'created_date', 'DESC'
            ]
          ]
        })
        .then(function(activity) {
          if (activity) {

            var cleanData = [];

            /* istanbul ignore next */
            for(var i = 0; i < activity.length; i++){

              var current = activity[i];

              var activityCleaned = {
                id: current.id,
                type: current.type,
                created_date: current.created_date,
                following: null,
                project: null,
                collection: null
              };

              if(current.Following){
                var u = current.Following;
                activityCleaned.following = {
                  id: u.id,
                  username: u.username,
                  profile_name: u.profile_name,
                  profile_photo: (u.profile_photo) ? u.profile_photo : 'https://secure.gravatar.com/avatar/' + md5(u.email) + '?r=g&s=200&d=identicon',
                  followed_on: u.created_date
                };
              }

              cleanData.push(activityCleaned);
            }

            return cleanData;

          } else {
            return Promise.reject('No activity found for user ' + userId);
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  },

  /**
   * Get Notifications
   * @todo: Flush This Out
   */
  getNotifications: function(userId) {
    return Promise.resolve(userId);
  }
};
