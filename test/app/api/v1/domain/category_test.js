var assert = require('chai').assert;
var category = require('../../../../../app/api/v1/domain/category');

describe('Domain Category', function() {
  it('should be defined', function() {
    assert.isDefined(category);
  });

  it('prepareForAPIOutput should be defined', function() {
    assert.isDefined(category.prepareForAPIOutput);
  });

  it('prepareForAPIOutput should be defined', function() {
    assert.isDefined(category.prepareForElasticSearch);
  });

  it('prepareForAPIOutput should return correct data with subcategories', function() {
    var output = category.prepareForAPIOutput({
      _source: {
        id: 1,
        parent_id: null,
        name: 'Test',
        slug: 'test',
        created_at: '2016-10-10T22:47:38.000Z',
        modified_at: '2016-10-10T22:47:38.000Z',
        subcategories: [
          {
            id: 2,
            parent_id: 1,
            name: 'Sub Test 1',
            slug: 'sub-test-1',
            created_at: '2016-10-10T22:47:38.000Z',
            modified_at: '2016-10-10T22:47:38.000Z'
          },
          {
            id: 3,
            parent_id: 1,
            name: 'Sub Test 2',
            slug: 'sub-test-2',
            created_at: '2016-10-10T22:47:38.000Z',
            modified_at: '2016-10-10T22:47:38.000Z'
          }
        ]
      }
    });

    assert.isDefined(output.parent_id);
    assert.isDefined(output.name);
    assert.isDefined(output.slug);
    assert.isDefined(output.subcategories);

    assert.isTrue(output.parent_id === null);
    assert.isTrue(output.name === 'Test');
    assert.isTrue(output.slug === 'test');
    assert.isTrue(output.subcategories.length === 2);

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('prepareForAPIOutput should return correct data', function() {
    var output = category.prepareForAPIOutput({
      _source: {
        id: 1,
        parent_id: null,
        name: 'Test',
        slug: 'test',
        created_at: '2016-10-10T22:47:38.000Z',
        modified_at: '2016-10-10T22:47:38.000Z'
      }
    });

    assert.isDefined(output.parent_id);
    assert.isDefined(output.name);
    assert.isDefined(output.slug);

    assert.isTrue(output.parent_id === null);
    assert.isTrue(output.name === 'Test');
    assert.isTrue(output.slug === 'test');

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
    assert.isUndefined(output.subcategories);
  });

  it('prepareForElasticSearch should return correct data with subcategories', function() {
    var output = category.prepareForElasticSearch({
      id: 1,
      parent_id: null,
      name: 'Test',
      slug: 'test',
      created_at: '2016-10-10T22:47:38.000Z',
      modified_at: '2016-10-10T22:47:38.000Z',
      subcategories: [
        {
          id: 2,
          parent_id: 1,
          name: 'Sub Test 1',
          slug: 'sub-test-1',
          created_at: '2016-10-10T22:47:38.000Z',
          modified_at: '2016-10-10T22:47:38.000Z'
        },
        {
          id: 3,
          parent_id: 1,
          name: 'Sub Test 2',
          slug: 'sub-test-2',
          created_at: '2016-10-10T22:47:38.000Z',
          modified_at: '2016-10-10T22:47:38.000Z'
        }
      ]
    });

    assert.isDefined(output.id);
    assert.isDefined(output.parent_id);
    assert.isDefined(output.name);
    assert.isDefined(output.slug);
    assert.isDefined(output.subcategories);

    assert.isTrue(output.id === 1);
    assert.isTrue(output.parent_id === null);
    assert.isTrue(output.name === 'Test');
    assert.isTrue(output.slug === 'test');
    assert.isTrue(output.subcategories.length === 2);

    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('prepareForElasticSearch should return correct data', function() {
    var output = category.prepareForElasticSearch({
      id: 1,
      parent_id: null,
      name: 'Test',
      slug: 'test',
      created_at: '2016-10-10T22:47:38.000Z',
      modified_at: '2016-10-10T22:47:38.000Z',
      subcategories: []
    });

    assert.isDefined(output.id);
    assert.isDefined(output.parent_id);
    assert.isDefined(output.name);
    assert.isDefined(output.slug);
    assert.isDefined(output.subcategories);

    assert.isTrue(output.id === 1);
    assert.isTrue(output.parent_id === null);
    assert.isTrue(output.name === 'Test');
    assert.isTrue(output.slug === 'test');
    assert.isTrue(output.subcategories.length === 0);

    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });
});