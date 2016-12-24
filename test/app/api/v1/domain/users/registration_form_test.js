var _ = require('lodash');
var assert = require('chai').assert;
var sinon = require('sinon');
var Promise = require('bluebird');
var validate = require('validate.js');
var Hashids = require('hashids');

var RegistrationForm = require('../../../../../../app/api/v1/domain/users/registration_form');

var config = require('../../../../../../app/config');
var hashid = new Hashids(config.get('hashID.secret'), config.get('hashID.length'), config.get('hashID.alphabet'));

describe('User Registration Form', function() {
  var validData;
  var modelFieldValueUniqueStub;

  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();

    validData = {
      username: 'janedoe',
      password: 't3sT3r',
      email: 'janedoe@website.com',
      inviteCode: hashid.encode(123),
      agree: 'yes'
    };

    modelFieldValueUniqueStub = this.sandbox.stub(validate.validators, 'modelFieldValueUnique', function() {
      return validate.Promise.resolve();
    });
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  /**
   * Test a bunch of valid values for a field on a form class
   */
  function validForValues(FormClass, field, values, cb) {
    return Promise
      .map(values, function(value) {
        var data = _.clone(validData);
        data[field] = value;

        var form = new FormClass();

        return form
          .validate(data)
          .then(function(result) {
            assert.deepEqual(data, result);
          })
          .catch(function(errors) {
            cb(new Error('Form invalid when it should be valid'));
          });
      })
      .then(function() {
        cb();
      });
  }

  /**
   * Test a bunch of invalid values for a field on a form class
   */
  function invalidForValues(FormClass, field, values, cb) {
    return Promise
      .map(values, function(value) {
        var data = _.clone(validData);
        data[field] = value;

        var form = new FormClass();

        return form
          .validate(data)
          .then(function() {
            cb(new Error('Form validated when it shoud not have'));
          })
          .catch(function(errors) {
            assert.isTrue(field in errors);
            assert.lengthOf(errors[field], 1);
          });
      })
      .then(function() {
        cb();
      });
  }

  it('should validate for correct basic set of data', function(done) {
    var form = new RegistrationForm();

    form
      .validate(validData)
      .then(function(data) {
        assert.deepEqual(data, validData);
        done();
      })
      .catch(function() {
        done(new Error('Form invalid when it should be valid'));
      });
  });

  describe('username', function() {
    it('should be required', function(done) {
      var form = new RegistrationForm();
      delete validData.username;
      form
        .validate(validData)
        .catch(function(errors) {
          assert.lengthOf(Object.keys(errors), 1);
          assert.isTrue('username' in errors);
          done();
        });
    });

    it('should fail for invalid values', function(done) {
      var invalidUsernames = [
        null,
        '',
        'hi', // Too short
        'hi there', // No spaces
        '$&!@', // Insane characters
        'velociraptor!', // No exclamation points
        't.rex', // No periods
        'steg/osaurs', // No slashes
        'dinodinodinodinodinodinodinodin' // 1 character too long
      ];

      invalidForValues(RegistrationForm, 'username', invalidUsernames, done);
    });

    it('should validate for valid values', function(done) {
      var validUsernames = [
        'ian',
        'dinodinodinodinodinodinodinodi', // 30 characters
        'ian_malcolm'
      ];

      validForValues(RegistrationForm, 'username', validUsernames, done);
    });

    it('should be unique', function(done) {
      var form = new RegistrationForm();

      modelFieldValueUniqueStub.restore();
      modelFieldValueUniqueStub = sinon
        .stub(validate.validators, 'modelFieldValueUnique')
        .onCall(0)
        .returns(Promise.resolve('some error'))
        .onCall(1)
        .returns(Promise.resolve()); // Fake resolution for email check

      form
        .validate(validData)
        .then(function(data) {
          assert.deepEqual(data, validData);
          done();
        })
        .catch(function(errors) {
          assert.lengthOf(Object.keys(errors), 1);
          assert.isTrue('username' in errors);
          assert.lengthOf(errors.username, 1);
          done();
        });
    });
  });

  describe('password', function() {
    it('should be required', function(done) {
      var form = new RegistrationForm();
      delete validData.password;
      form
        .validate(validData)
        .then(function(data) {
          done(new Error('Form validated when it shoud not have'));
        })
        .catch(function(errors) {
          assert.lengthOf(Object.keys(errors), 1);
          assert.isTrue('password' in errors);
          done();
        });
    });

    it('should fail for invalid values', function(done) {
      var invalidPasswords = [
        null,
        '',
        'yo' // Too short
      ];

      invalidForValues(RegistrationForm, 'password', invalidPasswords, done);
    });

    it('should pass for valid values', function(done) {
      var validPasswords = [
        'heyyou',
        'chaoschaoschaoschaoschaoschaos',
        '1jfi94@# %#josl',
        'fjoa_-)(12309'
      ];

      validForValues(RegistrationForm, 'password', validPasswords, done);
    });
  });

  describe('email', function() {
    it('should fail for invalid values', function(done) {
      var invalidEmails = [
        'hi',
        'foo@',
        'foo@gmail',
        'foo@gmailcom'
      ];

      invalidForValues(RegistrationForm, 'email', invalidEmails, done);
    });

    it('should pass for valid values', function(done) {
      var validEmails = [
        'foo@gmail.com',
        'hi@doing.co'
      ];

      validForValues(RegistrationForm, 'email', validEmails, done);
    });

    it('should be unique', function(done) {
      var form = new RegistrationForm();

      modelFieldValueUniqueStub.restore();
      modelFieldValueUniqueStub = sinon
        .stub(validate.validators, 'modelFieldValueUnique')
        .onCall(0)
        .returns(Promise.resolve()) // Fake resolution for username check
        .onCall(1)
        .returns(Promise.resolve('some error'));

      form
        .validate(validData)
        .then(function(data) {
          assert.deepEqual(data, validData);
          done();
        })
        .catch(function(errors) {
          assert.lengthOf(Object.keys(errors), 1);
          assert.isTrue('email' in errors);
          assert.lengthOf(errors.email, 1);
          done();
        });
    });
  });

  describe('first_name', function() {
    it('should be optional', function(done) {
      var form = new RegistrationForm();
      delete validData.first_name;
      form
        .validate(validData)
        .then(function(data) {
          assert.deepEqual(validData, data);
          done();
        });
    });
  });

  describe('last_name', function() {
    it('should be optional', function(done) {
      var form = new RegistrationForm();
      delete validData.last_name;
      form
        .validate(validData)
        .then(function(data) {
          assert.deepEqual(validData, data);
          done();
        });
    });
  });
});
