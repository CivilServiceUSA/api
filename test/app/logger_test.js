var assert = require('chai').assert;
var logger = require('../../app/logger');

describe('Logger', function() {
  it('should be defined', function() {
    assert.isDefined(logger);
    assert.isFunction(logger.debug);
    assert.isFunction(logger.error);
    assert.isFunction(logger.info);
    assert.isFunction(logger.log);
    assert.isFunction(logger.warn);
  });

  describe('Call Functions', function() {
    it('should return true', function() {
      assert.isTrue(logger.debug());
      assert.isTrue(logger.error());
      assert.isTrue(logger.info());
      assert.isTrue(logger.log());
      assert.isTrue(logger.warn());
    });
  });
});
