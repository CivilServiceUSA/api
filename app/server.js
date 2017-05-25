#!/usr/bin/env node

/**
 * @module server
 * @version 1.0.4
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

require('dotenv').config({silent: true});

var rateLimit = require('express-rate-limit');
var express = require('express');
var shrinkRay = require('shrink-ray');
var bodyParser = require('body-parser');
var debug = require('debug')('express:civilservices');
var config = require('./config');
var router = require('./router');
var bugsnag = require('bugsnag');
var session = require('express-session');
var uuid = require('uuid');
var model = require('./models');
var logger = require('./logger');
var analytics = require('./analytics');
var app = express();
var apiUser = {};
var apiLimit = {
  delayAfter: 0,
  delayMs: 0,
  windowMs: 24 * 60 * 60 * 1000,
  max: 2500
};
var limiter = rateLimit(apiLimit);
var routerUtil = require('./api/v1/routes/util.js');

process.title = 'api';

var sess;

// Setup Bugsnag
bugsnag.register(config.get('bugsnag'), {
  packageJSON: '../package.json',
  onUncaughtError: function(err) {
    logger.log(err.stack || err);
  }
});

/**
 * Should Compress
 * @param req
 * @param res
 * @returns {*}
 */
/* istanbul ignore next */
function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    return false;
  }

  return shrinkRay.filter(req, res);
}

/* istanbul ignore next */
function setupAPI(request, response, next) {
  if ('pretty' in request.query && request.query.pretty !== 'false') {
    app.set('json spaces', 2);
  }

  var host = request.headers.origin;
  var acceptedMethods = ['OPTIONS'];

  if(request.header('API-Key')){
    request.query.apikey = request.header('API-Key');
  }

  if(request.headers.host){
    apiUser.host = request.headers.host;
  }

  if (request.query.apikey) {

    analytics.trackEvent(request.query.apikey, 'API Key', request.query.apikey, request.url);

    return model.API.ApiAuthentication.findOne({ where: { api_key: request.query.apikey }}).then(function(user){

      if(user){
        var settings = user.dataValues;

        if (settings.allow_api_get) {
          acceptedMethods.push('GET');
        }

        if (settings.allow_api_post) {
          acceptedMethods.push('POST');
        }

        if (settings.allow_api_put) {
          acceptedMethods.push('PUT');
        }

        if (settings.allow_api_delete) {
          acceptedMethods.push('DELETE');
        }

        // Allow OPTIONS from all hosts
        if(request.method === 'OPTIONS'){
          host = '*';
        }

        response.setHeader('X-Powered-By', 'API');
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.setHeader('Access-Control-Allow-Headers', 'Accept, Access-Control-Allow-Methods, Authorization, Content-Type, X-Powered-By');
        response.setHeader('Access-Control-Allow-Methods', acceptedMethods.join(', '));

        if (host) {
          response.setHeader('Access-Control-Allow-Origin', host);
        }

        if (!settings.allow_api_get && request.method === 'GET') {
          analytics.trackEvent(request.query.apikey, request.method, 'Request Denied', request.url);
          return response.status(403).end(JSON.stringify(routerUtil.createAPIResponse({
            errors: ['API Key does not support GET Requests']
          })));
        }

        if (!settings.allow_api_post && request.method === 'POST') {
          analytics.trackEvent(request.query.apikey, request.method, 'Request Denied', request.url);

          return response.status(403).end(JSON.stringify(routerUtil.createAPIResponse({
            errors: ['API Key does not support POST Requests']
          })));
        }

        if (!settings.allow_api_put && request.method === 'PUT') {
          analytics.trackEvent(request.query.apikey, request.method, 'Request Denied', request.url);

          return response.status(403).end(JSON.stringify(routerUtil.createAPIResponse({
            errors: ['API Key does not support PUT Requests']
          })));
        }

        if (!settings.allow_api_delete && request.method === 'DELETE') {
          analytics.trackEvent(request.query.apikey, request.method, 'Request Denied', request.url);
          return response.status(403).end(JSON.stringify(routerUtil.createAPIResponse({
            errors: ['API Key does not support DELETE Requests']
          })));
        }

        // Check for approved host
        if(settings.approved_whitelist && settings.approved_whitelist !== '*'){
          var whitelist = settings.approved_whitelist.split(',');
          var validHost = false;

          for (var i = 0; i < whitelist.length; i++) {
            if (whitelist.indexOf(apiUser.host) !== -1) {
              validHost = true;
              break;
            }
          }

          if( !validHost) {
            analytics.trackEvent(request.query.apikey, 'Invalid Host', apiUser.host, request.url);
            return response.status(401).send(JSON.stringify(routerUtil.createAPIResponse({
              errors: ['Invalid Host for API Key']
            })));
          }
        }

        // Set API Limits
        apiLimit.max = (!isNaN(settings.daily_limit)) ? (parseInt(settings.daily_limit, 10)) : 1000;
        limiter = rateLimit(apiLimit);

        next();

      } else {
        analytics.trackEvent(request.query.apikey, request.method, 'Invalid API Key', request.url);
        return response.status(401).end(JSON.stringify(routerUtil.createAPIResponse({
          errors: ['Invalid API Key']
        })));
      }
    }).catch(function(err){
      analytics.trackEvent(request.query.apikey, request.method, 'Invalid API Authentication', request.url);
      return response.status(401).end(JSON.stringify(routerUtil.createAPIResponse({
        errors: ['Invalid API Authentication']
      })));
    });
  } else {
    analytics.trackEvent(request.query.apikey, request.method, 'Missing API Key', request.url);
    return response.status(401).end(JSON.stringify(routerUtil.createAPIResponse({
      errors: ['Missing API Key']
    })));
  }

  next();
}

