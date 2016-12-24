var Promise = require('bluebird');
var assert = require('chai').assert;
var sinon = require('sinon');
var rewire = require('rewire');

var email = rewire('../../../../../app/api/v1/domain/email');

describe('Email Domain Service Tests', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('getClient', function() {
    it('should return a cached, promisified Mandrill client', function() {
      var fakeMandrillKey = 'mandrill_key';
      var configStub = {
        get: sinon.stub().withArgs('mandrill.key').returns(fakeMandrillKey)
      };
      var promiseStub = {
        promisifyAll: sinon.stub()
      };

      var fakeClient = {
        messages: {}
      };

      var mandrillStub = {
        Mandrill: sinon.stub().returns(fakeClient)
      };

      var restore = email.__set__({
        Promise: promiseStub,
        mandrill: mandrillStub,
        config: configStub
      });

      var client = email.getClient();

      assert.equal(client, fakeClient);
      assert.isTrue(configStub.get.calledOnce);
      assert.isTrue(configStub.get.calledWith('mandrill.key'));
      assert.isTrue(mandrillStub.Mandrill.calledOnce);
      assert.isTrue(mandrillStub.Mandrill.calledWith(fakeMandrillKey));
      assert.isTrue(promiseStub.promisifyAll.calledOnce);
      assert.equal(promiseStub.promisifyAll.getCall(0).args[0], fakeClient.messages);

      // Check that client is cached/memoized

      var client2 = email.getClient();

      assert.equal(client, client2);
      assert.isTrue(configStub.get.calledOnce);
      assert.isTrue(mandrillStub.Mandrill.calledOnce);
      assert.isTrue(promiseStub.promisifyAll.calledOnce);

      restore();
    });
  });

  describe('getBaseURL', function() {
    it('should return base correct local URL', function() {

      var configStub = {
        get: sinon.stub().withArgs('env').returns('local')
      };

      email.__set__({
        config: configStub
      });

      var url = email.getBaseURL();
      assert.isDefined(url);
      assert.isTrue(url === 'http://127.0.0.1:5050');
    });

    it('should return base correct staging URL', function() {

      var configStub = {
        get: sinon.stub().withArgs('env').returns('staging')
      };

      email.__set__({
        config: configStub
      });

      var url = email.getBaseURL();
      assert.isDefined(url);
      assert.isTrue(url === 'https://staging.website.com');
    });

    it('should return base correct local URL', function() {

      var configStub = {
        get: sinon.stub().withArgs('env').returns('production')
      };

      email.__set__({
        config: configStub
      });

      var url = email.getBaseURL();
      assert.isDefined(url);
      assert.isTrue(url === 'https://website.com');
    });
  });

  describe('sendUserEmail', function() {
    it('should send an email via a Mandrill client to the passed in template slug with the passed in user as context', function(done) {
      var clientStub = {
        messages: {
          sendTemplateAsync: sinon.stub().returns(Promise.resolve())
        }
      };

      var getClientStub = this.sandbox.stub(email, 'getClient').returns(clientStub);

      var userStub = {
        get: sinon.stub(),
        fullName: sinon.stub().returns('Marquis Warren'),
        publicJSON: sinon.stub().returns({
          first_name: 'Marquis',
          last_name: 'Warren'
        })
      };

      userStub.get.withArgs('email').returns('majorwarren@gmail.com');

      var templateSlug = 'some-template';

      var expectedTo = [{
        email: 'majorwarren@gmail.com',
        name: 'Marquis Warren'
      }];

      var expectedTemplateContent = [
        {
          name: 'first_name',
          content: 'Marquis'
        },
        {
          name: 'last_name',
          content: 'Warren'
        }
      ];

      email
        .sendUserEmail(templateSlug, userStub)
        .then(function() {
          assert.isTrue(getClientStub.calledOnce);
          assert.isTrue(clientStub.messages.sendTemplateAsync.calledOnce);

          var sendTemplateArg = clientStub.messages.sendTemplateAsync.getCall(0).args[0];

          assert.equal(sendTemplateArg.template_name, templateSlug);
          assert.deepEqual(sendTemplateArg.template_content, expectedTemplateContent);
          assert.deepEqual(sendTemplateArg.message.to, expectedTo);
          assert.equal(sendTemplateArg.message.merge_vars.length, 1);
          assert.equal(sendTemplateArg.message.merge_vars[0].rcpt, 'majorwarren@gmail.com');

          done();
        });
    });
  });

  describe('sendUserConfirmationEmail', function() {
    it('should call sendUserEmail with the correct template slug and the passed in user', function() {
      var sendUserEmailStub = this.sandbox.stub(email, 'sendUserEmail');
      var fakeUser = {
        username: 'stuff'
      };

      email.sendUserConfirmationEmail(fakeUser);

      assert.isTrue(sendUserEmailStub.calledOnce);
      assert.isTrue(sendUserEmailStub.calledWith('registration-confirmation', fakeUser));
    });
  });

  describe('sendUserForgotPasswordEmail', function() {
    it('should call sendUserEmail with the correct template slug and the passed in user', function() {
      var sendUserEmailStub = this.sandbox.stub(email, 'sendUserEmail');
      var fakeUser = {
        username: 'some_user'
      };

      email.sendUserForgotPasswordEmail(fakeUser);

      assert.isTrue(sendUserEmailStub.calledOnce);
      assert.isTrue(sendUserEmailStub.calledWith('forgot-password', fakeUser));
    });
  });

  describe('sendUserPasswordResetEmail', function() {
    it('should call sendUserEmail with the correct template slug and the passed in user', function() {
      var sendUserEmailStub = this.sandbox.stub(email, 'sendUserEmail');
      var fakeUser = {
        username: 'some_user'
      };

      email.sendUserPasswordResetEmail(fakeUser);

      assert.isTrue(sendUserEmailStub.calledOnce);
      assert.isTrue(sendUserEmailStub.calledWith('password-reset', fakeUser));
    });
  });

  describe('sendChangedUsernameEmail', function() {
    it('should call sendUserEmail with the correct template slug and the passed in user', function() {
      var sendUserEmailStub = this.sandbox.stub(email, 'sendUserEmail');
      var fakeUser = {
        username: 'some_user'
      };

      email.sendChangedUsernameEmail(fakeUser);

      assert.isTrue(sendUserEmailStub.calledOnce);
      assert.isTrue(sendUserEmailStub.calledWith('change-username-notice', fakeUser));
    });
  });

  describe('sendConfirmChangedEmailAddressEmail', function() {
    it('should call sendUserEmail with the correct template slug and the passed in user', function() {
      var sendUserEmailStub = this.sandbox.stub(email, 'sendUserEmail');

      var fakeUser = {
        username: 'some_user'
      };

      email.sendConfirmChangedEmailAddressEmail(fakeUser);

      assert.isTrue(sendUserEmailStub.calledOnce);
      assert.isTrue(sendUserEmailStub.calledWith('change-email-confirmation', fakeUser));
    });
  });

  describe('sendConfirmChangedPasswordEmail', function() {
    it('should call sendUserEmail with the correct template slug and the passed in user', function() {
      var sendUserEmailStub = this.sandbox.stub(email, 'sendUserEmail');
      var fakeUser = {
        username: 'some_user'
      };

      email.sendConfirmChangedPasswordEmail(fakeUser);

      assert.isTrue(sendUserEmailStub.calledOnce);
      assert.isTrue(sendUserEmailStub.calledWith('change-password-confirmation', fakeUser));
    });
  });
});
