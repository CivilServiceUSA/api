/**
 * @module routes
 * @version 1.1.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var express = require('express');
var config = require('../../../config');

var indexer = require('./indexer');
var apiUser = require('./user');
var categories = require('./categories');
var cityCouncil = require('./city_council');
var government = require('./government');
var governor = require('./governor');
var house = require('./house');
var legislators = require('./legislators');
var profile = require('./profile');
var search = require('./search');
var senate = require('./senate');
var settings = require('./settings');
var state = require('./state');
var tags = require('./tags');
var token = require('./token');
var unauthorized = require('./unauthorized');
var zipcode = require('./geolocation');

var API_VERSION = config.get('version');

var router = express.Router(config.router);

router.use('/' + API_VERSION + '/', indexer);
router.use('/' + API_VERSION + '/', apiUser);
router.use('/' + API_VERSION + '/', categories);
router.use('/' + API_VERSION + '/', cityCouncil);
router.use('/' + API_VERSION + '/', government);
router.use('/' + API_VERSION + '/', governor);
router.use('/' + API_VERSION + '/', house);
router.use('/' + API_VERSION + '/', legislators);
router.use('/' + API_VERSION + '/', profile);
router.use('/' + API_VERSION + '/', search);
router.use('/' + API_VERSION + '/', senate);
router.use('/' + API_VERSION + '/', settings);
router.use('/' + API_VERSION + '/', state);
router.use('/' + API_VERSION + '/', tags);
router.use('/' + API_VERSION + '/', token);
router.use('/' + API_VERSION + '/', unauthorized);
router.use('/' + API_VERSION + '/', zipcode);

module.exports = router;
