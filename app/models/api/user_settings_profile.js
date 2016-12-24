/**
 * @module models/api/user_settings_profile
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var User = require('./users');

/**
 * User Setting Profile Schema
 * @type {object}
 * @property {number} id - Unique ID
 * @property {number} user_id - Unique User ID
 */
var UserSettingProfile = db.dbApi.define('user_settings_profile', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['user_id'],
      unique: true
    }
  ]
});

/**
 * Connect Settings to User
 */
UserSettingProfile.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

module.exports = UserSettingProfile;
