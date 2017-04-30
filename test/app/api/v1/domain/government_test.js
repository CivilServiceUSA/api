var assert = require('chai').assert;
var sinon = require('sinon');

var government = require('../../../../../app/api/v1/domain/government');
var client = require('../../../../../app/elasticsearch/client');
var ZipCode = require('../../../../../app/models/civil_services/zipcode');

describe('Domain Government', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be defined', function() {
    assert.isDefined(government);
  });

  it('search should be defined', function() {
    assert.isDefined(government.search);
  });

  describe('search should return correct data', function() {
    beforeEach(function () {
      this.elasticsearchStub = this.sandbox.stub(client, 'search');
      this.zipCodeStub = this.sandbox.stub(ZipCode, 'findOne');
    });

    afterEach(function () {
      client.search.restore();
    });

    var searchQuery = {
      latitude: 34.16,
      longitude: -118.37
    };

    it('should fail without params', function(done) {

      this.elasticsearchStub.returns(Promise.reject('Fake Error'));

      government.search({})
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });

    it('should return results with search params', function(done) {

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 1, hits: [] }
      }));

      government.search(searchQuery)
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });
  });
});