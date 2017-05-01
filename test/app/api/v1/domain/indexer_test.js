var assert = require('chai').assert;
var sinon = require('sinon');

var IndexerDomain = require('../../../../../app/api/v1/domain/indexer');
var client = require('../../../../../app/elasticsearch/client');

describe('Domain Search', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be defined', function() {
    assert.isDefined(IndexerDomain);
  });

  it('fetch should be defined', function() {
    assert.isDefined(IndexerDomain.fetch);
  });

  describe('fetch should return correct data', function() {
    beforeEach(function () {
      this.elasticsearchStub = this.sandbox.stub(client, 'search');
    });

    afterEach(function () {
      client.search.restore();
    });

    it('should return results', function(done) {

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 1, hits: [] }
      }));

      IndexerDomain.fetch()
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });
  });
});