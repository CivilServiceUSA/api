/**
 * @module models/api/user_login
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var User = require('./users');

/**
 * User Login Schema
 * @type {object}
 * @property {number} id - Unique ID
 * @property {number} user_id - Unique User ID
 * @property {string} user_agent - Browser's User Agent
 * @property {string} [ip_address] - IP Address
 * @property {string} [country] - Geolocation Country
 * @property {string} [city] - Geolocation City
 * @property {string} [state] - Geolocation State
 * @property {string} [postal_code] - Geolocation Postal Code
 * @property {float} [latitude] - Geolocation Latitude
 * @property {float} [longitude] - Geolocation Longitude
 */
var UserLogin = db.dbApi.define('user_login', {
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
  user_agent: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ip_address: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  country: {
    type: 'CHAR(2)',
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  postal_code: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['country']
    }
  ]
});

/**
 * Connect Login to User
 */
UserLogin.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

/**
 * Setup Relationships of Users and Followers
 */
User.hasMany(UserLogin, { foreignKey: 'user_id', allowNull: true });

module.exports = UserLogin;
