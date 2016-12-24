/**
 * @module logger
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var config = require('./config');
var logger = require('logzio-nodejs');
var log;

/* istanbul ignore if */
if (config.get('env') !== 'test') {
  log = logger.createLogger({
    token: config.get('logzio.token'),
    type: config.get('logzio.type'),
    debug: config.get('logzio.debug')
  });
} else {
  log = {
    debug: function (){ return true; },
    error: function (){ return true; },
    info: function (){ return true; },
    log: function (){ return true; },
    warn: function (){ return true; }
  };
}

module.exports = log;
