var assert = require('chai').assert;
var analytics = require('../../app/analytics');

describe('Analytics', function() {

  it('should be defined', function() {
    assert.isDefined(analytics);
    assert.isFunction(analytics.trackEvent);
  });

  describe('Call Functions', function() {
    it('should return defined with strings', function() {
      assert.isDefined(analytics.trackEvent('abc123', 'category', 'action', 'label', 'value'));
    });

    it('should return defined with objects', function() {
      assert.isDefined(analytics.trackEvent('abc123', { category: 'abc' }, { action: 'abc' }, { label: 'abc' }, 'value'));
    });
  });
});
