module.exports = {
  up: function (queryInterface) {
    return queryInterface.bulkInsert('users', [
      {
        activated: true,
        username: 'admin',
        password: '$2a$08$OVrWutoBCqIH2MB6HFyrguwBjy5V8oGR8pUagTsxa5ZBTkXIk2rkG',
        email: 'me@peterschmalfeldt.com',
        first_name: 'Peter',
        last_name: 'Schmalfeldt',
        company_name: 'Manifest Interactive, LLC',
        profile_name: 'Peter Schmalfeldt',
        profile_photo: 'https://peterschmalfeldt.com/images/me.jpg',
        location: 'Saint Petersburg, FL',
        profile_link_website: 'https://peterschmalfeldt.com',
        bio: 'Senior Software Engineer',
        created_date: new Date(),
        modified_date: new Date()
      }
    ], {
      updateOnDuplicate: ['username', 'email']
    });
  },
  down: function (queryInterface) {
    return queryInterface.bulkDelete('users', null, {});
  }
};