var validate = require('validate.js');

validate.validators.modelFieldValueUnique = function(value, params, data) {
  return new validate.Promise(function(resolve, reject) {
    var conditions = {where: {}};
    conditions.where[params.field] = value;
    params.model
      .findOne(conditions)
      .then(function(result) {
        if (result) {
          resolve('is already in use');
        } else {
          resolve();
        }
      });
  });
};
