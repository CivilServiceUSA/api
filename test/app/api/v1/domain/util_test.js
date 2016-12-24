var assert = require('chai').assert;
var sinon = require('sinon');
var http = require('http');
var mockReq = require('mock-req');
var mockRes = require('mock-res');

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
});