'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.UserActivity.tableName,
      Models.API.UserActivity.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.UserActivity.tableName);
  }
};
