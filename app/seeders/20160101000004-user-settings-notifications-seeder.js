module.exports = {
  up: function (queryInterface) {
    return queryInterface.bulkInsert('user_settings_notifications', [
      {
        user_id: 1,
        email_comment_left: true,
        email_comment_liked: true,
        email_someone_follows: true,
        email_mentioned_in_comment: true,
        web_comment_left: true,
        web_comment_liked: true,
        web_someone_follows: true,
        web_mentioned_in_comment: true,
        newsletter: true,
        created_date: new Date(),
        modified_date: new Date()
      }
    ], {
      updateOnDuplicate: ['user_id']
    });
  },
  down: function (queryInterface) {
    return queryInterface.bulkDelete('user_settings_notifications', null, {});
  }
};