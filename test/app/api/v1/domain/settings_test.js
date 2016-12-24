var assert = require('chai').assert;
var sinon = require('sinon');

var User = require('../../../../../app/models/api/users');
var UserSettingNotification = require('../../../../../app/models/api/user_settings_notifications');

var settings = require('../../../../../app/api/v1/domain/settings');

describe('Domain Settings', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be defined', function() {
    assert.isDefined(settings);
  });

  it('getSettings should be defined', function() {
    assert.isDefined(settings.getSettings);
  });

  it('updateUserProfile should be defined', function() {
    assert.isDefined(settings.updateUserProfile);
  });

  it('updateSocialLinks should be defined', function() {
    assert.isDefined(settings.updateSocialLinks);
  });

  it('updateEmailNotifications should be defined', function() {
    assert.isDefined(settings.updateEmailNotifications);
  });

  it('updateWebNotifications should be defined', function() {
    assert.isDefined(settings.updateWebNotifications);
  });

  describe('getSettings', function() {
    beforeEach(function() {
      this.settingsStub = this.sandbox.stub(UserSettingNotification, 'findOne');
    });

    it('should return settings', function(done) {
      var fakeUserId = 123;

      var fakeResults = {
        notifications: {
          email_comment_left: true,
          email_comment_liked: true,
          email_mentioned_in_comment: true,
          email_someone_follows: true,
          newsletter: true,
          web_comment_left: true,
          web_comment_liked: true,
          web_mentioned_in_comment: true,
          web_someone_follows: true
        }
      };

      this.settingsStub.returns(Promise.resolve(fakeResults));

      settings.getSettings(fakeUserId)
        .then(function(response) {
          assert.isDefined(response);
          done();
        });
    });

    it('should not return settings', function(done) {
      var fakeUserId = 123;

      this.settingsStub.returns(Promise.resolve(null));

      settings.getSettings(fakeUserId)
        .then(function(response) {
          assert.isUndefined(response);
          done();
        });
    });
  });

  describe('updateUserProfile', function() {
    beforeEach(function() {
      this.userStub = this.sandbox.stub(User, 'findOne');
    });

    it('should update profile', function(done) {
      var self = this;

      var fakeUserData = {
        id: 123,
        profile_name: 'Awesome Sauce',
        location: 'Florida, USA',
        company_name: 'My Company',
        first_name: 'Jane',
        last_name: 'Doe',
        bio: 'Woo Hoo',
        profile_photo: 'http://website.com/img/avatar.jpg'
      };

      var fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        new_email_requested: new Date().getTime()
      };

      this.userStub.returns(Promise.resolve(fakeFoundUser));

      settings.updateUserProfile(fakeUserData)
        .then(function(response) {
          assert.isTrue(self.userStub.calledOnce);

          assert.isTrue(fakeFoundUser.set.calledWith('profile_name', fakeUserData.profile_name));
          assert.isTrue(fakeFoundUser.set.calledWith('location', fakeUserData.location));
          assert.isTrue(fakeFoundUser.set.calledWith('company_name', fakeUserData.company_name));
          assert.isTrue(fakeFoundUser.set.calledWith('first_name', fakeUserData.first_name));
          assert.isTrue(fakeFoundUser.set.calledWith('last_name', fakeUserData.last_name));
          assert.isTrue(fakeFoundUser.set.calledWith('bio', fakeUserData.bio));
          assert.isTrue(fakeFoundUser.set.calledWith('profile_photo', fakeUserData.profile_photo));

          assert.isTrue(fakeFoundUser.save.calledOnce);

          done();
        });
    });

    it('should not find a match', function(done) {

      var fakeUserData = {
        id: 123,
        profile_name: 'Awesome Sauce',
        location: 'Florida, USA',
        company_name: 'My Company',
        first_name: 'Jane',
        last_name: 'Doe',
        bio: 'Woo Hoo',
        profile_photo: 'http://website.com/img/avatar.jpg'
      };

      this.userStub.returns(Promise.resolve(null));

      settings.updateUserProfile(fakeUserData)
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });

    it('should not update profile', function(done) {
      var fakeUserData = null;

      this.userStub.returns(Promise.reject('Request Invalid'));

      settings.updateUserProfile(fakeUserData)
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });
  });

  describe('updateSocialLinks', function() {
    beforeEach(function() {
      this.userStub = this.sandbox.stub(User, 'findOne');
    });

    it('should update social links', function(done) {
      var self = this;

      var fakeUserData = {
        id: 123,
        profile_link_website: 'http://mywebsite.com',
        profile_link_twitter: 'https://twitter.com/handler',
        profile_link_1: 'http://mywebsite1.com',
        profile_link_2: 'http://mywebsite2.com',
        profile_link_3: 'http://mywebsite3.com'
      };

      var fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        new_email_requested: new Date().getTime()
      };

      this.userStub.returns(Promise.resolve(fakeFoundUser));

      settings.updateSocialLinks(fakeUserData)
        .then(function(response) {
          assert.isTrue(self.userStub.calledOnce);

          assert.isTrue(fakeFoundUser.set.calledWith('profile_link_website', fakeUserData.profile_link_website));
          assert.isTrue(fakeFoundUser.set.calledWith('profile_link_twitter', fakeUserData.profile_link_twitter));
          assert.isTrue(fakeFoundUser.set.calledWith('profile_link_1', fakeUserData.profile_link_1));
          assert.isTrue(fakeFoundUser.set.calledWith('profile_link_2', fakeUserData.profile_link_2));
          assert.isTrue(fakeFoundUser.set.calledWith('profile_link_3', fakeUserData.profile_link_3));

          assert.isTrue(fakeFoundUser.save.calledOnce);

          done();
        });
    });

    it('should not find a match', function(done) {

      var fakeUserData = {
        id: 123,
        profile_link_website: 'http://mywebsite.com',
        profile_link_twitter: 'https://twitter.com/handler',
        profile_link_1: 'http://mywebsite1.com',
        profile_link_2: 'http://mywebsite2.com',
        profile_link_3: 'http://mywebsite3.com'
      };

      this.userStub.returns(Promise.resolve(null));

      settings.updateSocialLinks(fakeUserData)
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });

    it('should not update profile', function(done) {
      var fakeUserData = null;

      this.userStub.returns(Promise.reject('Request Invalid'));

      settings.updateSocialLinks(fakeUserData)
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });
  });

  describe('updateEmailNotifications', function() {
    beforeEach(function() {
      this.userStub = this.sandbox.stub(UserSettingNotification, 'findOne');
    });

    it('should update email notifications', function(done) {
      var self = this;

      var fakeUserData = {
        id: 123,
        email_comment_left: true,
        email_comment_liked: true,
        email_someone_follows: true,
        email_mentioned_in_comment: true
      };

      var fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        create: sinon.stub(),
        new_email_requested: new Date().getTime()
      };

      this.userStub.returns(Promise.resolve(fakeFoundUser));

      settings.updateEmailNotifications(fakeUserData)
        .then(function(response) {
          assert.isTrue(self.userStub.calledOnce);

          assert.isTrue(fakeFoundUser.set.calledWith('email_comment_left', fakeUserData.email_comment_left));
          assert.isTrue(fakeFoundUser.set.calledWith('email_comment_liked', fakeUserData.email_comment_liked));
          assert.isTrue(fakeFoundUser.set.calledWith('email_someone_follows', fakeUserData.email_someone_follows));
          assert.isTrue(fakeFoundUser.set.calledWith('email_mentioned_in_comment', fakeUserData.email_mentioned_in_comment));

          assert.isTrue(fakeFoundUser.save.calledOnce);

          done();
        });
    });

    it('should create email notifications', function(done) {
      var self = this;

      this.createStub = this.sandbox.stub(UserSettingNotification, 'create');

      var fakeUserData = {
        id: 123,
        email_comment_left: true,
        email_comment_liked: true,
        email_someone_follows: true,
        email_mentioned_in_comment: true
      };

      this.userStub.returns(Promise.resolve(null));
      this.createStub.returns(Promise.resolve(fakeUserData));

      settings.updateEmailNotifications(fakeUserData)
        .then(function(response) {
          assert.isTrue(self.createStub.calledOnce);
          done();
        });
    });

    it('should not find a match', function(done) {

      var fakeUserData = {
        id: 123,
        email_comment_left: true,
        email_comment_liked: true,
        email_someone_follows: true,
        email_mentioned_in_comment: true
      };

      this.userStub.returns(Promise.resolve(null));

      settings.updateEmailNotifications(fakeUserData)
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });

    it('should not update email notifications', function(done) {
      var fakeUserData = null;

      this.userStub.returns(Promise.reject('Request Invalid'));

      settings.updateEmailNotifications(fakeUserData)
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });
  });

  describe('updateWebNotifications', function() {
    beforeEach(function() {
      this.userStub = this.sandbox.stub(UserSettingNotification, 'findOne');
    });

    it('should update web notifications', function(done) {
      var self = this;

      var fakeUserData = {
        id: 123,
        web_comment_left: true,
        web_comment_liked: true,
        web_someone_follows: true,
        web_mentioned_in_comment: true
      };

      var fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        create: sinon.stub(),
        new_email_requested: new Date().getTime()
      };

      this.userStub.returns(Promise.resolve(fakeFoundUser));

      settings.updateWebNotifications(fakeUserData)
        .then(function(response) {
          assert.isTrue(self.userStub.calledOnce);

          assert.isTrue(fakeFoundUser.set.calledWith('web_comment_left', fakeUserData.web_comment_left));
          assert.isTrue(fakeFoundUser.set.calledWith('web_comment_liked', fakeUserData.web_comment_liked));
          assert.isTrue(fakeFoundUser.set.calledWith('web_someone_follows', fakeUserData.web_someone_follows));
          assert.isTrue(fakeFoundUser.set.calledWith('web_mentioned_in_comment', fakeUserData.web_mentioned_in_comment));

          assert.isTrue(fakeFoundUser.save.calledOnce);

          done();
        });
    });

    it('should create web notifications', function(done) {
      var self = this;

      this.createStub = this.sandbox.stub(UserSettingNotification, 'create');

      var fakeUserData = {
        id: 123,
        web_comment_left: true,
        web_comment_liked: true,
        web_someone_follows: true,
        web_mentioned_in_comment: true
      };

      this.userStub.returns(Promise.resolve(null));
      this.createStub.returns(Promise.resolve(fakeUserData));

      settings.updateWebNotifications(fakeUserData)
        .then(function(response) {
          assert.isTrue(self.createStub.calledOnce);
          done();
        });
    });

    it('should not find a match', function(done) {

      var fakeUserData = {
        id: 123,
        web_comment_left: true,
        web_comment_liked: true,
        web_someone_follows: true,
        web_mentioned_in_comment: true
      };

      this.userStub.returns(Promise.resolve(null));

      settings.updateWebNotifications(fakeUserData)
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });

    it('should not update web notifications', function(done) {
      var fakeUserData = null;

      this.userStub.returns(Promise.reject('Request Invalid'));

      settings.updateWebNotifications(fakeUserData)
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });
  });
});