'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.Category.tableName,
      Models.API.Category.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.Category.tableName);
  }
};
