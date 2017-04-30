var chai = require('chai');

process.on('unhandledRejection', function (err) {});

chai.use(require('chai-passport-strategy'));
