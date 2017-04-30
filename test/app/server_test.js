var assert = require('chai').assert;
var sinon = require('sinon');

describe('API Server', function() {
  var server;

  beforeEach(function() {
    server = require('../../app/server');
  });

  afterEach(function() {
    server.close();
  });

  it('should be defined', function() {
    assert.isDefined(server);
  });

  it('setup middelware should be defined', function() {
    assert.isDefined(server.setupAPI);
    assert.isFunction(server.setupAPI);
  });
});
