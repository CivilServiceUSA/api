/**
 * @module external
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var path = require('path');
var fs = require('fs');
var md5 = require('md5');
var request = require('request');
var Promise = require('bluebird');

var config = require('./config');
var logger = require('./logger');

var redisClient = require('./redis');
var redisCacheExpires = config.get('redis.cacheExpire');

/* istanbul ignore next */
module.exports = {
  /**
   * Get External Content
   * @param {string} url - URL of Content to Fetch
   * @returns {bluebird|exports|module.exports}
   */
  getContent: function(url) {
    var cacheKey = md5(url);

    return new Promise(function (resolve, reject) {
      redisClient.get(cacheKey, function (err, result) {
        if (!err && result) {
          resolve(result);
        } else {
          var lib = url.startsWith('https') ? require('https') : require('http');
          var request = lib.get(url, function (response) {
            if (response.statusCode < 200 || response.statusCode > 299) {
              reject(new Error('Failed to load page, status code: ' + response.statusCode));
              logger.log('Failed to load ' + url + ', status code: ' + response.statusCode);
            }

            var body = [];

            response.on('data', function (chunk) { body.push(chunk); });
            response.on('end', function () {
              var content = body.join('');

              if (typeof content === 'object') {
                content = JSON.stringify(content);
              }

              if (!err) {
                redisClient.setex(cacheKey, redisCacheExpires, content);
              } else {
                logger.log('Redis Error: ' + err.code);
              }

              resolve(content);
            });
          });

          request.on('error', function (err) { reject(err); });
        }
      });
    });
  }
};
