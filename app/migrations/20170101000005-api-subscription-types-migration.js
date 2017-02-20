'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.SubscriptionType.tableName,
      Models.API.SubscriptionType.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.SubscriptionType.tableName);
  }
};
