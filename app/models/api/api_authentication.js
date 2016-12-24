/**
 * @module models/api/api_authentication
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var User = require('./users');

/**
 * Api Authentication Schema
 * @type {object}
 * @property {number} id - Unique ID
 * @property {number} user_id - Unique User ID
 * @property {string} approved_whitelist=localhost - Comma Serpated list of Domains
 * @property {string} api_key - GUID based API Key
 * @property {string} api_secret - GUID based API Security Key
 * @property {boolean} allow_api_get=true - Whether to Allow API Key User access to HTTP GET Method
 * @property {boolean} allow_api_post=false - Whether to Allow API Key User access to HTTP POST Method
 * @property {boolean} allow_api_put=false - Whether to Allow API Key User access to HTTP PUT Method
 * @property {boolean} allow_api_delete=false - Whether to Allow API Key User access to HTTP DELETE Method
 * @property {boolean} allow_content_management=false - Whether to Allow API Key User to Managing Content ( possibly helpful for CMS related API's )
 * @property {boolean} allow_user_registration=false -  Whether to Allow API Key User to Create Users
 * @property {string} app_name - Marketing Name of App using for our API
 * @property {enum} app_type=developer - Type of Application using the API ['web_app','mobile_app','os_app','tv_app','custom_app','developer']
 * @property {string} [app_purpose] - Developer's Purpose of App using for our API
 * @property {string} [app_description] - Marketing Description of App using for our API
 * @property {number} daily_limit=2500 - Maximum Number of API calls in 24 hours ( 0 = unlimited )
 * @property {enum} status=pending_approval - Approval Status of API Key ['pending_approval','approved','rejected','developer_terminated','deleted']
 * @property {timestamp} expire_date - When the API Key will Expire
 */
var ApiAuthentication = db.dbApi.define('api_authentication', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true
  },
  approved_whitelist: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'localhost'
  },
  api_key: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  api_secret: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  allow_api_get: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  allow_api_post: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  allow_api_put: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  allow_api_delete: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  allow_content_management: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  allow_user_registration: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  app_name: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  app_type: {
    type: DataTypes.ENUM('web_app','mobile_app','os_app','tv_app','custom_app','developer'),
    allowNull: false,
    defaultValue: 'developer'
  },
  app_purpose: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  app_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  daily_limit: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    defaultValue: 2500
  },
  status: {
    type: DataTypes.ENUM('pending_approval','approved','rejected','developer_terminated','deleted'),
    allowNull: false,
    defaultValue: 'pending_approval'
  },
  expire_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['api_key'],
      unique: true
    },
    {
      fields: ['allow_api_get']
    },
    {
      fields: ['allow_api_post']
    },
    {
      fields: ['allow_api_put']
    },
    {
      fields: ['allow_api_delete']
    },
    {
      fields: ['allow_content_management']
    },
    {
      fields: ['allow_user_registration']
    },
    {
      fields: ['status']
    },
    {
      fields: ['app_type']
    },
    {
      fields: ['user_id']
    }
  ]
});

ApiAuthentication.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

module.exports = ApiAuthentication;
