/**
 * @module domain/search
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var User = require('../../../models/api/users');
var md5 = require('md5');

/**
 * Domain Search
 * @type {object}
 */
module.exports = {
  /**
   * Search Users
   * @param {object} params - Search Parameters
   * @param {object} params.query - Search Query
   * @returns {*}
   */
  users: function(params){
    if (params) {
      return User.findAll({
          where: {
            $or: {
              username: {
                $like: '%' + params.query + '%'
              },
              first_name: {
                $like: '%' + params.query + '%'
              },
              last_name: {
                $like: '%' + params.query + '%'
              },
              profile_name: {
                $like: '%' + params.query + '%'
              },
              company_name: {
                $like: '%' + params.query + '%'
              },
              bio: {
                $like: '%' + params.query + '%'
              }
            },
            activated: true,
            banned: false
          }
        })
        .then(function(users) {
          if(users){
            var cleanData = [];

            /* istanbul ignore next */
            for(var i = 0; i < users.length; i++){

              var u = users[i];

              var userCleaned = {
                id: u.id,
                username: u.username,
                profile_name: u.profile_name,
                profile_photo: (u.profile_photo) ? u.profile_photo : 'https://secure.gravatar.com/avatar/' + md5(u.email) + '?r=g&s=200&d=identicon',
                joined_on: u.created_date
              };

              cleanData.push(userCleaned);
            }

            return cleanData;

          } else {
            return [];
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  }
};
