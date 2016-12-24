/**
 * @module domain/email
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var Promise = require('bluebird');
var mandrill = require('mandrill-api/mandrill');
var config = require('../../../config');


/**
 * Email domain services object
 * @type {object}
 */
module.exports = {
  /**
   * Get a Mandrill client with promisified `messages` methods, which means
   * all methods will have an `Async` suffix, e.g. `sendTemplate` becomes
   * `sendTemplateAsync` and can utilize chained `.then()` and `.catch()` calls
   * @return {object}
   */
  getClient: _.memoize(function() {

    var client = new mandrill.Mandrill(config.get('mandrill.key'));

    /* istanbul ignore next */
    Promise.promisifyAll(client.messages, {
      // We need a custom promisifier since Mandrill methods seem to take two callback arguments (success, then error)
      promisifier: function(originalMethod) {
        return function promisified() {
          var self = this;
          var args = [].slice.call(arguments);
          return new Promise(function(resolve, reject) {
            args.push(resolve);
            args.push(reject);
            originalMethod.apply(self, args);
          });
        };
      }
    });

    return client;
  }),

  /**
   * Get Base URL for Web Application
   * @returns {string} Base URL for Web App
   */
  getBaseURL: function(){
    switch(config.get('env')){
      case 'local':
        return 'http://127.0.0.1:5050';
      case 'staging':
        return 'https://staging.website.com';
      case 'production':
        return 'https://website.com';
    }
  },

  /**
   * Send a user email using the passed in templateSlug matching a template created
   * on Mandrill, and the user object
   * @param  {string} templateSlug Template slug matching a template on the configured Mandrill account
   * @param  {object} user         User Sequelize model instance
   * @param  {string} geolocation  Additional Grolocation Data
   * @param  {string} optionalData  Optional  data to pass into template
   * @return {object}              Returns a promise object
   */
  sendUserEmail: function(templateSlug, user, geolocation, optionalData) {

    var templateVariables = _.map(user.publicJSON(), function(value, key) {
      return {
        name: key,
        content: value
      };
    });

    /* istanbul ignore next */
    switch(templateSlug){

      case 'change-email-confirmation':
        templateVariables.push(
          {
            name: 'confirm_link',
            content: this.getBaseURL() + '/confirm/email/' + user.get('new_email_key')
          },
          {
            name: 'map_link',
            content: 'https://www.google.com/maps/place/' + geolocation.latitude + ',' + geolocation.longitude
          },
          {
            name: 'new_email',
            content: optionalData.new_email
          },
          {
            name: 'city',
            content: geolocation.cityName
          },
          {
            name: 'state',
            content: geolocation.regionName
          },
          {
            name: 'zip_code',
            content: geolocation.zipCode
          },
          {
            name: 'ip_address',
            content: geolocation.ipAddress
          },
          {
            name: 'state',
            content: geolocation.regionName
          }
        );
        break;

      case 'change-password-confirmation':
        templateVariables.push(
          {
            name: 'confirm_link',
            content: this.getBaseURL() + '/confirm/password/' + user.get('new_password_key')
          },
          {
            name: 'map_link',
            content: 'https://www.google.com/maps/place/' + geolocation.latitude + ',' + geolocation.longitude
          },
          {
            name: 'city',
            content: geolocation.cityName
          },
          {
            name: 'state',
            content: geolocation.regionName
          },
          {
            name: 'zip_code',
            content: geolocation.zipCode
          },
          {
            name: 'ip_address',
            content: geolocation.ipAddress
          },
          {
            name: 'state',
            content: geolocation.regionName
          }
        );
        break;

      case 'change-username-notice':
        templateVariables.push(
          {
            name: 'profile_link',
            content: this.getBaseURL() + '/' + user.get('username')
          },
          {
            name: 'username',
            content: optionalData.new_username
          },
          {
            name: 'old_username',
            content: optionalData.username || ''
          },
          {
            name: 'map_link',
            content: 'https://www.google.com/maps/place/' + geolocation.latitude + ',' + geolocation.longitude
          },
          {
            name: 'city',
            content: geolocation.cityName
          },
          {
            name: 'state',
            content: geolocation.regionName
          },
          {
            name: 'zip_code',
            content: geolocation.zipCode
          },
          {
            name: 'ip_address',
            content: geolocation.ipAddress
          },
          {
            name: 'state',
            content: geolocation.regionName
          }
        );
        break;

      case 'forgot-password':
        templateVariables.push(
          {
            name: 'reset_link',
            content: this.getBaseURL() + '/reset-password/' + user.get('new_password_key')
          },
          {
            name: 'map_link',
            content: 'https://www.google.com/maps/place/' + geolocation.latitude + ',' + geolocation.longitude
          },
          {
            name: 'city',
            content: geolocation.cityName
          },
          {
            name: 'state',
            content: geolocation.regionName
          },
          {
            name: 'zip_code',
            content: geolocation.zipCode
          },
          {
            name: 'ip_address',
            content: geolocation.ipAddress
          },
          {
            name: 'state',
            content: geolocation.regionName
          }
        );
        break;

      case 'password-reset':
        templateVariables.push(
          {
            name: 'map_link',
            content: 'https://www.google.com/maps/place/' + geolocation.latitude + ',' + geolocation.longitude
          },
          {
            name: 'city',
            content: geolocation.cityName
          },
          {
            name: 'state',
            content: geolocation.regionName
          },
          {
            name: 'zip_code',
            content: geolocation.zipCode
          },
          {
            name: 'ip_address',
            content: geolocation.ipAddress
          },
          {
            name: 'state',
            content: geolocation.regionName
          }
        );
        break;

      case 'registration-confirmation':
        templateVariables.push({
          name: 'confirm_link',
          content: this.getBaseURL() + '/confirm/account/' + user.get('new_email_key')
        });
        break;

    }

    /* istanbul ignore next */
    var message = {
      to: [{
        email: user.get('email'),
        name: user.fullName() || user.get('email')
      }],
      merge_vars: [{
        rcpt: user.get('email'),
        vars: templateVariables
      }]
    };

    // If changing email addresses, send to both new and old email
    /* istanbul ignore next */
    if(templateSlug === 'change-email-confirmation' && optionalData.new_email){
      message.to.push({
        email: optionalData.new_email,
        name: user.fullName() || optionalData.new_email
      });

      message.merge_vars.push({
        rcpt: optionalData.new_email,
        vars: templateVariables
      });
    }

    return this
      .getClient()
      .messages.sendTemplateAsync({
        template_name: templateSlug,
        template_content: templateVariables,
        message: message
      });
  },

  /**
   * Send a confirmation email to the passed in user
   * @param  {object} user Sequelize User model instance object
   * @return {object}      Returns promise from sendUserEmail
   */
  sendUserConfirmationEmail: function(user) {
    return this.sendUserEmail('registration-confirmation', user);
  },

  /**
   * Send a forgotten password to the passed in user
   * @param  {object} user Sequelize User model instance object
   * @param  {object} geolocation IP2Location JSON Object
   * @return {object}      Returns promise from sendUserEmail
   */
  sendUserForgotPasswordEmail: function(user, geolocation) {
    return this.sendUserEmail('forgot-password', user,  geolocation);
  },

  /**
   * Send a forgotten password to the passed in user
   * @param  {object} user Sequelize User model instance object
   * @param  {object} geolocation IP2Location JSON Object
   * @return {object}      Returns promise from sendUserEmail
   */
  sendUserPasswordResetEmail: function(user, geolocation) {
    return this.sendUserEmail('password-reset', user, geolocation);
  },

  /**
   * Send notification email if user changed username
   * @param  {object} user Sequelize User model instance object
   * @param  {object} geolocation IP2Location JSON Object
   * @param  {string} optionalData  Optional  data to pass into template
   * @return {object}      Returns promise from sendUserEmail
   */
  sendChangedUsernameEmail: function(user, geolocation, optionalData) {
    return this.sendUserEmail('change-username-notice', user, geolocation, optionalData);
  },

  /**
   * Send confirmation email if user changed email
   * @param  {object} user Sequelize User model instance object
   * @param  {object} geolocation IP2Location JSON Object
   * @param  {string} optionalData  Optional  data to pass into template
   * @return {object}      Returns promise from sendUserEmail
   */
  sendConfirmChangedEmailAddressEmail: function(user, geolocation, optionalData) {
    return this.sendUserEmail('change-email-confirmation', user, geolocation, optionalData);
  },

  /**
   * Send confirmation email if user changed password
   * @param  {object} user Sequelize User model instance object
   * @param  {object} geolocation IP2Location JSON Object
   * @param  {string} optionalData  Optional  data to pass into template
   * @return {object}      Returns promise from sendUserEmail
   */
  sendConfirmChangedPasswordEmail: function(user, geolocation, optionalData) {
    return this.sendUserEmail('change-password-confirmation', user, geolocation, optionalData);
  }
};