app.enable('trust proxy');

/**
 * Allow for Timeout JSON Response
 */
/* istanbul ignore next */
app.use(function(req, res, next){
  res.setTimeout(5000, function(){
    if(req.header('API-Key')){
      req.query.apikey = req.header('API-Key');
    }
    analytics.trackEvent(req.query.apikey, 'Error', 'Request Timed Out', req.url);
    res.status(408).end(JSON.stringify(routerUtil.createAPIResponse({
      errors: ['Request Timed Out']
    })));
  });

  next();
});

/* istanbul ignore next */
app.use(session({
  genid: function(){ return uuid.v4(); },
  secret: config.get('sessionKey'),
  resave: true,
  saveUninitialized: true
}));

app.use('/', express.static(__dirname + '/static'));
app.use('/assets', express.static(__dirname + '/static/assets'));
app.use('/index.html', express.static(__dirname + '/static/index.html'));
app.use('/favicon.ico', express.static(__dirname + '/static/favicon.ico'));
app.use('/robots.txt', express.static(__dirname + '/static/robots.txt'));
app.use('/humans.txt', express.static(__dirname + '/static/humans.txt'));
app.use('/docs.js', express.static(__dirname + '/static/docs.js'));
app.use('/docs.css', express.static(__dirname + '/static/docs.css'));
app.use('/docs', express.static(__dirname + '/static/docs'));
app.use('/guide', express.static(__dirname + '/static/guide'));
app.use('/.well-known', express.static(__dirname + '/.well-known'));

app.use(setupAPI);
app.use(shrinkRay({ filter: shouldCompress }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(limiter);
app.use(router);

// Fallback for Possible Routes used that do not exist
/* istanbul ignore next */
app.get('*', function (req, res) {
  if(req.header('API-Key')){
    req.query.apikey = req.header('API-Key');
  }

  analytics.trackEvent(req.query.apikey, req.method, 'Invalid URL', req.url);
  res.status(404).end(JSON.stringify(routerUtil.createAPIResponse({
    errors: [
      'The API Endpoint you are trying to access does not exist.',
      'Please view our Documentation for API Usage Instructions.',
      'http://docs.civilservices.apiary.io'
    ]
  })));
});

/**
 * Event listener for HTTP server "error" event.
 */
/* istanbul ignore next */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var port = config.get('port');
  var bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
/* istanbul ignore next */
function onListening() {
  var addr = app.address();
  var bind = (typeof addr === 'string') ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

app.on('error', onError);
app.on('listening', onListening);

module.exports = app.listen(config.get('port'));
module.exports.setupAPI = setupAPI;
