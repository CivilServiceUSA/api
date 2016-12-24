var _ = require('lodash');
var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');
var rewire = require('rewire');
var Promise = require('bluebird');

var LocalAuthStrategy = rewire('../../../../../../app/api/v1/domain/users/local_auth_strategy');


describe('LocalAuthStrategy Tests', function() {
  var authRewire;
  var User;
  var fakeUser;
  var hasher;

  var requestBody = {
    username: 'kyloren',
    password: 'thedarkside'
  };

  var findOneArgs = {
    where: {
      username: requestBody.username
    }
  };

  beforeEach(function() {
    fakeUser = {
      isActive: sinon.stub().returns(false),
      password: 'encryptedPassword'
    };

    User = {
      findOne: sinon.stub()
    };

    hasher = {
      verify: sinon.stub()
    };

    fakeUser.isActive.returns(true);
    User.findOne.returns(Promise.resolve(fakeUser));
    hasher.verify.returns(Promise.resolve(true));

    // Rewire User model

    authRewire = LocalAuthStrategy.__set__({
      User: User,
      hasher: hasher
    });
  });

  afterEach(function() {
    authRewire();
  });

  it('should pass for a valid username and password', function(done) {
    chai.passport
      .use(LocalAuthStrategy)
      .success(function() {
        assert.isTrue(User.findOne.calledOnce);
        assert.isTrue(User.findOne.calledWith(findOneArgs));
        assert.isTrue(fakeUser.isActive.calledOnce);
        assert.isTrue(hasher.verify.calledOnce);
        assert.isTrue(hasher.verify.calledWith(requestBody.password, fakeUser.password));
        done();
      })
      .req(function(request) {
        request.body = requestBody;
      })
      .authenticate();
  });

  it('should fail for an invalid password', function(done) {
    hasher.verify.returns(Promise.resolve(false));

    chai.passport
      .use(LocalAuthStrategy)
      .error(function() {
        assert.isTrue(User.findOne.calledOnce);
        assert.isTrue(User.findOne.calledWith(findOneArgs));
        assert.isTrue(fakeUser.isActive.calledOnce);
        assert.isTrue(hasher.verify.calledOnce);
        assert.isTrue(hasher.verify.calledWith(requestBody.password, fakeUser.password));
        done();
      })
      .req(function(request) {
        request.body = requestBody;
      })
      .authenticate();
  });

  it('should fail for user not found', function(done) {
    User.findOne.returns(Promise.reject(new Error('User not found!')));

    chai.passport
      .use(LocalAuthStrategy)
      .error(function(err) {
        assert.instanceOf(err, Error);
        assert.isTrue(User.findOne.calledOnce);
        assert.isTrue(User.findOne.calledWith(findOneArgs));
        assert.isFalse(fakeUser.isActive.called);
        assert.isFalse(hasher.verify.called);
        done();
      })
      .req(function(request) {
        request.body = requestBody;
      })
      .authenticate();
  });

  it('should fail for an inactive user', function(done) {
    fakeUser.isActive.returns(false);

    chai.passport
      .use(LocalAuthStrategy)
      .error(function(err) {
        assert.instanceOf(err, Error);
        assert.isTrue(User.findOne.calledOnce);
        assert.isTrue(User.findOne.calledWith(findOneArgs));
        assert.isTrue(fakeUser.isActive.calledOnce);
        assert.isFalse(hasher.verify.called);
        done();
      })
      .req(function(request) {
        request.body = requestBody;
      })
      .authenticate();
  });

  it('should fail for a database error', function(done) {
    User.findOne.returns(Promise.reject(new Error('Database error!')));

    chai.passport
      .use(LocalAuthStrategy)
      .error(function(err) {
        assert.instanceOf(err, Error);
        assert.isTrue(User.findOne.calledOnce);
        assert.isTrue(User.findOne.calledWith(findOneArgs));
        assert.isFalse(fakeUser.isActive.called);
        assert.isFalse(hasher.verify.called);
        done();
      })
      .req(function(request) {
        request.body = requestBody;
      })
      .authenticate();
  });
});
