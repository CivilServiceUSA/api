var assert = require('chai').assert;
var sinon = require('sinon');

var county = require('../../../../../app/api/v1/domain/county');
var client = require('../../../../../app/elasticsearch/client');

var sample_result = {
  id: 1,
  fips: 'abc123',
  state_name: 'Florida',
  state_code: 'FL',
  name: 'County Name',
  created_at: '2016-10-10T22:47:38.000Z',
  modified_at: '2016-10-10T22:47:38.000Z'
};

describe('Domain County', function() {
  it('should be defined', function() {
    assert.isDefined(county);
  });

  it('prepareForAPIOutput should be defined', function() {
    assert.isDefined(county.prepareForAPIOutput);
  });

  it('prepareForElasticSearch should be defined', function() {
    assert.isDefined(county.prepareForElasticSearch);
  });

  it('prepareForAPIOutput should return correct data', function() {
    var output = county.prepareForAPIOutput({
      _source: sample_result
    });

    assert.isDefined(output.fips);
    assert.isDefined(output.state_name);
    assert.isDefined(output.state_code);
    assert.isDefined(output.name);

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('prepareForElasticSearch should return correct data', function() {
    var output = county.prepareForElasticSearch(sample_result);

    assert.isDefined(output.fips);
    assert.isDefined(output.state_name);
    assert.isDefined(output.state_code);
    assert.isDefined(output.name);

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });
});