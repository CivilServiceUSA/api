/**
 * @module models/civil_services/bills
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

/**
 * Bills Schema
 * @type {object}
 * @property {number} id - Unique ID
 * @property {boolean} published - Whether this should be displayed in the API
 * @property {enum} status=considering - Status of Bill ['considering','passed','failed']
 * @property {enum} [progress] - Whether this bill passing is Good or Bad ['good','bad']
 * @property {enum} [chamber] - Which Chamber of Congress this bill is for ['upper','lower']
 * @property {string} state - Two Letter US State Code Abbreviation ( ISO 3166 )
 * @property {string} [city] - Specific City this Bill Belongs to
 * @property {string} bill_id - Unique Bill ID from Open States
 * @property {string} [session_id] - Unique Session ID from Open States
 * @property {string} short_description - Short Description of what this bill is for
 * @property {string} [long_description] - Long Description of what this bill is for
 * @property {string} [notes] - Internal Notes about Bill
 * @property {string} details_url - Absolute URL where more details of this bill can be found
 */
var Bills = db.dbApi.define('bills', {
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
  status: {
    type: DataTypes.ENUM('considering','passed','failed'),
    allowNull: false,
    defaultValue: 'considering'
  },
  progress: {
    type: DataTypes.ENUM('good','bad'),
    allowNull: true
  },
  chamber: {
    type: DataTypes.ENUM('upper','lower'),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  bill_id: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  session_id: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  short_description: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  long_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  details_url: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['bill_id', 'session_id', 'chamber', 'state'],
      unique: true
    }
  ]
});

module.exports = Bills;
