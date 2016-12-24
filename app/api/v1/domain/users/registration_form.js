/**
 * @module domain/util/registration_form
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var validate = require('validate.js');
var BaseForm = require('../../../../forms/base');
var User = require('../../../../models/api/users');

/**
 * Registration Form Validation
 * @type {object}
 */
module.exports = BaseForm.extend({
  constraints: {
    username: {
      presence: true,
      length: {
        minimum: 3,
        maximum: 30,
        tooShort: 'must be at least 3 characters',
        tooLong: 'must be no more than 30 characters'
      },
      format: {
        pattern: '[a-z0-9_]+',
        flags: 'i',
        message: 'can only contain A - Z, 0 - 9, and _ characters'
      },
      modelFieldValueUnique: {
        model: User,
        field: 'username'
      }
    },
    password: {
      presence: true,
      length: {
        minimum: 3,
        maximum: 30,
        tooShort: 'must be at least 3 characters',
        tooLong: 'must be no more than 30 characters'
      }
    },
    email: {
      presence: true,
      email: true,
      modelFieldValueUnique: {
        model: User,
        field: 'email'
      }
    },
    inviteCode: {
      presence: true
    },
    agree: {
      presence: true
    },
    first_name: {
      presence: false
    },
    last_name: {
      presence: false
    },
    bio: {
      presence: false
    },
    company_name: {
      presence: false
    },
    location: {
      presence: false
    },
    profile_link_twitter: {
      presence: false
    },
    profile_link_website: {
      presence: false
    },
    profile_name: {
      presence: false
    },
    profile_photo: {
      presence: false
    }
  }
});
