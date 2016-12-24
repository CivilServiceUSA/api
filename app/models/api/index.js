/**
 * @module models/api
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

/**
 * API Models
 * @type {object}
 */
module.exports = {
  ApiAuthentication: require('./api_authentication'),
  Category: require('./categories'),
  Group: require('./groups'),
  SubscriptionPayment: require('./subscription_payments'),
  SubscriptionType: require('./subscription_types'),
  Subscription: require('./subscriptions'),
  Tag: require('./tags'),
  UserActivity: require('./user_activity'),
  UserFollow: require('./user_follows'),
  UserGroup: require('./user_group'),
  UserInvite: require('./user_invite'),
  UserLogin: require('./user_login'),
  UserSettingNotification: require('./user_settings_notifications'),
  UserSettingProfile: require('./user_settings_profile'),
  User: require('./users')
};
