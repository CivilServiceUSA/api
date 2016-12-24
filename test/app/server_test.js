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

  it('setup middelware should do something', function() {

    var app = {
      set: function() {}
    };

    var dataValues = {
      allow_api_get: true,
      allow_api_post: true,
      allow_api_put: true,
      allow_api_delete: true
    };

    var headers = {
      'API-Key': '36B40B43-0807-2DF4-5192-2E58DEE4500B'
    };

    var request = {
      header: function(header) {
        return (typeof headers[header] !== 'undefined') ? headers[header] : null
      },
      headers: {
        host: 'localhost'
      },
      query: {
        pretty: true
      }
    };

    var response = {
      setHeader: function(header, text) { headers[header] = text; return this; },
      status: function(code) { return this; },
      end: function(){ return this; }
    };

    var next = function() {};

    server.setupAPI(request, response, next);
  });
});
