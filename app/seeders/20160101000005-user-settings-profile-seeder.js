module.exports = {
  up: function (queryInterface) {
    return queryInterface.bulkInsert('user_settings_profile', [
      {
        user_id: 1,
        created_date: new Date(),
        modified_date: new Date()
      }
    ], {
      updateOnDuplicate: ['user_id']
    });
  },
  down: function (queryInterface) {
    return queryInterface.bulkDelete('user_settings_profile', null, {});
  }
};