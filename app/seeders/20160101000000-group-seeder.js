module.exports = {
  up: function (queryInterface) {
    return queryInterface.bulkInsert('groups', [
      {
        name: 'API Developer',
        slug: 'api-developer',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        name: 'Administrator',
        slug: 'administrator',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        name: 'Alpha Tester',
        slug: 'alpha-tester',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        name: 'Beta Tester',
        slug: 'beta-tester',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        name: 'Corporation',
        slug: 'corporation',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        name: 'Pro Bono',
        slug: 'pro-bono',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        name: 'Staff',
        slug: 'staff',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        name: 'Paid User',
        slug: 'paid-user',
        created_date: new Date(),
        modified_date: new Date()
      }
    ], {
      updateOnDuplicate: ['name', 'slug', 'modified_date']
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
    return queryInterface.bulkDelete('groups', null, {});
  }
};
