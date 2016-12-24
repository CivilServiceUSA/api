/**
 * @module models/api/categories
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var Slugify = require('sequelize-slugify');
var db = require('../../config/sequelize');

/**
 * Category Schema
 * @type {object}
 * @property {number} id - Unique ID
 * @property {number} parent_id - Unique ID of Parent Category
 * @property {string} name - Name of Category
 * @property {string} slug - Generated Slug ( this will be made automatically )
 */
var Category = db.dbApi.define('categories', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  parent_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true
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
      fields: ['parent_id', 'slug'],
      unique: true
    }
  ]
});

/**
 * Auto Generate Slug for Name
 */
Slugify.slugifyModel(Category, {
  source: ['name']
});

/**
 * Set Subcategory via `category.id` using `category.parent_id`
 */
Category.belongsTo(Category, {
  foreignKey: 'parent_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

/**
 * Belongs to `Category`
 */
Category.belongsTo(Category, { as: 'parent' });

/**
 * Setup Relationship of Category and Subcategories
 */
Category.hasMany(Category, {
  foreignKey: 'parent_id',
  as: 'subcategories'
});

module.exports = Category;
