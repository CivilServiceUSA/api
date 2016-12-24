/**
 * @module models/api/user_group
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var Group = require('./groups');
var User = require('./users');

/**
 * User Group Schema
 * @type {object}
 * @property {number} id - Unique ID
 * @property {number} user_id - Unique User ID
 * @property {number} group_id - Unique Group ID
 */
var UserGroup = db.dbApi.define('user_group', {
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
  group_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['user_id', 'group_id'],
      unique: true
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['group_id']
    }
  ]
});

/**
 * Connect Activity to User
 */
UserGroup.belongsTo(Group, {
  foreignKey: 'group_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

/**
 * Connect User to Follower
 */
UserGroup.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

/**
 * Setup Relationships of Users and Groups
 */
User.hasMany(UserGroup, { foreignKey: 'user_id', allowNull: true });
Group.hasMany(UserGroup, { foreignKey: 'group_id', allowNull: true });

module.exports = UserGroup;
