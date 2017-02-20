'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.UserSettingNotification.tableName,
      Models.API.UserSettingNotification.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.UserSettingNotification.tableName);
  }
};
