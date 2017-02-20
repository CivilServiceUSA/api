'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.UserGroup.tableName,
      Models.API.UserGroup.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.UserGroup.tableName);
  }
};
