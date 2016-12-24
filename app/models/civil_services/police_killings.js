/**
 * @module models/civil_services/police_killings
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

/**
 * Police Killings Schema
 * @type {object}
 * @property {number} id - Unique ID
 * @property {boolean} published - Whether this should be displayed in the API
 * @property {string} state - Two Letter US State Code Abbreviation ( ISO 3166 )
 * @property {string} [city] - Specific City this Bill Belongs to
 * @property {number} killings - Number of Police Killings in tis location
 */
var PoliceKillings = db.dbApi.define('police_killings', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  published: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  state: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  killings: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['state', 'city'],
      unique: true
    }
  ]
});

module.exports = PoliceKillings;
