/**
 * @module models/civil_services/zipcode
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

/**
 * Zip Codes
 * @type {object}
 * @property {number} id - Unique ID
 * @property {string} zipcode - Unique Zip Code
 * @property {enum} type=STANDARD - Type of Zip Code ['UNIQUE','PO BOX','STANDARD','MILITARY']
 * @property {boolean} [decommissioned=false] - Whether Zip Code was Decommissioned
 * @property {string} primary_city - The Official City Name used for Zip Code
 * @property {string} [acceptable_cities] - Comma Separated list of other City Names Zip Code uses
 * @property {string} unacceptable_cities - Comma Separated list of Unacceptable City Names sometimes used for Zip Code
 * @property {string} state - State Zip Code belongs to
 * @property {string} [county] - County Zip Code belongs to
 * @property {string} [timezone] - Time Zone Zip Code belongs to
 * @property {string} [area_codes] - Comma Separated list of Area Codes in Zip Code
 * @property {string} world_region - Region Zip Code belongs to
 * @property {string} country - Country Zip Code belongs to
 * @property {float} latitude - GPS Latitude
 * @property {float} longitude - GPS Longitude
 * @property {number} estimated_population - Estimated Population
 */
var ZipCode = db.dbApi.define('zipcode', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  zipcode: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('UNIQUE','PO BOX','STANDARD','MILITARY'),
    allowNull: false,
    defaultValue: 'STANDARD'
  },
  decommissioned: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  primary_city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  acceptable_cities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  unacceptable_cities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  county: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  timezone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  area_codes: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  world_region: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT(14),
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT(14),
    allowNull: false
  },
  estimated_population: {
    type: DataTypes.INTEGER(10),
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['zipcode'],
      unique: true
    }
  ]
});

module.exports = ZipCode;
