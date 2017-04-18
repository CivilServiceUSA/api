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
 * @property {string} primary_city - The Official City Name used for Zip Code
 * @property {string} [acceptable_cities] - Comma Separated list of other City Names Zip Code uses
 * @property {string} unacceptable_cities - Comma Separated list of Unacceptable City Names sometimes used for Zip Code
 * @property {string} state - State Zip Code belongs to
 * @property {string} [county] - County Zip Code belongs to
 * @property {string} [timezone] - Time Zone Zip Code belongs to
 * @property {string} [area_codes] - Comma Separated list of Area Codes in Zip Code
 * @property {float} latitude - GPS Latitude
 * @property {float} longitude - GPS Longitude
 * @property {number} estimated_population - Estimated Population
 * @property {geometry} shape - GeoJSON Shape Data
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
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    validate: { min: -90, max: 90 }
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    validate: { min: -180, max: 180 }
  },
  estimated_population: {
    type: DataTypes.INTEGER(10),
    allowNull: false
  },
  shape: {
    type: DataTypes.GEOMETRY,
    allowNull: false
  }
}, {
  validate: {
    bothCoordsOrNone: function() {
      if ((this.latitude === null) !== (this.longitude === null)) {
        throw new Error('Require either both latitude and longitude or neither');
      }
    }
  },
  indexes: [
    {
      fields: ['zipcode'],
      unique: true
    },
    {
      fields: ['shape'],
      type: 'spatial'
    },
    {
      fields: ['primary_city']
    },
    {
      fields: ['county']
    },
    {
      fields: ['timezone']
    },
    {
      fields: ['area_codes']
    }
  ]
});

module.exports = ZipCode;
