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
      updateOnDuplicate: ['user_id', 'email_comment_left', 'email_comment_liked', 'email_someone_follows', 'email_mentioned_in_comment', 'web_comment_left', 'web_comment_liked', 'web_someone_follows', 'web_mentioned_in_comment', 'newsletter', 'modified_date']
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
    return queryInterface.bulkDelete('user_settings_notifications', null, {});
  }
};