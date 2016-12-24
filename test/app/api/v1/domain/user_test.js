var assert = require('chai').assert;
var sinon = require('sinon');
var Hashids = require('hashids');
var randomString = require('randomstring');

var User = require('../../../../../app/models/api/users');
var UserFollow = require('../../../../../app/models/api/user_follows');
var UserInvite = require('../../../../../app/models/api/user_invite');
var userDomain = require('../../../../../app/api/v1/domain/user');

var config = require('../../../../../app/config');
var hashid = new Hashids(config.get('hashID.secret'), config.get('hashID.length'), config.get('hashID.alphabet'));

var userAccount = {
  id: 1,
  activated: true,
  banned: false,
  banned_reason: '',
  bio: 'I exist only in memory.',
  company_name: 'My Company',
  created_at: new Date(),
  email: 'jane.doe@email.com',
  first_name: 'Jane',
  hash_id: 'abc123',
  join_date: new Date(),
  last_name: 'Doe',
  location: 'Florida, USA',
  modified_at: new Date(),
  new_email: 'new@email.com',
  new_email_key: '',
  new_email_requested: new Date(),
  new_password: 'abc123',
  new_password_requested: new Date(),
  password: 'password',
  profile_link_1: 'https://website1.com',
  profile_link_2: 'https://website2.com',
  profile_link_3: 'https://website3.com',
  profile_link_twitter: 'https://twitter.com/handler',
  profile_link_website: 'http://mywebsite.com',
  profile_name: 'Awesome Sauce',
  profile_photo: 'http://www.mywebsite.com/img/avatar.jpg',
  username: 'JaneDoe'
};

