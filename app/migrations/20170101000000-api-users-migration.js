'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.User.tableName,
      Models.API.User.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.User.tableName);
  }
};
