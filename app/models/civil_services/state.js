/**
 * @module models/civil_services/state
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

/**
 * State in United States
 * @type {object}
 * @property {number} id - Unique ID
 * @property {string} state_name - Name of State
 * @property {string} state_name_slug - Name of State converted to lowercase letters and spaces replaced with dashes
 * @property {string} state_code - Two Letter State Abbreviation
 * @property {string} state_code_slug - Two Letter State Abbreviation in lowercase letters
 * @property {string} nickname - Official State Nickname
 * @property {string} website - Official URL of States Government Website
 * @property {date} admission_date - Date State was Admitted into the United States
 * @property {number} admission_number - What number the US State Joined the United States
 * @property {string} capital_city - Name of States Capital
 * @property {string} capital_url - URL of States Capital
 * @property {number} population - US Census Population of State
 * @property {number} population_rank - Rank of States Population against other States
 * @property {string} constitution_url - URL of State Constitution
 * @property {string} state_flag_url - URL of State Flag
 * @property {string} state_seal_url - URL of State Seal
 * @property {string} map_image_url - URL of US Map with Highlighted State
 * @property {string} landscape_background_url - Background Image URL showing Popular Landscape of State
 * @property {string} skyline_background_url - Background Image URL showing Popular Skyline of State
 * @property {string} [twitter_handle] - Official State Twitter Handle
 * @property {string} [twitter_url] - Official State Twitter URL
 * @property {string} [facebook_url] - Official State Facebook URL
 * @property {geometry} shape - GeoJSON Shape Data
 */
var State = db.dbApi.define('state', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  state_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  state_name_slug: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  state_code: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  state_code_slug: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  website: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  admission_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  admission_number: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  },
  capital_city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  capital_url: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  population: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  },
  population_rank: {
    type: DataTypes.INTEGER(2).UNSIGNED,
    allowNull: false
  },
  constitution_url: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  state_flag_url: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  state_seal_url: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  map_image_url: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  landscape_background_url: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  skyline_background_url: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  twitter_handle: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  twitter_url: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  facebook_url: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  shape: {
    type: DataTypes.GEOMETRY,
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['state_name'],
      unique: true
    },
    {
      fields: ['shape'],
      type: 'spatial'
    }
  ]
});

module.exports = State;
