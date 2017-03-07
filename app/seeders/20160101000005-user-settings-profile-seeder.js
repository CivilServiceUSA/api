module.exports = {
  up: function (queryInterface) {
    return queryInterface.bulkInsert('user_settings_profile', [
      {
        user_id: 1,
        created_date: new Date(),
        modified_date: new Date()
      }
    ], {
      updateOnDuplicate: ['user_id', 'modified_date']
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
    return queryInterface.bulkDelete('user_settings_profile', null, {});
  }
};