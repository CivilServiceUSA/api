/**
 * @module models/api/subscriptions
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var SubscriptionType = require('./subscription_types');
var User = require('./users');

/**
 * Subscription Schema
 * @type {object}
 * @property {number} id - Unique ID
 * @property {number} subscription_type_id - Unique ID of Subscription Type
 * @property {number} user_id - Unique ID of User
 * @property {string} stripe_customer_id - ID Issued by Stripe
 * @property {string} stripe_payment_source_id - Stripe Payment Source ID
 * @property {enum} type=monthly - Type of Subscription ['monthly','annual']
 * @property {enum} status=active - Status of Subscription ['active','cancelled','suspended']
 * @property {timestamp} suspended_date - Date Subscription was Suspended
 * @property {number} [suspended_reason] - Reason Subscription was Suspended
 * @property {timestamp} valid_until - Subsciption Paid Up Until
 * @property {timestamp} last_payment - When Last Payment was Received
 * @property {boolean} auto_renew=true - Whether or not Auto Renew should be enabled
 */

var Subscription = db.dbApi.define('subscriptions', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  subscription_type_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  },
  stripe_customer_id: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  stripe_payment_source_id: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('monthly','annual'),
    allowNull: false,
    defaultValue: 'monthly'
  },
  status: {
    type: DataTypes.ENUM('active','cancelled','suspended'),
    allowNull: false,
    defaultValue: 'active'
  },
  suspended_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  suspended_reason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: false
  },
  last_payment: {
    type: DataTypes.DATE,
    allowNull: false
  },
  auto_renew: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}, {
  indexes: [
    {
      fields: ['user_id'],
      unique: true
    },
    {
      fields: ['stripe_customer_id'],
      unique: true
    },
    {
      fields: ['stripe_payment_source_id'],
      unique: true
    },
    {
      fields: ['type']
    },
    {
      fields: ['auto_renew']
    },
    {
      fields: ['subscription_type_id']
    },
    {
      fields: ['status']
    }
  ]
});

Subscription.belongsTo(SubscriptionType, {
  foreignKey: 'subscription_type_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

Subscription.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

module.exports = Subscription;
