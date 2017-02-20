'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.UserFollow.tableName,
      Models.API.UserFollow.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.UserFollow.tableName);
  }
};
