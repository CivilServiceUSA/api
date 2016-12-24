var assert = require('chai').assert;
var validate = require('validate.js');
var BaseForm = require('../../../app/forms/base');

describe('BaseForm', function() {
  describe('validate', function() {
    it('should run validation using object "constraints" property', function(done) {
      var TestForm = BaseForm.extend({
        constraints: {
          username: {
            presence: true
          }
        }
      });

      var form = new TestForm();

      form
        .validate({})
        .then(function() {
          done(new Error('Form validated when it should not have'));
        })
        .catch(function(errors) {
          assert.isTrue('username' in errors);
          assert.equal(errors.username.length, 1);
          done();
        });
    });

    it('should validate async constraints', function(done) {
      validate.validators.fakeAsyncValidator = function(value, attributes, attr, options, constraints) {
        return new validate.Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve('Error!');
          }, 10);
        });
      };

      var TestForm = BaseForm.extend({
        constraints: {
          username: {
            presence: true
          },
          anotherField: {
            fakeAsyncValidator: true
          }
        }
      });

      var form = new TestForm();
      var data = {
        username: 'foo',
        anotherField: ''
      };

      form
        .validate(data)
        .then(function() {
          done(new Error('Form validated when it should not have'));
        })
        .catch(function(errors) {
          assert.isTrue('anotherField' in errors);
          assert.equal(errors.anotherField.length, 1);
          delete validate.validators.fakeAsyncValidator;
          done();
        });
    });
  });
});
