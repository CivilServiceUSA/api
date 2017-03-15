var assert = require('chai').assert;
var sinon = require('sinon');

var Activity = require('../../../../../app/models/api/user_activity');
var profile = require('../../../../../app/api/v1/domain/profile');

describe('Domain Profile', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be defined', function() {
    assert.isDefined(profile);
  });

  it('getActivity should be defined', function() {
    assert.isDefined(profile.getActivity);
  });

  it('getNotifications should be defined', function() {
    assert.isDefined(profile.getNotifications);
  });

  describe('getActivity', function() {
    beforeEach(function() {
      this.activityFindStub = this.sandbox.stub(Activity, 'findAll');
    });

    it('should return activity', function(done) {
      var fakeUserID = 123;
      var fakeActivity = {
        set: sinon.stub(),
        save: sinon.stub(),
        activity: [
          {
            id: 1,
            user_id: 123,
            follow_user_id: 12,
            type: 'followed_user'
          },
          {
            id: 1,
            user_id: 123,
            follow_user_id: null,
            type: 'login'
          }
        ]
      };

      this.activityFindStub.returns(Promise.resolve(fakeActivity));

      profile.getActivity(fakeUserID)
        .then(function(foundUser) {
          assert.isDefined(foundUser);
          done();
        });
    });

    it('should fail with no userID', function(done) {
      var fakeUserID = 123;

      this.activityFindStub.returns(Promise.reject('No activity found for user ' + fakeUserID));

      profile.getActivity(fakeUserID)
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });

    it('should not return activity', function(done) {
      var fakeUserID = 123;

      this.activityFindStub.returns(Promise.resolve(null));

      profile.getActivity(fakeUserID)
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });
  });

  describe('getNotifications', function() {
    beforeEach(function() {
      this.notificationFindStub = this.sandbox.stub(Activity, 'findAll');
    });

    it('should return notifications', function(done) {
      var fakeUserID = 123;

      this.notificationFindStub.returns(Promise.resolve(fakeUserID));

      profile.getNotifications(fakeUserID)
        .then(function(response) {
          assert.isDefined(response);
          assert.isTrue(response === fakeUserID);
          done();
        });
    });
  });
});