describe('Domain User', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be defined', function() {
    assert.isDefined(userDomain);
    assert.isDefined(userDomain.prepareForAPIOutput);
    assert.isDefined(userDomain.prepareForElasticSearch);
    assert.isDefined(userDomain.checkInviteCode);
    assert.isDefined(userDomain.deleteAccount);
    assert.isDefined(userDomain.emailAddressInUse);
    assert.isDefined(userDomain.followUser);
    assert.isDefined(userDomain.getFollowers);
    assert.isDefined(userDomain.getFollowing);
    assert.isDefined(userDomain.unfollowUser);
    assert.isDefined(userDomain.updateAccount);
    assert.isDefined(userDomain.usernameInUse);
  });

  describe('prepareForAPIOutput', function() {
    it('prepareForAPIOutput should return correct data', function() {
      var output = userDomain.prepareForAPIOutput({ _source: userAccount });

      assert.isDefined(output.bio);
      assert.isDefined(output.company_name);
      assert.isDefined(output.email);
      assert.isDefined(output.first_name);
      assert.isDefined(output.hash_id);
      assert.isDefined(output.join_date);
      assert.isDefined(output.last_name);
      assert.isDefined(output.location);
      assert.isDefined(output.profile_link_1);
      assert.isDefined(output.profile_link_2);
      assert.isDefined(output.profile_link_3);
      assert.isDefined(output.profile_link_twitter);
      assert.isDefined(output.profile_link_website);
      assert.isDefined(output.profile_name);
      assert.isDefined(output.profile_photo);
      assert.isDefined(output.username);

      assert.isTrue(output.bio === userAccount.bio);
      assert.isTrue(output.company_name === userAccount.company_name);
      assert.isTrue(output.email === userAccount.email);
      assert.isTrue(output.first_name === userAccount.first_name);
      assert.isTrue(output.hash_id === userAccount.hash_id);
      assert.isTrue(output.join_date === userAccount.join_date);
      assert.isTrue(output.last_name === userAccount.last_name);
      assert.isTrue(output.location === userAccount.location);
      assert.isTrue(output.profile_link_1 === userAccount.profile_link_1);
      assert.isTrue(output.profile_link_2 === userAccount.profile_link_2);
      assert.isTrue(output.profile_link_3 === userAccount.profile_link_3);
      assert.isTrue(output.profile_link_twitter === userAccount.profile_link_twitter);
      assert.isTrue(output.profile_link_website === userAccount.profile_link_website);
      assert.isTrue(output.profile_name === userAccount.profile_name);
      assert.isTrue(output.profile_photo === userAccount.profile_photo);
      assert.isTrue(output.username === userAccount.username);

      assert.isUndefined(output.id);
      assert.isUndefined(output.activated);
      assert.isUndefined(output.banned);
      assert.isUndefined(output.banned_reason);
      assert.isUndefined(output.created_at);
      assert.isUndefined(output.modified_at);
      assert.isUndefined(output.new_email);
      assert.isUndefined(output.new_email_key);
      assert.isUndefined(output.new_email_requested);
      assert.isUndefined(output.new_password);
      assert.isUndefined(output.new_password_requested);
      assert.isUndefined(output.password);
    });
  });

  describe('prepareForElasticSearch', function() {
    it('prepareForElasticSearch should return correct data', function() {
      var output = userDomain.prepareForElasticSearch(userAccount);

      assert.isDefined(output.id);
      assert.isDefined(output.bio);
      assert.isDefined(output.company_name);
      assert.isDefined(output.email);
      assert.isDefined(output.first_name);
      assert.isDefined(output.hash_id);
      assert.isDefined(output.join_date);
      assert.isDefined(output.last_name);
      assert.isDefined(output.location);
      assert.isDefined(output.profile_link_1);
      assert.isDefined(output.profile_link_2);
      assert.isDefined(output.profile_link_3);
      assert.isDefined(output.profile_link_twitter);
      assert.isDefined(output.profile_link_website);
      assert.isDefined(output.profile_name);
      assert.isDefined(output.profile_photo);
      assert.isDefined(output.username);

      assert.isTrue(output.id === userAccount.id);
      assert.isTrue(output.bio === userAccount.bio);
      assert.isTrue(output.company_name === userAccount.company_name);
      assert.isTrue(output.email === userAccount.email);
      assert.isTrue(output.first_name === userAccount.first_name);
      assert.isTrue(output.hash_id === userAccount.hash_id);
      assert.isTrue(output.join_date === userAccount.join_date);
      assert.isTrue(output.last_name === userAccount.last_name);
      assert.isTrue(output.location === userAccount.location);
      assert.isTrue(output.profile_link_1 === userAccount.profile_link_1);
      assert.isTrue(output.profile_link_2 === userAccount.profile_link_2);
      assert.isTrue(output.profile_link_3 === userAccount.profile_link_3);
      assert.isTrue(output.profile_link_twitter === userAccount.profile_link_twitter);
      assert.isTrue(output.profile_link_website === userAccount.profile_link_website);
      assert.isTrue(output.profile_name === userAccount.profile_name);
      assert.isTrue(output.profile_photo === userAccount.profile_photo);
      assert.isTrue(output.username === userAccount.username);

      assert.isUndefined(output.activated);
      assert.isUndefined(output.banned);
      assert.isUndefined(output.banned_reason);
      assert.isUndefined(output.created_at);
      assert.isUndefined(output.modified_at);
      assert.isUndefined(output.new_email);
      assert.isUndefined(output.new_email_key);
      assert.isUndefined(output.new_email_requested);
      assert.isUndefined(output.new_password);
      assert.isUndefined(output.new_password_requested);
      assert.isUndefined(output.password);
    });
  });

  describe('checkInviteCode', function() {
    beforeEach(function() {
      this.userInviteStub = this.sandbox.stub(UserInvite, 'findAll');
    });

    it('should return invites', function(done) {
      var fakeKey = hashid.encode(123);
      var fakeResponse = [];

      this.userInviteStub.returns(Promise.resolve(fakeResponse));

      userDomain.checkInviteCode(fakeKey)
        .then(function(foundUser) {
          assert.isDefined(foundUser);
          done();
        });
    });

    it('should not return invites', function(done) {
      var fakeKey = hashid.encode(123);
      var fakeResponse = null;

      this.userInviteStub.returns(Promise.resolve(fakeResponse));

      userDomain.checkInviteCode(fakeKey)
        .then(function(foundUser) {
          assert.isDefined(foundUser);
          done();
        });
    });

    it('should throw error', function(done) {
      userDomain.checkInviteCode(null)
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'Invalid Invitation Code');
          done();
        });
    });
  });

  describe('deleteAccount', function() {
    beforeEach(function() {
      this.userFindStub = this.sandbox.stub(User, 'findOne');
    });

    it('should delete user', function(done) {
      var fakeUser = {
        username: 'JaneDoe',
        id: 123
      };

      var fakeFoundUser = {
        set: sinon.stub(),
        save: sinon.stub(),
        destroy: sinon.stub().returns(Promise.resolve({})),
        email: 'jane.doe@email.com',
        username: 'JaneDoe'
      };

      this.userFindStub.returns(Promise.resolve(fakeFoundUser));

      userDomain.deleteAccount(fakeUser)
        .then(function(deletedUser) {
          assert.isTrue(fakeFoundUser.destroy.calledOnce);
          assert.isTrue(fakeFoundUser.set.calledWith('username', '~' + fakeFoundUser.username));
          assert.isTrue(fakeFoundUser.set.calledWith('email', '~' + fakeFoundUser.email));
          assert.isTrue(fakeFoundUser.set.calledWith('password', 'deleted-account'));
          assert.isTrue(fakeFoundUser.set.calledWith('password_oauth', null));
          assert.isTrue(fakeFoundUser.set.calledWith('new_password_key', null));
          assert.isTrue(fakeFoundUser.set.calledWith('new_password_requested', null));
          assert.isTrue(fakeFoundUser.set.calledWith('new_email', null));
          assert.isTrue(fakeFoundUser.set.calledWith('new_email_key', null));
          assert.isTrue(fakeFoundUser.set.calledWith('new_email_requested', null));
          assert.isTrue(fakeFoundUser.set.calledWith('activated', 0));
          done();
        });
    });

    it('should not delete user', function(done) {
      var fakeUser = {
        username: 'JaneDoe',
        id: 123
      };

      this.userFindStub.returns(Promise.resolve(null));

      userDomain.deleteAccount(fakeUser)
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'No user found for user ' + fakeUser.username);
          done();
        });
    });

    it('should throw error', function(done) {
      userDomain.deleteAccount(null)
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'Request Invalid');
          done();
        });
    });
  });

  describe('emailAddressInUse', function() {
    beforeEach(function() {
      this.userStub = this.sandbox.stub(User, 'findOne');
    });

    it('should return a result', function(done) {
      var fakeQuery = {
        emailAddress: 'jane.doe@email.com',
        callback: function () {
          return true;
        }
      };

      var fakeResponse = {
        id: 123,
        username: 'JaneDoe'
      };

      this.userStub.returns(Promise.resolve(fakeResponse));

      userDomain.emailAddressInUse(fakeQuery.emailAddress, fakeQuery.callback)
        .then(function(foundUser) {
          assert.isDefined(foundUser);
          done();
        });
    });

    it('should error with missing callback', function(done) {
      var fakeQuery = {
        emailAddress: 'jane.doe@email.com',
        callback: function () {
          return false;
        }
      };

      this.userStub.returns(Promise.resolve(null));

      userDomain.emailAddressInUse(fakeQuery.emailAddress)
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'Request Invalid');
          done();
        });
    });

    it('should error with missing email', function(done) {
      var fakeQuery = {
        callback: function () {
          return false;
        }
      };

      var fakeResponse = {
        id: 123,
        username: 'JaneDoe'
      };

      this.userStub.returns(Promise.resolve(fakeResponse));

      userDomain.emailAddressInUse(null, fakeQuery.callback)
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'Request Invalid');
          done();
        });
    });

    it('should not return a result', function(done) {
      var fakeQuery = {
        emailAddress: 'jane.doe@email.com',
        callback: function () {
          return false;
        }
      };

      this.userStub.returns(Promise.resolve(null));

      userDomain.emailAddressInUse(fakeQuery.emailAddress, fakeQuery.callback)
        .then(function(foundUser) {
          assert.isFalse(foundUser);
          done();
        });
    });

    it('should throw error', function(done) {
      userDomain.emailAddressInUse()
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'Request Invalid');
          done();
        });
    });
  });

  describe('followUser', function() {
    beforeEach(function() {
      this.userStub = this.sandbox.stub(User, 'findOne');
      this.userFollowStub = this.sandbox.stub(UserFollow, 'findOne');
      this.userFollowCreateStub = this.sandbox.stub(UserFollow, 'create');
    });

    it('should return a result for new follow', function(done) {
      var self = this;
      var fakeResponse = {
        dataValues: {
          id: 123,
          username: 'JaneDoe'
        },
        create: sinon.stub(),
        restore: sinon.stub()
      };

      this.userStub.returns(Promise.resolve(fakeResponse));
      this.userFollowStub.returns(Promise.resolve(false));
      this.userFollowCreateStub.returns(Promise.resolve(fakeResponse));

      userDomain.followUser(321, 'JaneDoe')
        .then(function(foundUser) {
          assert.isDefined(foundUser);
          assert.isTrue(self.userFollowCreateStub.calledOnce);
          done();
        });
    });

    it('should return a result for existing follow', function(done) {
      var fakeResponse = {
        dataValues: {
          id: 123,
          username: 'JaneDoe'
        },
        create: sinon.stub(),
        restore: sinon.stub()
      };

      this.userStub.returns(Promise.resolve(fakeResponse));
      this.userFollowStub.returns(Promise.resolve(fakeResponse));
      this.userFollowCreateStub.returns(Promise.resolve(fakeResponse));

      userDomain.followUser(321, 'JaneDoe')
        .then(function(foundUser) {
          assert.isDefined(foundUser);
          done();
        });
    });

    it('should prevent following yourself', function(done) {
      var fakeResponse = {
        id: 123,
        username: 'JaneDoe'
      };

      this.userStub.returns(Promise.resolve(fakeResponse));
      this.userFollowStub.returns(Promise.resolve(fakeResponse));

      userDomain.followUser(123, 'JaneDoe')
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'You Can\'t follow yourself.');
          done();
        });
    });

    it('should throw error for missing user', function(done) {
      var fakeResponse = null;

      this.userStub.returns(Promise.resolve(fakeResponse));
      this.userFollowStub.returns(Promise.resolve(fakeResponse));

      userDomain.followUser(123, 'JaneDoe')
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'No user found for user JaneDoe');
          done();
        });
    });

    it('should throw error for invalid request', function(done) {
      userDomain.followUser()
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'Request Invalid');
          done();
        });
    });
  });

  describe('getFollowers', function() {
    beforeEach(function() {
      this.userStub = this.sandbox.stub(User, 'findOne');
      this.userFollowStub = this.sandbox.stub(UserFollow, 'findAll');
    });

    it('should return followers', function(done) {
      var fakeUsername = 'JaneDoe';
      var fakeUserResponse = {
        id: 123
      };
      var fakeUserFollowResponse = {};

      this.userStub.returns(Promise.resolve(fakeUserResponse));
      this.userFollowStub.returns(Promise.resolve(fakeUserFollowResponse));

      userDomain.getFollowers(fakeUsername)
        .then(function(foundUser) {
          assert.isDefined(foundUser);
          done();
        });
    });

    it('should not return followers', function(done) {
      var fakeUsername = 'JaneDoe';
      var fakeUserFollowResponse = {};

      this.userStub.returns(Promise.resolve(null));
      this.userFollowStub.returns(Promise.resolve(fakeUserFollowResponse));

      userDomain.getFollowers(fakeUsername)
        .then(function(foundUser) {
          assert.isDefined(foundUser);
          done();
        });
    });

    it('should throw error', function(done) {
      userDomain.getFollowers(null)
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'Request Invalid');
          done();
        });
    });
  });

  describe('getFollowing', function() {
    beforeEach(function() {
      this.userStub = this.sandbox.stub(User, 'findOne');
      this.userFollowStub = this.sandbox.stub(UserFollow, 'findAll');
    });

    it('should return followers', function(done) {
      var fakeUsername = 'JaneDoe';
      var fakeUserResponse = {
        id: 123
      };
      var fakeUserFollowResponse = {};

      this.userStub.returns(Promise.resolve(fakeUserResponse));
      this.userFollowStub.returns(Promise.resolve(fakeUserFollowResponse));

      userDomain.getFollowing(fakeUsername)
        .then(function(foundUser) {
          assert.isDefined(foundUser);
          done();
        });
    });

    it('should not return followers', function(done) {
      var fakeUsername = 'JaneDoe';
      var fakeUserFollowResponse = {};

      this.userStub.returns(Promise.resolve(null));
      this.userFollowStub.returns(Promise.resolve(fakeUserFollowResponse));

      userDomain.getFollowing(fakeUsername)
        .then(function(foundUser) {
          assert.isDefined(foundUser);
          done();
        });
    });

    it('should throw error', function(done) {
      userDomain.getFollowing(null)
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'Request Invalid');
          done();
        });
    });
  });

  describe('unfollowUser', function() {
    beforeEach(function() {
      this.userStub = this.sandbox.stub(User, 'findOne');
      this.userFollowStub = this.sandbox.stub(UserFollow, 'findOne');
    });

    it('should return a result for new follow', function(done) {
      var fakeResponse = {
        id: 123,
        username: 'JaneDoe',
        destroy: sinon.stub().returns(Promise.resolve()),
      };

      this.userStub.returns(Promise.resolve(fakeResponse));
      this.userFollowStub.returns(Promise.resolve(fakeResponse));

      userDomain.unfollowUser(321, 'JaneDoe')
        .then(function(foundUser) {
          assert.isTrue(fakeResponse.destroy.calledOnce);
          done();
        });
    });

    it('should fail with messsage saying you cannot unfollow yourself', function(done) {
      var fakeResponse = {
        id: 123,
        username: 'JaneDoe',
        destroy: sinon.stub().returns(Promise.resolve()),
      };

      this.userStub.returns(Promise.resolve(fakeResponse));
      this.userFollowStub.returns(Promise.resolve(fakeResponse));

      userDomain.unfollowUser(123, 'JaneDoe')
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'You Can\'t follow / unfollow yourself.');
          done();
        });
    });

    it('should fail with notice you are not following user', function(done) {
      var fakeResponse = {
        id: 123,
        username: 'JaneDoe',
        destroy: sinon.stub().returns(Promise.resolve()),
      };

      this.userStub.returns(Promise.resolve(fakeResponse));
      this.userFollowStub.returns(Promise.resolve(false));

      userDomain.unfollowUser(321, 'JaneDoe')
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'You are not following JaneDoe');
          done();
        });
    });

    it('should fail with notice no user found', function(done) {
      var fakeResponse = {
        id: 123,
        username: 'JaneDoe',
        destroy: sinon.stub().returns(Promise.resolve()),
      };

      this.userStub.returns(Promise.resolve(null));
      this.userFollowStub.returns(Promise.resolve(false));

      userDomain.unfollowUser(321, 'JaneDoe')
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'No user found for user JaneDoe');
          done();
        });
    });

    it('should throw error for invalid request', function(done) {
      userDomain.unfollowUser()
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'Request Invalid');
          done();
        });
    });
  });

  describe('updateAccount', function() {
    beforeEach(function() {
      this.userStub = this.sandbox.stub(User, 'findOne');
      this.userFollowStub = this.sandbox.stub(UserFollow, 'findOne');
    });

    it('should update account', function() {
      var fakeUserID = 123;
      var fakeIpAddress = '97.96.74.114';
      var fakeUserData = {
        new_username: 'JohnDoe',
        new_email: 'john.doe@email.com',
        new_password: 'abc123'
      };
      var fakeResponse = {
        set: sinon.stub()
      };

      this.userStub.returns(Promise.resolve(fakeResponse));

      userDomain.updateAccount(fakeUserID, fakeUserData, fakeIpAddress)
        .then(function(foundUser) {
          assert.isTrue(fakeResponse.destroy.calledOnce);
          assert.isTrue(fakeFoundUser.set.calledWith('new_email', fakeUserData.new_email));
          assert.isTrue(fakeFoundUser.set.calledWith('new_email_key', randomString.generate(12)));
          assert.isTrue(fakeFoundUser.set.calledWith('new_email_requested', Date.now()));
          done();
        });
    });

    it('should update account without password', function() {
      var fakeUserID = 123;
      var fakeIpAddress = '97.96.74.114';
      var fakeUserData = {
        new_username: 'JohnDoe',
        new_email: 'john.doe@email.com'
      };
      var fakeResponse = {
        set: sinon.stub()
      };

      this.userStub.returns(Promise.resolve(fakeResponse));

      userDomain.updateAccount(fakeUserID, fakeUserData, fakeIpAddress)
        .then(function(foundUser) {
          assert.isTrue(fakeResponse.destroy.calledOnce);
          done();
        });
    });

    it('should update account using new_username only', function() {
      var fakeUserID = 123;
      var fakeIpAddress = '97.96.74.114';
      var fakeUserData = {
        new_username: 'JohnDoe'
      };
      var fakeResponse = {};

      this.userStub.returns(Promise.resolve(fakeResponse));

      userDomain.updateAccount(fakeUserID, fakeUserData, fakeIpAddress)
        .then(function(foundUser) {
          assert.isTrue(fakeResponse.destroy.calledOnce);
          done();
        });
    });

    it('should update account using new_email only', function() {
      var fakeUserID = 123;
      var fakeIpAddress = '97.96.74.114';
      var fakeUserData = {
        new_email: 'john.doe@email.com'
      };
      var fakeResponse = {};

      this.userStub.returns(Promise.resolve(fakeResponse));

      userDomain.updateAccount(fakeUserID, fakeUserData, fakeIpAddress)
        .then(function(foundUser) {
          assert.isTrue(fakeResponse.destroy.calledOnce);
          done();
        });
    });

    it('should update account using new_password only', function() {
      var fakeUserID = 123;
      var fakeIpAddress = '97.96.74.114';
      var fakeUserData = {
        new_password: 'abc123'
      };
      var fakeResponse = {};

      this.userStub.returns(Promise.resolve(fakeResponse));

      userDomain.updateAccount(fakeUserID, fakeUserData, fakeIpAddress)
        .then(function(foundUser) {
          assert.isTrue(fakeResponse.destroy.calledOnce);
          done();
        });
    });

    it('should fail with no matching user', function() {
      var fakeUserID = 123;
      var fakeIpAddress = '97.96.74.114';
      var fakeUserData = {
        new_username: 'JohnDoe',
        new_email: 'john.doe@email.com',
        new_password: 'abc123'
      };

      this.userStub.returns(Promise.resolve(null));

      userDomain.updateAccount(fakeUserID, fakeUserData, fakeIpAddress)
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'No matching user found.');
          done();
        });
    });

    it('should fail with no params', function() {
      userDomain.updateAccount()
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'Request Invalid');
          done();
        });
    });
  });

  describe('usernameInUse', function() {
    beforeEach(function() {
      this.userStub = this.sandbox.stub(User, 'findOne');
    });

    it('should return username is in use', function(done) {
      var fakeUsername = 'JaneDoe';
      var fakeCallback = function() {
        return true;
      };
      var fakeResponse = {
        id: 123,
        username: fakeUsername
      };

      this.userStub.returns(Promise.resolve(fakeResponse));

      userDomain.usernameInUse(fakeUsername, fakeCallback)
        .then(function(foundUser) {
          assert.isDefined(foundUser);
          done();
        });
    });

    it('should return username is not in use', function(done) {
      var fakeUsername = 'JaneDoe';
      var fakeCallback = function() {
        return false;
      };
      var fakeResponse = null;

      this.userStub.returns(Promise.resolve(fakeResponse));

      userDomain.usernameInUse(fakeUsername, fakeCallback)
        .then(function(foundUser) {
          assert.isDefined(foundUser);
          done();
        });
    });

    it('should return invalid request', function(done) {
      var fakeUsername = 'JaneDoe';

      this.userStub.returns(Promise.resolve(null));

      userDomain.usernameInUse(fakeUsername)
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'Invalid Request');
          done();
        });
    });

    it('should throw error', function(done) {
      userDomain.usernameInUse()
        .catch(function(error) {
          assert.isDefined(error);
          assert.isTrue(error === 'Username Check Request Invalid');
          done();
        });
    });
  });
});