/**
 * @module models/civil_services/city_council
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

/**
 * Zip Codes
 * @type {object}
 * @property {number} id - Unique ID
 * @property {string} state - State City Council belongs to
 * @property {string} city - The City Name or City Council
 * @property {string} representative - Name of City Council Representative
 * @property {enum} title=council_member - Title of City Council Representative ['council_member','mayor','district_attorney']
 * @property {number} district_number - District Number
 * @property {enum} party=nonpartisan - Party of City Council Representative ['democrat','republican','nonpartisan']
 * @property {string} [email] - Email Address
 * @property {string} [phone] - Phone Number
 * @property {string} [twitter_url] - Twitter URL
 * @property {string} [facebook_url] - Facebook URL
 * @property {string} [photo_url] - Photo URL
 */
var CityCouncil = db.dbApi.define('city_council', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  state: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  representative: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  title: {
    type: DataTypes.ENUM('council_member','mayor','district_attorney'),
    allowNull: false,
    defaultValue: 'council_member'
  },
  district_number: {
    type: DataTypes.INTEGER(3),
    allowNull: true
  },
  party: {
    type: DataTypes.ENUM('democrat','republican','nonpartisan'),
    allowNull: false,
    defaultValue: 'nonpartisan'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  twitter_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  facebook_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  photo_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['state', 'city', 'district_number', 'title'],
      unique: true
    },
    {
      fields: ['title']
    },
    {
      fields: ['party']
    }
  ]
});

module.exports = CityCouncil;
