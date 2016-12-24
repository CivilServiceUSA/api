var assert = require('chai').assert;
var tag = require('../../../../../app/api/v1/domain/tag');

describe('Domain Tag', function() {
  it('should be defined', function() {
    assert.isDefined(tag);
  });

  it('prepareForAPIOutput should be defined', function() {
    assert.isDefined(tag.prepareForAPIOutput);
  });

  it('prepareForAPIOutput should be defined', function() {
    assert.isDefined(tag.prepareForElasticSearch);
  });

  it('prepareForAPIOutput should return correct data with subcategories', function() {
    var output = tag.prepareForAPIOutput({
      _source: {
        id: 1,
        name: 'Test',
        slug: 'test',
        created_at: '2016-10-10T22:47:38.000Z',
        modified_at: '2016-10-10T22:47:38.000Z'
      }
    });

    assert.isDefined(output.name);
    assert.isDefined(output.slug);

    assert.isTrue(output.name === 'Test');
    assert.isTrue(output.slug === 'test');

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('prepareForElasticSearch should return correct data with subcategories', function() {
    var output = tag.prepareForElasticSearch({
      id: 1,
      name: 'Test',
      slug: 'test',
      created_at: '2016-10-10T22:47:38.000Z',
      modified_at: '2016-10-10T22:47:38.000Z'
    });

    assert.isDefined(output.id);
    assert.isDefined(output.name);
    assert.isDefined(output.slug);

    assert.isTrue(output.id === 1);
    assert.isTrue(output.name === 'Test');
    assert.isTrue(output.slug === 'test');

    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('prepareForElasticSearch should return correct data', function() {
    var output = tag.prepareForElasticSearch({
      id: 1,
      name: 'Test',
      slug: 'test',
      created_at: '2016-10-10T22:47:38.000Z',
      modified_at: '2016-10-10T22:47:38.000Z'
    });

    assert.isDefined(output.id);
    assert.isDefined(output.name);
    assert.isDefined(output.slug);

    assert.isTrue(output.id === 1);
    assert.isTrue(output.name === 'Test');
    assert.isTrue(output.slug === 'test');

    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });
});