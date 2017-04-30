/**
 * @module redis
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var config = require('./config');
var logger = require('./logger');

var redis = require('redis');

/* istanbul ignore next */
var redisClient = redis.createClient(config.get('redis.port'), config.get('redis.host'), {
  retry_strategy: function (options) {
    if (options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.times_connected > 10) {
      return undefined;
    }
    return Math.max(options.attempt * 100, 3000);
  }
});

/* istanbul ignore next */
redisClient.on('error', function (err) {
  if (config.get('env') !== 'test') {
    console.error('Redis Error: ', err.code);
  }
});

/* istanbul ignore next */
if (config.get('redis.password')) {
  redisClient.auth(config.get('redis.password'));
}

module.exports = redisClient;