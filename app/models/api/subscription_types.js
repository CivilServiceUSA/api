/**
 * @module models/api/subscription_types
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

/**
 * Subscription Type Schema
 * @type {object}
 * @property {number} id - Unique ID
 * @property {enum} status=disabled - Status or Subscription ['enabled','disabled']
 * @property {string} name - Name of the Subscription
 * @property {string} description - Description of the Subscription
 * @property {float} monthly_rate - Monthly Rate of the Subscription
 * @property {float} annual_rate - Annual Rate of the Subscription
 */
var SubscriptionType = db.dbApi.define('subscription_types', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM('enabled','disabled'),
    allowNull: false,
    defaultValue: 'disabled'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  monthly_rate: {
    type: DataTypes.DECIMAL(8, 2).UNSIGNED,
    allowNull: false
  },
  annual_rate: {
    type: DataTypes.DECIMAL(8, 2).UNSIGNED,
    allowNull: false
  }
}, {
  indexes: [
    {
      fields: ['name'],
      unique: true
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = SubscriptionType;
