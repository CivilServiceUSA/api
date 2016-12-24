/**
 * @module models/api/users
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var DataTypes = require('sequelize');
var db = require('../../config/sequelize');
var config = require('../../config');
var Hashids = require('hashids');
var hashID = new Hashids(config.get('hashID.secret'), config.get('hashID.length'), config.get('hashID.alphabet'));

/**
 * User Sequelize Model
 * @type {object}
 * @property {number} id - Unique ID
 * @property {boolean} activated=false - Whether Account is Activated
 * @property {string} username - Unique Username
 * @property {string} password - Hash Encoded Password
 * @property {string} email - Unique Email Address
 * @property {string} [first_name] - Users First Name
 * @property {string} [last_name] - Users Last Name
 * @property {string} [company_name] - Company Name
 * @property {string} [profile_name] - Profile Name of User
 * @property {string} [profile_photo] - Absolute URL of Profile Photo
 * @property {string} [location] - Users Provided Location
 * @property {string} [profile_link_website] - Profile Link Website
 * @property {string} [profile_link_twitter] - Profile Link Twitter
 * @property {string} [profile_link_1] - Misc Profile Link #1
 * @property {string} [profile_link_2] - Misc Profile Link #2
 * @property {string} [profile_link_3] - Misc Profile Link #3
 * @property {string} bio - User's Bio
 * @property {boolean} banned=false - Whether the Account is Banned
 * @property {string} [banned_reason] - Reason the Account was Banned
 * @property {string} [new_password] - Store New Password while Password Change is in Progress
 * @property {string} [new_password_key] - Confirmation Link for User to Confirm Password Change
 * @property {timestamp} [new_password_requested=NOW] - Date & Time Password Change was Requested
 * @property {string} [new_email] - Store New Email while Email Change is in Progress
 * @property {string} [new_email_key] - Confirmation Link for User to Confirm Email Change
 * @property {timestamp} [new_email_requested=NOW] - Date & Time Email Change was Requested
 */
var User = db.dbApi.define('users', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  activated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  company_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_photo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  profile_link_website: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_link_twitter: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_link_1: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_link_2: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_link_3: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  bio: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  banned: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  banned_reason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  new_password: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  new_password_key: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  new_password_requested: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.fn('NOW')
  },
  new_email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  new_email_key: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  new_email_requested: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.fn('NOW')
  }
}, {
  indexes: [
    {
      fields: ['username'],
      unique: true
    },
    {
      fields: ['email'],
      unique: true
    },
    {
      fields: ['new_email'],
      unique: true
    },
    {
      fields: ['new_password_key'],
      unique: true
    },
    {
      fields: ['new_email_key'],
      unique: true
    },
    {
      fields: ['activated']
    },
    {
      fields: ['banned']
    }
  ],
  instanceMethods: {

    /**
     * Filter User to remove Private Info for Public Consumption
     * @memberof module:models/api/users
     * @returns {object}
     */
    publicJSON: function() {
      var exclude = [
        'new_email',
        'new_email_key',
        'new_email_requested',
        'new_password',
        'new_password_requested',
        'password'
      ];

      var data = this.toJSON();

      data.hash_id = hashID.encode(data.id);

      _.each(exclude, function(key) {
        delete data[key];
      });

      return data;
    },

    /**
     * Return whether or not the user account is active
     * @memberof module:models/api/users
     * @returns {boolean}
     */
    isActive: function() {
      return this.get('banned') === false && this.get('activated') === true;
    },

    /**
     * Return the Fill Name of the User
     * @memberof module:models/api/users
     * @returns {string}
     */
    fullName: function() {
      if (this.get('first_name') && this.get('last_name')) {
        return this.get('first_name') + ' ' + this.get('last_name');
      }
      return '';
    }
  }
});

module.exports = User;
