'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.Group.tableName,
      Models.API.Group.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.Group.tableName);
  }
};
