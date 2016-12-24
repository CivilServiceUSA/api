var assert = require('chai').assert;
var hasher = require('../../../app/util/hasher');

describe('Hasher Tests', function() {
  describe('generate', function() {
    it('should generate an encrypted string', function(done) {
      var plainString = 'a string';

      hasher
        .generate(plainString)
        .then(function(encrypted) {
          assert.isString(encrypted);
          assert.notEqual(plainString, encrypted);
          done();
        });
    });
  });

  describe('verify', function() {
    it('should validate an unencrypted string with its encrypted counterpart', function(done) {
      var plainString = 'mypass';

      hasher
        .generate(plainString)
        .then(function(encrypted) {
          hasher
            .verify(plainString, encrypted)
            .then(function(valid) {
              assert.isTrue(valid);
              done();
            });
        });
    });

    it('should yield false for a mismatched string', function(done) {
      var plainString = 'mypass';

      hasher
        .generate(plainString)
        .then(function(encrypted) {
          hasher
            .verify('some random string', encrypted)
            .then(function(valid) {
              assert.isFalse(valid);
              done();
            });
        });
    });
  });
});
