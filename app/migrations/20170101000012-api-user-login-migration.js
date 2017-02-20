'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.UserLogin.tableName,
      Models.API.UserLogin.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.UserLogin.tableName);
  }
};
