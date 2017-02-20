'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.UserInvite.tableName,
      Models.API.UserInvite.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.UserInvite.tableName);
  }
};
