/**
 * @module models/civil_services/shape_zipcode
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

/**
 * Shape Zip Codes
 * @type {object}
 * @property {number} id - Unique ID
 * @property {string} zipcode - Unique Zip Code
 * @property {geometry} shape - GeoJSON Shape Data
 */
var ShapeZipCode = db.dbApi.define('shape_zipcode', {
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
  shape: {
    type: DataTypes.GEOMETRY,
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['zipcode'],
      unique: true
    },
    {
      fields: ['shape'],
      type: 'spatial'
    }
  ]
});

module.exports = ShapeZipCode;
