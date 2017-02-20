'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.ApiAuthentication.tableName,
      Models.API.ApiAuthentication.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.ApiAuthentication.tableName);
  }
};
