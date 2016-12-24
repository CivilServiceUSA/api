/**
 * @module domain/user
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var User = require('../../../models/api/users');
var UserFollow = require('../../../models/api/user_follows');
var UserInvite = require('../../../models/api/user_invite');
var md5 = require('md5');
var randomString = require('randomstring');
var email = require('./email');
var hasher = require('../../../util/hasher');
var routeUtil = require('../routes/util');
var Hashids = require('hashids');
var config = require('../../../config');

/**
 * Domain User
 * @type {object}
 */
module.exports = {
  /**
   * Prepare For API Output
   * @param {object} data - Data to be processed for API Output
   * @return {object}
   */
  prepareForAPIOutput: function(data) {
    var fields = [
      'bio',
      'company_name',
      'email',
      'first_name',
      'hash_id',
      'join_date',
      'last_name',
      'location',
      'profile_link_1',
      'profile_link_2',
      'profile_link_3',
      'profile_link_twitter',
      'profile_link_website',
      'profile_name',
      'profile_photo',
      'username'
    ];

    return _.pick(data._source, fields);
  },

  /**
   * Prepare For Elastic Search
   * @param {object} data - Data to be Processed for Elastic Search
   * @param {number} data.id - User ID
   * @param {string} data.bio - User Bio
   * @param {string} data.company_name - User Company Name
   * @param {string} data.email - User Email Address
   * @param {string} data.first_name - User First Name
   * @param {string} data.hash_id - User Hash ID
   * @param {timestamp} data.join_date - User Join Date
   * @param {string} data.last_name - User Last Name
   * @param {string} data.location - User Location
   * @param {string} data.profile_link_1 - User Misc Link #1
   * @param {string} data.profile_link_2 - User Misc Link #2
   * @param {string} data.profile_link_3 - User Misc Link #3
   * @param {string} data.profile_link_twitter - User Twitter Link
   * @param {string} data.profile_link_website - User Website Link
   * @param {string} data.profile_name - User Profile Name
   * @param {string} data.profile_photo - User Profile Photo URL
   * @param {string} data.username - Users Username
   * @return {object}
   */
  prepareForElasticSearch: function(data) {
    return {
      id: data.id,
      bio: data.bio,
      company_name: data.company_name,
      email: data.email,
      first_name: data.first_name,
      hash_id: data.hash_id,
      join_date: data.join_date,
      last_name: data.last_name,
      location: data.location,
      profile_link_1: data.profile_link_1,
      profile_link_2: data.profile_link_2,
      profile_link_3: data.profile_link_3,
      profile_link_twitter: data.profile_link_twitter,
      profile_link_website: data.profile_link_website,
      profile_name: data.profile_name,
      profile_photo: data.profile_photo,
      username: data.username
    };
  },

  /**
   * Check Invite Code
   * @param {string} key - Hash ID of User ID
   * @returns {*}
   */
  checkInviteCode: function(key){
    var hashID = new Hashids(config.get('hashID.secret'), config.get('hashID.length'), config.get('hashID.alphabet'));
    var userID = hashID.decode(key);

    if (parseInt(userID, 10)) {
      return UserInvite.findAll(
        {
          include: [
            {
              model: User,
              where: {
                activated: true,
                banned: false
              },
              as: 'User'
            },
            {
              model: User,
              where: {
                activated: true,
                banned: false
              },
              as: 'Invited'
            }
          ],
          where: {
            user_id: userID
          },
          order: [[ 'created_date', 'DESC' ]]
        })
        .then(function(invites) {
          if(invites){

            var cleanInvited = [];

            /* istanbul ignore next */
            for(var i = 0; i < invites.length; i++){
              var ui = invites[i];
              var u = ui.Invited;

              cleanInvited.push({
                id: ui.id,
                username: u.username,
                profile_name: u.profile_name,
                profile_photo: (u.profile_photo) ? u.profile_photo : 'https://secure.gravatar.com/avatar/' + md5(u.email) + '?r=g&s=200&d=identicon',
                joined_on: ui.created_date
              });
            }

            return cleanInvited;

          } else {
            return [];
          }
        });
    } else {
      return Promise.reject('Invalid Invitation Code');
    }
  },

  /**
   * Delete User Account
   * @param {object} account - User Account to be Deleted
   * @param {object} account.id - User ID of Account to be Deleted
   * @param {object} account.username - Username of Account to be Deleted
   * @returns {*}
   */
  deleteAccount: function(account){
    if (account && account.username && account.id) {
      return User.findOne({
          where: {
            id: account.id,
            username: account.username,
            activated: true,
            banned: false
          }
        })
        .then(function(deletedUser) {
          if (deletedUser) {

            deletedUser.set('username', '~' + deletedUser.username);
            deletedUser.set('email', '~' + deletedUser.email);
            deletedUser.set('password', 'deleted-account');
            deletedUser.set('password_oauth', null);
            deletedUser.set('new_password_key', null);
            deletedUser.set('new_password_requested', null);
            deletedUser.set('new_email', null);
            deletedUser.set('new_email_key', null);
            deletedUser.set('new_email_requested', null);
            deletedUser.set('activated', 0);

            deletedUser.save();

            return deletedUser.destroy().then(function(removed) {
              return removed;
            });

          } else {
            return Promise.reject('No user found for user ' + account.username);
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  },

  /**
   * Check if Email Address is in Use
   * @param {string} emailAddress - Email Address to check if it exists
   * @param {callback} callback - Requested Callback Handler
   * @returns {*}
   */
  emailAddressInUse: function(emailAddress, callback){
    if (emailAddress) {
      return User.findOne({
          where: {
            email: {
              $eq: emailAddress
            }
          }
        })
        .then(function(foundUser) {
          if(typeof callback === 'function'){
            return callback(foundUser !== null);
          } else {
            return Promise.reject('Request Invalid');
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  },

  /**
   * Follow User
   * @param {number} currentUserID - Current Logged In Users ID
   * @param {string} followUsername - Username of User to Follow
   * @returns {*}
   */
  followUser: function(currentUserID, followUsername){

    currentUserID = parseInt(currentUserID, 10);

    if (currentUserID && followUsername) {
      return User.findOne({
          where: {
            username: followUsername,
            activated: true,
            banned: false
          }
        })
        .then(function(followUser) {
          if (followUser) {

            var followUserId = parseInt(followUser.id, 10);

            if(followUserId === currentUserID){
              return Promise.reject('You Can\'t follow yourself.');
            }

            // Check if we previously followed this user
            return UserFollow.findOne({
              where: {
                user_id: currentUserID,
                follow_user_id: followUserId
              },
              paranoid: false
            }).then(function(existing) {

              if(existing){

                // This is a refollow, restore the connection
                existing.restore();
                return existing.dataValues;
              } else {

                // This is a new follow
                return UserFollow.create({
                  user_id: currentUserID,
                  follow_user_id: followUserId
                }).then(function(created) {
                  return created.dataValues;
                });
              }
            });

          } else {
            return Promise.reject('No user found for user ' + followUsername);
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  },

  /**
   * Get Followers of `username`
   * @param {string} username -
   * @returns {*}
   */
  getFollowers: function(username){
    if (username) {
      return User.findOne({
          where: {
            username: username,
            activated: true,
            banned: false
          }
        })
        .then(function(userData) {
          if(userData){
            return UserFollow.findAll({
              include: [
                {
                  model: User,
                  where: {
                    activated: true,
                    banned: false
                  },
                  as: 'Follower'
                },
                {
                  model: User,
                  where: {
                    activated: true,
                    banned: false
                  },
                  as: 'Following'
                }
              ],
              where: {
                follow_user_id: userData.id,
                user_id: {
                  $ne: userData.id
                }
              },
              order: [[ 'created_date', 'DESC' ]]
            }).then(function(followers){
              var cleanFollowers = [];

              /* istanbul ignore next */
              for(var i = 0; i < followers.length; i++){
                var f = followers[i];
                var u = f.Follower;

                cleanFollowers.push({
                  id: f.id,
                  username: u.username,
                  profile_name: u.profile_name,
                  profile_photo: (u.profile_photo) ? u.profile_photo : 'https://secure.gravatar.com/avatar/' + md5(u.email) + '?r=g&s=200&d=identicon',
                  followed_on: f.created_date
                });
              }

              return cleanFollowers;
            });
          } else {
            return [];
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  },

  /**
   * Get Users that are Following `username`
   * @param {string} username - Which Username to check
   * @returns {*}
   */
  getFollowing: function(username){
    if (username) {
      return User.findOne({
          where: {
            username: username,
            activated: true,
            banned: false
          }
        })
        .then(function(userData) {
          if(userData){
            return UserFollow.findAll({
              include: [
                {
                  model: User,
                  where: {
                    activated: true,
                    banned: false
                  },
                  as: 'Follower'
                },
                {
                  model: User,
                  where: {
                    activated: true,
                    banned: false
                  },
                  as: 'Following'
                }
              ],
              where: {
                user_id: userData.id,
                follow_user_id: {
                  $ne: userData.id
                }
              },
              order: [[ 'created_date', 'DESC' ]]
            }).then(function(following){
              var cleanFollowing = [];

              /* istanbul ignore next */
              for(var i = 0; i < following.length; i++){
                var f = following[i];
                var u = f.Following;

                cleanFollowing.push({
                  id: f.id,
                  username: u.username,
                  profile_name: u.profile_name,
                  profile_photo: (u.profile_photo) ? u.profile_photo : 'https://secure.gravatar.com/avatar/' + md5(u.email) + '?r=g&s=200&d=identicon',
                  followed_on: f.created_date
                });
              }

              return cleanFollowing;
            });
          } else {
            return [];
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  },

  /**
   * Unfollow User
   * @param {number} currentUserID - Current Logged In Users ID
   * @param {string} unfollowUsername - Which Username to check
   * @returns {*}
   */
  unfollowUser: function(currentUserID, unfollowUsername){
    currentUserID = parseInt(currentUserID, 10);

    if (currentUserID && unfollowUsername) {
      return User.findOne({
          where: {
            username: unfollowUsername,
            activated: true,
            banned: false
          }
        })
        .then(function(unfollowUser) {
          if (unfollowUser) {

            var unfollowUserId = parseInt(unfollowUser.id, 10);

            if(unfollowUserId === currentUserID){
              return Promise.reject('You Can\'t follow / unfollow yourself.');
            }

            return UserFollow.findOne({
              where: {
                user_id: currentUserID,
                follow_user_id: unfollowUserId
              }
            }).then(function(follow) {
              return follow.destroy();
            }).catch(function(){
              return Promise.reject('You are not following ' + unfollowUsername);
            });

          } else {
            return Promise.reject('No user found for user ' + unfollowUsername);
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  },

  /**
   * Update Users Data
   * @param {number} validUserId - Users ID
   * @param {object} newUserData - New Users Data
   * @param {string} ipAddress - IP Address of Request
   * @returns {*}
   */
  updateAccount: function(validUserId, newUserData, ipAddress){
    if (validUserId && newUserData) {
      return User.findOne({
          where: {
            id: validUserId,
            activated: true,
            banned: false
          }
        })
        .then(function(updateUser) {
          if(updateUser){

            var responseMessage = [];
            var usernameChecked = false;
            var emailChecked = false;
            var passwordChecked = false;

            /* istanbul ignore next */
            var sendEmails = function(){

              if(usernameChecked && emailChecked && passwordChecked){

                if(updateUser.save()){

                  routeUtil.getGeoLocation(ipAddress, function(geolocation){

                    // Send notification email if user changed username
                    if(newUserData.new_username){
                      email.sendChangedUsernameEmail(updateUser, geolocation, newUserData);
                    }

                    // Send confirmation email if user changed email
                    if(newUserData.new_email){
                      email.sendConfirmChangedEmailAddressEmail(updateUser, geolocation, newUserData);
                    }

                    // Send confirmation email if user changed password
                    if(newUserData.new_password){
                      email.sendConfirmChangedPasswordEmail(updateUser, geolocation, newUserData);
                    }

                  });

                  return {
                    title: 'Account Updated',
                    messages: responseMessage,
                    user: updateUser
                  };

                } else {
                  return Promise.reject('Error Saving User Account');
                }
              }
            };

            // Check if user changed username
            if(newUserData.new_username){
              updateUser.set('username', newUserData.new_username.toLowerCase());
              responseMessage.push('Your username has been updated to "' + newUserData.new_username + '". A confirmation of this change has been sent to your email address.');
              usernameChecked = true;
            } else {
              usernameChecked = true;
            }

            // Check if user changed email
            if(newUserData.new_email){
              updateUser.set('new_email', newUserData.new_email);
              updateUser.set('new_email_key', randomString.generate(12));
              updateUser.set('new_email_requested', Date.now());
              responseMessage.push('For your protection, we have sent you a confirmation email to confirm your change of Email Address.  If you are unable to access your current email address, please contact us.');
              emailChecked = true;
            } else {
              emailChecked = true;
            }

            // Check if user changed password
            if(newUserData.new_password){
              return hasher.generate(newUserData.new_password)
                .then(function(encodedPassword) {
                  updateUser.set('new_password', encodedPassword);
                  updateUser.set('new_password_key', randomString.generate(12));
                  updateUser.set('new_password_requested', Date.now());

                  responseMessage.push('For your protection, we have sent you a confirmation email to confirm your change of Password. ');
                  passwordChecked = true;

                  return sendEmails();
                });
            } else {
              passwordChecked = true;
              return sendEmails();
            }

          } else {
            return Promise.reject('No matching user found.');
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  },

  /**
   * Check if Username is in Use
   * @param {string} username - Username to check if it exists
   * @param {callback} callback - Requested Callback Handler
   * @returns {*}
   */
  usernameInUse: function(username, callback){
    if (username) {
      return User.findOne({
          where: {
            username: {
              $eq: username.toLowerCase()
            }
          }
        })
        .then(function(foundUser) {
          if(typeof callback === 'function'){
            return callback(foundUser !== null);
          } else {
            return Promise.reject('Invalid Request');
          }
        });
    } else {
      return Promise.reject('Username Check Request Invalid');
    }
  }
};
