/**
 * @module models/api/user_settings_notifications
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var User = require('./users');

/**
 * User Setting Notification Schema
 * @type {object}
 * @property {number} id - Unique ID
 * @property {number} user_id - Unique User ID
 * @property {boolean} [email_comment_left=true] - Notification Setting for Email Comment Left
 * @property {boolean} [email_comment_liked=true] - Notification Setting for Email Comment Liked
 * @property {boolean} [email_someone_follows=true] - Notification Setting for Email Someone Follows
 * @property {boolean} [email_mentioned_in_comment=true] - Notification Setting for Email Mentioned in Comment
 * @property {boolean} [web_comment_left=true] - Notification Setting for Web Comment Left
 * @property {boolean} [web_comment_liked=true] - Notification Setting for Web Comment Liked
 * @property {boolean} [web_someone_follows=true] - Notification Setting for Web Someone Follows
 * @property {boolean} [web_mentioned_in_comment=true] - Notification Setting for Web Mentioned in Comment
 * @property {boolean} [newsletter=true] - Whether User is Subscribed to Newsletter
 */
var UserSettingNotification = db.dbApi.define('user_settings_notifications', {
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
  email_comment_left: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  email_comment_liked: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  email_someone_follows: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  email_mentioned_in_comment: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  web_comment_left: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  web_comment_liked: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  web_someone_follows: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  web_mentioned_in_comment: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  newsletter: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}, {
  indexes: [
    {
      fields: ['user_id'],
      unique: true
    },
    {
      fields: ['email_comment_left']
    },
    {
      fields: ['email_comment_liked']
    },
    {
      fields: ['email_someone_follows']
    },
    {
      fields: ['email_mentioned_in_comment']
    },
    {
      fields: ['web_comment_left']
    },
    {
      fields: ['web_comment_liked']
    },
    {
      fields: ['web_someone_follows']
    },
    {
      fields: ['web_mentioned_in_comment']
    },
    {
      fields: ['newsletter']
    }
  ]
});

/**
 * Connect Notification Settings to User
 */
UserSettingNotification.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

module.exports = UserSettingNotification;
