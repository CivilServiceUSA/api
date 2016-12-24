var assert = require('chai').assert;
var util = require('../../../../../app/api/v1/routes/util');

describe('Routes Util Tests', function() {
  describe('createAPIResponse', function() {
    it('should mark "error" as false by default', function() {
      var response = util.createAPIResponse();
      assert.isFalse(response.error);
    });

    it('should mark "error" as true is any general errors are present', function() {
      var response = util.createAPIResponse({
        errors: ['You did a thing wrong']
      });
      assert.isTrue(response.error);
    });

    it('should not mark "error" as true for empty general error array', function() {
      var response = util.createAPIResponse({
        errors: []
      });
      assert.isFalse(response.error);
    });

    it('should mark "error" as true is any field errors are present', function() {
      var response = util.createAPIResponse({
        field_errors: {
          username: ['Your username is too weird']
        }
      });
      assert.isTrue(response.error);
    });

    it('should not mark "error" as true is field error array is empty', function() {
      var response = util.createAPIResponse({
        field_errors: {
          password: []
        }
      });
      assert.isFalse(response.error);
    });

    it('should mark "error" as true for a mix of field and general errors', function() {
      var response = util.createAPIResponse({
        errors: ['You dont know how to use the internet'],
        field_errors: {
          email: ['Thats not your real email address']
        }
      });
      assert.isTrue(response.error);
    });
  });
});
