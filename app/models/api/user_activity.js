/**
 * @module models/api/user_activity
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var User = require('./users');

/**
 * User Activity Schema
 * @type {object}
 * @property {number} id - Unique ID
 * @property {number} user_id - Unique User ID
 * @property {number} [follow_user_id] - Unique User ID of User that is being Followed
 * @property {enum} type=login - Type of Activity ['changed_email', 'changed_password', 'changed_username', 'closed_account', 'comment_liked', 'created_account', 'downgraded_account', 'followed_user', 'left_comment', 'liked_comment', 'login', 'logout', 'received_comment', 'reset_password', 'upgraded_account', 'user_followed']
 */
var UserActivity = db.dbApi.define('user_activity', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  },
  follow_user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM(
      'changed_email',
      'changed_password',
      'changed_username',
      'closed_account',
      'comment_liked',
      'created_account',
      'downgraded_account',
      'followed_user',
      'left_comment',
      'liked_comment',
      'login',
      'logout',
      'received_comment',
      'reset_password',
      'upgraded_account',
      'user_followed'
    ),
    allowNull: false,
    defaultValue: 'login'
  }
}, {
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['type']
    }
  ]
});

/**
 * Connect Activity to User
 */
UserActivity.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true,
  as: 'User',
  allowNull: false
});

/**
 * Connect User to Follower
 */
UserActivity.belongsTo(User, {
  foreignKey: 'follow_user_id',
  targetKey: 'id',
  foreignKeyConstraint: true,
  as: 'Following',
  allowNull: true
});

/**
 * Setup Relationships of Users and Followers
 */
User.hasMany(UserActivity, { foreignKey: 'user_id', allowNull: true });
User.hasMany(UserActivity, { foreignKey: 'follow_user_id', allowNull: true });

module.exports = UserActivity;
