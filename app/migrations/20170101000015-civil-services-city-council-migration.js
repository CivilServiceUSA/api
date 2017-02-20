'use strict';

var Models = require('../models/index.js');

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Models.CivilService.CityCouncil.tableName,
      Models.CivilService.CityCouncil.attributes);
  },

  down: function (queryInterface) {
    return queryInterface.dropTable(Models.CivilService.CityCouncil.tableName);
  }
};
