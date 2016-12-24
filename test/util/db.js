var sequelize = require('../../app/config/sequelize');
var models = require('../../app/models');

beforeEach(function(done) {
  sequelize
    .sync({force: true})
    .then(function() {
      done();
    });
});