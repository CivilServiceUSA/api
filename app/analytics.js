/**
 * @module analytics
 * @version 1.1.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var async = require('async');
var request = require('request');
var config = require('./config');

function trackEvent (apikey, category, action, label, value) {

  if (config.get('devFlags.enableBugTracking') && config.get('analytics')) {

    // Convert Objects to String
    if (typeof category === 'object') {
      category = JSON.stringify(category);
    }
    if (typeof action === 'object') {
      action = JSON.stringify(action);
    }
    if (typeof label === 'object') {
      label = JSON.stringify(label);
    }

    // Remove API Key from Params
    label = label.replace('apikey=' + apikey, '').replace('"apikey":"' + apikey + '",', '').replace('"apikey":"' + apikey + '"', '');

    var data = {
      v: '1',
      tid: config.get('analytics'),
      cid: apikey || '49A50B59-BBD7-EC84-FD97-C0AA262B0F16',
      t: 'event',
      ec: category,
      ea: action,
      el: label,
      ev: value
    };

    var requests = [{
      url: 'http://www.google-analytics.com/collect',
      method: 'POST',
      form: data
    }];

    /* istanbul ignore next */
    if (config.get('env') !== 'test') {
      async.map(requests, function(fetch) {
        request(fetch);
      });
    }

    return requests;
  }
}

module.exports = {
  trackEvent: trackEvent
};
