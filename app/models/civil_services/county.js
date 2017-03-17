/**
 * @module models/civil_services/county
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

/**
 * County
 * @type {object}
 * @property {number} id - Unique ID
 * @property {string} fips - Federal Information Processing Standards Code
 * @property {string} state_name - State Name
 * @property {string} state_code - State Abbreviation
 * @property {string} name - County Name
 * @property {geometry} shape - GeoJSON Shape Data
 */
var County = db.dbApi.define('county', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  fips: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  state_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  state_code: {
    type: DataTypes.CHAR(2),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  shape: {
    type: DataTypes.GEOMETRY,
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['fips'],
      unique: true
    },
    {
      fields: ['state_code']
    },
    {
      fields: ['shape'],
      type: 'spatial'
    }
  ]
});

module.exports = County;
