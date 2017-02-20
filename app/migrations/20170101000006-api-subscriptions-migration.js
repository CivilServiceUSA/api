'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.Subscription.tableName,
      Models.API.Subscription.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.Subscription.tableName);
  }
};
