'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.UserSettingProfile.tableName,
      Models.API.UserSettingProfile.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.UserSettingProfile.tableName);
  }
};
