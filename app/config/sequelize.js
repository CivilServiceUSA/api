/**
 * @module config/sequelize
 */

var Sequelize = require('sequelize');
var config = require('./index');
var env = config.get('env');

var dbName = config.get('database.api.database');
var dbUser = config.get('database.api.username');
var dbPass = config.get('database.api.password');
var dbHost = config.get('database.api.host');

/**
 * Sequelize Options
 * @type {{host: *, port: number, dialect: string, logging: null, define: {freezeTableName: boolean, underscored: boolean, charset: string, collate: string, timestamps: boolean, paranoid: boolean, createdAt: string, updatedAt: string}}}
 */
var dbOptions = {
  host: dbHost,
  port: 3306,
  dialect: 'mysql',
  logging: null,
  define: {
    freezeTableName: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_date',
    updatedAt: 'modified_date'
  }
};

var dbApi = new Sequelize( dbName, dbUser, dbPass, dbOptions );

dbApi.authenticate()
.then(function () {
  // Connection has been established successfully
})
.catch(function (error) {
  if (env !== 'test') {
    console.log('Unable to Connect to ' + dbHost);
    console.log(error);
  }
});

module.exports = {
  dbApi: dbApi
};
