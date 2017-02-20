'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.CivilService.ZipCode.tableName,
      Models.CivilService.ZipCode.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.CivilService.ZipCode.tableName);
  }
};
