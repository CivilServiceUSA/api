var _ = require('lodash');
var assert = require('chai').assert;
var sinon = require('sinon');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var config = require('../../../../../../app/config');
var auth = require('../../../../../../app/api/v1/domain/users/auth');
var User = require('../../../../../../app/models/api/users');


describe('User Auth Tests', function() {
  describe('createUserToken', function() {
    it("should return a valid JWT web token containing the passed in user's id", function() {
      var id = 456;
      var user = User.build({
        id: id
      });

      var token = auth.createUserToken(user);
      var decoded;

      assert.doesNotThrow(function() { decoded = jwt.verify(token, config.get('secret')); });
      var expiration = moment(decoded.exp * 1000); // Convert expiration (in seconds) to milliseconds

      assert.equal(decoded.userId, id);
      assert.closeTo(moment().diff(expiration, 'days'), -1 * auth.TOKEN_EXPIRATION_DAYS, 1);
    });

    it('should accept a user id as an argument', function() {
      var userId = 5;
      var token = auth.createUserToken(userId);
      var decoded;

      assert.doesNotThrow(function() { decoded = jwt.verify(token, config.get('secret')); });

      assert.equal(decoded.userId, userId);
    });

    it('should accept a user id string as an argument', function() {
      var userId = '17';
      var token = auth.createUserToken(userId);
      var decoded;

      assert.doesNotThrow(function() { decoded = jwt.verify(token, config.get('secret')); });

      assert.equal(decoded.userId, userId);
    });
  });

  describe('verifyToken', function() {
    it('should verify a token', function() {
      var id = 784;
      var validToken = jwt.sign({userId: id}, config.get('secret'), {expiresIn: '1d'});

      var verified = auth.verifyToken(validToken);

      assert.isObject(verified);
      assert.equal(verified.userId, id);
    });

    it('should return false for an expired token', function() {
      var id = 487;
      var expiredToken = jwt.sign({userId: id}, config.get('secret'), {expiresIn: -5});
      assert.isFalse(auth.verifyToken(expiredToken));
    });

    it('should return false for an invalid token', function() {
      var invalidToken = 'flerp';
      assert.isFalse(auth.verifyToken(invalidToken));
    });
  });

  describe('refreshToken', function() {
    beforeEach(function() {
      this.sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
      this.sandbox.restore();
    });

    it('should update the expiration date of a valid JWT token', function() {
      var fakeToken = 'abc123';
      var id = 1472;
      var verifyTokenStub = this.sandbox.stub(auth, 'verifyToken').returns({userId: id});
      var createUserTokenStub = this.sandbox.stub(auth, 'createUserToken').returns(fakeToken);

      var refreshedToken = auth.refreshToken(fakeToken);

      assert.isTrue(verifyTokenStub.calledOnce);
      assert.isTrue(verifyTokenStub.calledWith(fakeToken));
      assert.isTrue(createUserTokenStub.calledOnce);
      assert.isTrue(createUserTokenStub.calledWith(id));
    });

    it('should return false for an invalid token', function() {
      var fakeToken = 'jkjh987';
      var verifyTokenStub = this.sandbox.stub(auth, 'verifyToken').returns(false);
      var createUserTokenStub = this.sandbox.stub(auth, 'createUserToken');

      var refreshedToken = auth.refreshToken(fakeToken);

      assert.isFalse(refreshedToken);
      assert.isTrue(verifyTokenStub.calledOnce);
      assert.isTrue(verifyTokenStub.calledWith(fakeToken));
      assert.isFalse(createUserTokenStub.called);
    });
  });
});
