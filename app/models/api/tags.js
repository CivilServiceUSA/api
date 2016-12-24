/**
 * @module models/api/tags
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var Slugify = require('sequelize-slugify');
var db = require('../../config/sequelize');

/**
 * Tag Schema
 * @type {object}
 * @property {number} id - Unique ID
 * @property {string} name - Tag Name
 * @property {string} slug - Generated Slug ( this will be made automatically )
 */
var Tag = db.dbApi.define('tags', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['name', 'slug'],
      unique: true
    }
  ]
});

/**
 * Auto Generate Slug for Name
 */
Slugify.slugifyModel(Tag, {
  source: ['name']
});

module.exports = Tag;
