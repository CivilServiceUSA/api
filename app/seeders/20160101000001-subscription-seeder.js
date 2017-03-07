module.exports = {
  up: function (queryInterface) {
    return queryInterface.bulkInsert('subscription_types', [
      {
        status: 'enabled',
        name: 'Professional',
        description: 'API Professional Account',
        monthly_rate: '5.00',
        annual_rate: '50.00',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        status: 'enabled',
        name: 'Small Business',
        description: 'API Small Business Account',
        monthly_rate: '15.00',
        annual_rate: '150.00',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        status: 'enabled',
        name: 'Enterprise ( 5 Members )',
        description: 'API Enterprise Account ( 5 Members )',
        monthly_rate: '30.00',
        annual_rate: '300.00',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        status: 'enabled',
        name: 'Enterprise ( 10 Members )',
        description: 'API Enterprise Account ( 10 Members )',
        monthly_rate: '40.00',
        annual_rate: '400.00',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        status: 'enabled',
        name: 'Enterprise ( 15 Members )',
        description: 'API Enterprise Account ( 15 Members )',
        monthly_rate: '50.00',
        annual_rate: '500.00',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        status: 'enabled',
        name: 'Enterprise ( 20 Members )',
        description: 'API Enterprise Account ( 20 Members )',
        monthly_rate: '60.00',
        annual_rate: '600.00',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        status: 'enabled',
        name: 'Enterprise ( 25 Members )',
        description: 'API Enterprise Account ( 25 Members )',
        monthly_rate: '70.00',
        annual_rate: '700.00',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        status: 'enabled',
        name: 'Enterprise ( 30 Members )',
        description: 'API Enterprise Account ( 30 Members )',
        monthly_rate: '80.00',
        annual_rate: '800.00',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        status: 'enabled',
        name: 'Enterprise ( 35 Members )',
        description: 'API Enterprise Account ( 35 Members )',
        monthly_rate: '90.00',
        annual_rate: '900.00',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        status: 'enabled',
        name: 'Enterprise ( 40 Members )',
        description: 'API Enterprise Account ( 40 Members )',
        monthly_rate: '100.00',
        annual_rate: '1000.00',
        created_date: new Date(),
        modified_date: new Date()
      }
    ], {
      updateOnDuplicate: ['status', 'name', 'description', 'monthly_rate', 'annual_rate', 'modified_date']
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
    return queryInterface.bulkDelete('subscription_types', null, {});
  }
};
