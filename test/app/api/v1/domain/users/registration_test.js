var _ = require('lodash');
var Promise = require('bluebird');
var randomString = require('randomstring');
var assert = require('chai').assert;
var sinon = require('sinon');
var rewire = require('rewire');
var RegistrationForm = require('../../../../../../app/api/v1/domain/users/registration_form');
var User = require('../../../../../../app/models/api/users');
var UserInvite = require('../../../../../../app/models/api/user_invite');
var Hashids = require('hashids');

var registration = rewire('../../../../../../app/api/v1/domain/users/registration');

var config = require('../../../../../../app/config');
var hashid = new Hashids(config.get('hashID.secret'), config.get('hashID.length'), config.get('hashID.alphabet'));

describe('User Registration', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('register', function() {
    it('should create a user for valid submission', function(done) {
      var fakeData = {
        username: 'stevenhiller'
      };

      var fakeCreatedData = {
        username: 'stevenhiller',
        activated: false
      };

      var validateStub = this.sandbox.stub(RegistrationForm.prototype, 'validate', function() {
        return Promise.resolve(fakeData);
      });

      var createUserStub = this.sandbox.stub(registration, 'createUser', function() {
        return Promise.resolve(fakeCreatedData);
      });

      var restore = registration.__set__({
        RegistrationForm: RegistrationForm
      });

      registration
        .register(fakeData)
        .then(function(createdUser) {
          assert.isTrue(validateStub.calledOnce);
          assert.isTrue(validateStub.calledWith(fakeData));
          assert.isTrue(createUserStub.calledOnce);
          assert.deepEqual(createdUser, fakeCreatedData);
          done();
        });

      restore();
    });

    it('should not create a user for invalid data', function(done) {
      var fakeData = {
        username: 'presidenttom'
      };

      var fakeErrors = {
        username: ['Invalid username']
      };

      var validateStub = this.sandbox.stub(RegistrationForm.prototype, 'validate', function() {
        return Promise.reject(fakeErrors);
      });

      var createUserStub = this.sandbox.stub(registration, 'createUser');

      var restore = registration.__set__({
        RegistrationForm: RegistrationForm
      });

      registration
        .register(fakeData)
        .catch(function(errors) {
          assert.isTrue(validateStub.calledOnce);
          assert.isTrue(validateStub.calledWith(fakeData));
          assert.isFalse(createUserStub.called);
          assert.deepEqual(errors, fakeErrors);
          done();
        });

      restore();
    });
  });

  describe('createUser', function() {
    var restoreEmail;
    var emailStub = {
      sendUserConfirmationEmail: sinon.stub()
    };

    var userInvite = {
      create: sinon.stub()
    };

    beforeEach(function() {
      restoreEmail = registration.__set__('email', emailStub);
    });

    afterEach(function() {
      restoreEmail();
    });

    it('should encode password and insert an active user into the database', function(done) {
      var fakeData = {
        username: 'davelevinson',
        password: '4thofjuly4evr',
        email: 'dave@myemail.com',
        inviteCode: hashid.encode(123),
        agree: 'yes',
        id: 123
      };

      var encoded = 'alsfkj129847';
      var hashGenerateStub = this.sandbox.stub().returns(Promise.resolve(encoded));
      var userCreateInvite = this.sandbox.stub(UserInvite, 'create').returns(Promise.resolve());
      var userCreateStub = this.sandbox.stub(User, 'create').returns(Promise.resolve(fakeData));

      var restore = registration.__set__({
        hasher: {
          generate: hashGenerateStub
        },

        User: User
      });

      registration
        .createUser(fakeData)
        .then(function(createdUser) {
          assert.isTrue(hashGenerateStub.calledOnce);
          assert.isTrue(hashGenerateStub.calledWith(fakeData.password));
          assert.isTrue(userCreateStub.calledOnce);

          var createData = userCreateStub.getCall(0).args[0];
          var createInvite = userCreateInvite.getCall(0).args[0];

          assert.equal(createData.username, fakeData.username);
          assert.equal(createData.password, encoded);
          assert.equal(createData.activated, false);

          assert.isTrue('new_email_key' in createData);
          assert.isTrue(emailStub.sendUserConfirmationEmail.called);

          restore();
          done();
        });

    });

    it('should create an email key and make user inactive with an email present', function(done) {
      var fakeData = {
        username: 'davelevinson',
        password: '4thofjuly4evr',
        email: 'dave@myemail.com',
        inviteCode: hashid.encode(123),
        agree: 'yes'
      };

      var encoded = 'alsfkj129847';
      var hashGenerateStub = this.sandbox.stub().returns(Promise.resolve(encoded));
      var userCreateStub = this.sandbox.stub(User, 'create', function(data) {
        return Promise.resolve(data);
      });

      var restore = registration.__set__({
        hasher: {
          generate: hashGenerateStub
        },

        User: User
      });

      registration
        .createUser(fakeData)
        .then(function(createdUser) {
          assert.isTrue(hashGenerateStub.calledOnce);
          assert.isTrue(hashGenerateStub.calledWith(fakeData.password));
          assert.isTrue(userCreateStub.calledOnce);

          var createData = userCreateStub.getCall(0).args[0];

          assert.equal(createData.username, fakeData.username);
          assert.equal(createData.password, encoded);
          assert.isDefined(createData.new_email_key);
          assert.equal(createData.activated, false);

          done();
        });

      restore();
    });
  });

  describe('confirm', function() {
    beforeEach(function() {
      this.userFindStub = this.sandbox.stub(User, 'findOne');
    });

    it('should activate a user matching the activation key passed in', function(done) {
      var self = this;
      var fakeKey = randomString.generate(registration.CONFIRMATION_KEY_LENGTH);
      var fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        new_email_requested: new Date().getTime()
      };

      this.userFindStub.returns(Promise.resolve(fakeFoundUser));

      var expectedFindOneArgs = {
        where: {
          new_email_key: fakeKey
        }
      };

      registration
        .confirmAccount(fakeKey)
        .then(function(foundUser) {
          assert.isTrue(self.userFindStub.calledOnce);
          assert.isTrue(self.userFindStub.calledWith(expectedFindOneArgs));

          // Check that user was activated and email key was wiped

          assert.isTrue(fakeFoundUser.set.calledWith('activated', true));
          assert.isTrue(fakeFoundUser.set.calledWith('new_email_key', null));

          assert.isTrue(fakeFoundUser.save.calledOnce);

          done();
        });
    });

    it('should fail when activation key not found', function(done) {
      var self = this;
      var fakeKey = randomString.generate(registration.CONFIRMATION_KEY_LENGTH);
      var fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        new_email_requested: new Date().getTime()
      };

      this.userFindStub.returns(Promise.reject(new Error('Activation key not found')));

      var expectedFindOneArgs = {
        where: {
          new_email_key: fakeKey
        }
      };

      registration
        .confirmAccount(fakeKey)
        .catch(function(error) {
          assert.isTrue(self.userFindStub.calledOnce);
          assert.isTrue(self.userFindStub.calledWith(expectedFindOneArgs));
          assert.isFalse(fakeFoundUser.set.called);
          assert.isFalse(fakeFoundUser.save.called);
          assert.instanceOf(error, Error);

          done();
        });
    });

    it('should fail with an empty key', function(done) {
      var self = this;
      var fakeKey = '';
      var fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        new_email_requested: new Date().getTime()
      };

      registration
        .confirmAccount(fakeKey)
        .catch(function(error) {
          assert.isTrue(_.isString(error));
          assert.isFalse(self.userFindStub.called);
          assert.isFalse(fakeFoundUser.set.called);
          assert.isFalse(fakeFoundUser.save.called);

          done();
        });
    });

    it('should fail with a key of the wrong length', function(done) {
      var self = this;
      var fakeKey = randomString.generate(registration.CONFIRMATION_KEY_LENGTH - 1);
      var fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        new_email_requested: new Date().getTime()
      };

      registration
        .confirmAccount(fakeKey)
        .catch(function(error) {
          assert.isTrue(_.isString(error));
          assert.isFalse(self.userFindStub.called);
          assert.isFalse(fakeFoundUser.set.called);
          assert.isFalse(fakeFoundUser.save.called);
          done();
        });
    });
  });
});
