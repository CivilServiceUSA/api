'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.API.Tag.tableName,
      Models.API.Tag.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.API.Tag.tableName);
  }
};
