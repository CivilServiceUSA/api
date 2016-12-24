module.exports = {
  up: function (queryInterface) {
    return queryInterface.bulkInsert('user_group', [
      {
        user_id: 1,
        group_id: 2,
        created_date: new Date(),
        modified_date: new Date()
      }
    ], {
      updateOnDuplicate: ['user_id', 'group_id']
    });
  },
  down: function (queryInterface) {
    return queryInterface.bulkDelete('user_group', null, {});
  }
};