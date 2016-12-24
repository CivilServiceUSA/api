var assert = require('chai').assert;
var sinon = require('sinon');

var User = require('../../../../../app/models/api/users');
var search = require('../../../../../app/api/v1/domain/search');

describe('Domain Search', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be defined', function() {
    assert.isDefined(search);
  });

  it('users should be defined', function() {
    assert.isDefined(search.users);
  });

  describe('users', function() {
    beforeEach(function() {
      this.searchStub = this.sandbox.stub(User, 'findAll');
    });

    it('should return users', function(done) {
      var fakeSearch = {
        query: 'jane'
      };

      var fakeResults = [];

      this.searchStub.returns(Promise.resolve(fakeResults));

      search.users(fakeSearch)
        .then(function(response) {
          assert.isDefined(response);
          done();
        });
    });

    it('should not return users', function(done) {
      var fakeSearch = {
        query: 'jane'
      };

      this.searchStub.returns(Promise.resolve(null));

      search.users(fakeSearch)
        .then(function(response) {
          assert.isDefined(response);
          done();
        });
    });

    it('should throw error', function(done) {
      this.searchStub.returns(Promise.reject('Request Invalid'));

      search.users()
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });
  });
});