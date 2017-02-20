'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.SubscriptionPayment.tableName,
      Models.API.SubscriptionPayment.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.SubscriptionPayment.tableName);
  }
};
