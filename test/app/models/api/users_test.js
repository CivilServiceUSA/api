var assert = require('chai').assert;
var User = require('../../../../app/models/api/users');

describe('Models Users', function() {

  var fakeUser = {};
  var restore = function(){
    fakeUser = {
      id: 1,
      activated: true,
      username: 'JaneDoe',
      password: 'password',
      email: 'jane.doe@email.com',
      first_name: 'Jane',
      last_name: 'Doe',
      company_name: 'My Company',
      profile_name: 'Awesome Sauce',
      profile_photo: 'http://www.mywebsite.com/img/avatar.jpg',
      location: 'Florida, USA',
      profile_link_website: 'http://mywebsite.com',
      profile_link_twitter: 'https://twitter.com/handler',
      banned: false,
      new_email: 'new@email.com',
      new_email_key: '',
      new_email_requested: new Date(),
      new_password: 'abc123',
      new_password_requested: new Date()
    };
  };

  it('should be defined', function() {
    assert.isDefined(User);
  });

  it('publicJSON should be defined', function() {
    restore();

    var user = User.build(fakeUser);

    assert.isDefined(user.publicJSON);
    assert.isFunction(user.publicJSON);
  });

  it('publicJSON should be work', function() {
    restore();

    var user = User.build(fakeUser);
    var json = user.publicJSON();

    assert.isDefined(json);
    assert.isUndefined(user.new_email);
    assert.isUndefined(user.new_email_key);
    assert.isUndefined(user.new_email_requested);
    assert.isUndefined(user.new_password);
    assert.isUndefined(user.new_password_requested);
    assert.isUndefined(user.password);
  });

  it('isActive should be defined', function() {
    restore();

    var user = User.build(fakeUser);

    assert.isDefined(user.isActive);
    assert.isFunction(user.isActive);
  });

  it('isActive should work for valid user', function() {
    restore();

    var user = User.build(fakeUser);
    var isActive = user.isActive();

    assert.isDefined(isActive);
    assert.isTrue(isActive);
  });

  it('isActive should work for banned user', function() {
    restore();

    fakeUser.activated = true;
    fakeUser.banned = true;

    var user = User.build(fakeUser);
    var isActive = user.isActive();

    assert.isDefined(isActive);
    assert.isFalse(isActive);
  });

  it('isActive should work for inactive user', function() {
    restore();

    fakeUser.activated = false;
    fakeUser.banned = false;

    var user = User.build(fakeUser);
    var isActive = user.isActive();

    assert.isDefined(isActive);
    assert.isFalse(isActive);
  });

  it('fullName should be defined', function() {
    restore();

    var user = User.build(fakeUser);

    assert.isDefined(user.fullName);
    assert.isFunction(user.fullName);
  });

  it('fullName should work', function() {
    restore();

    var user = User.build(fakeUser);
    var fullName = user.fullName();

    assert.isDefined(fullName);
    assert.isTrue(fullName === 'Jane Doe');
  });

  it('fullName should return empty string if no name', function() {
    restore();

    fakeUser.first_name = null;
    fakeUser.last_name = null;

    var user = User.build(fakeUser);
    var fullName = user.fullName();

    assert.isDefined(fullName);
    assert.isTrue(fullName === '');
  });
});