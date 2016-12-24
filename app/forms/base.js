var Promise = require('bluebird');
var validate = require('validate.js');
var Base = require('class-extend');

validate.Promise = Promise;

require('./validators');

/**
 * Base interface for form validation objects on the site
 */
module.exports = Base.extend({
  constraints: {},

  validate: function(data) {
    return validate.async(data, this.constraints);
  }
});
