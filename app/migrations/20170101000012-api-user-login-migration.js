'use strict';

var Model = require('../models').API.UserLogin;

module.exports = {
  up: function (queryInterface) {
    return queryInterface.createTable(Model.tableName,
      Model.attributes).then(function() {
        for (var i = 0; i < Model.options.indexes.length; i++) {
          queryInterface.addIndex(Model.tableName, Model.options.indexes[i]);
        }
      }
    );
  },
  down: function (queryInterface) {
    return queryInterface.dropTable(Model.tableName);
  }
};
