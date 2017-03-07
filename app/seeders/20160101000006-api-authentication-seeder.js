module.exports = {
  up: function (queryInterface) {
    return queryInterface.bulkInsert('api_authentication', [
      {
        user_id: 1,
        approved_whitelist: '127.0.0.1,127.0.0.1:5000,127.0.0.1:63342,localhost,localhost:5000,localhost:63342',
        api_key: '7E07D864-209A-F9E4-819F-2DD7E76B6F24',
        api_secret: '6A126F89-10BD-DCB4-79CF-4BFC73AB3987',
        allow_api_get: 1,
        allow_api_post: 1,
        allow_api_put: 1,
        allow_api_delete: 1,
        allow_content_management: 1,
        allow_user_registration: 1,
        app_name: 'Administrator',
        app_type: 'developer',
        app_purpose: 'API Administrator',
        app_description: 'API Administrator',
        status: 'approved',
        daily_limit: 0,
        created_date: new Date(),
        modified_date: new Date()
      }
    ], {
      updateOnDuplicate: ['user_id', 'approved_whitelist', 'api_key', 'api_secret', 'allow_api_get', 'allow_api_post', 'allow_api_put', 'allow_api_delete', 'allow_content_management', 'allow_user_registration', 'app_name', 'app_type', 'app_purpose', 'app_description', 'status', 'daily_limit', 'modified_date']
    }).catch(function (err) {
      if (err && err.errors) {
        for (var i = 0; i < err.errors.length; i++) {
          console.error('× SEED ERROR', err.errors[i].type, err.errors[i].message, err.errors[i].path, err.errors[i].value);
        }
      } else if (err && err.message) {
        console.error('× SEED ERROR', err.message);
      }
    });
  },
  down: function (queryInterface) {
    return queryInterface.bulkDelete('api_authentication', null, {});
  }
};



