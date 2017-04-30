var assert = require('chai').assert;

var util = require('../../../../../app/api/v1/domain/util');

describe('Domain Util', function() {
  it('should be defined', function() {
    assert.isDefined(util);
  });

  describe('normalizeCommaSeparatedIntegers', function() {
    it('should exist', function () {
      assert.isFunction(util.normalizeCommaSeparatedIntegers);
    });

    it('should return an array of integers from a comma-separated string of numbers', function () {
      var str = '1,5,6';
      var expected = [1, 5, 6];
      assert.deepEqual(util.normalizeCommaSeparatedIntegers(str), expected);
    });

    it('should return null for invalid input', function() {
      var str = 'foo';
      var expected = null;
      assert.deepEqual(util.normalizeCommaSeparatedIntegers(str), expected);
    });

    it('should prune out invalid input', function() {
      var str = '1,foo,6';
      var expected = [1, 6];
      assert.deepEqual(util.normalizeCommaSeparatedIntegers(str), expected);
    });
  });

  describe('sortByKeys', function() {
    it('should exist', function () {
      assert.isFunction(util.sortByKeys);
    });

    it('should return an sorted keys', function () {
      var unsorted = {
        b: 1,
        a: 2,
        c: 3
      };
      var expected = {
        a: 2,
        b: 1,
        c: 3
      };

      assert.deepEqual(util.sortByKeys(unsorted), expected);
    });
  });
});