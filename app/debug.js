/**
 * @module debug
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var colors = require('colors');
var config = require('./config');

// Set Console Colors
colors.setTheme({
  success: 'green',
  info: 'blue',
  debug: 'cyan',
  warn: 'yellow',
  error: 'red',
  update: 'gray'
});

var debugEnabled = config.get('debug');

/* istanbul ignore next */
var Debugger = {
  success: function(message){
    if(debugEnabled) {
      console.log(colors.success('✔ ' + message));
    }
  },
  error: function(message){
    if(debugEnabled) {
      console.log(colors.error('× ' + message));
    }
  },
  warn: function(message){
    if(debugEnabled) {
      console.log(colors.warn('» ' + message));
    }
  },
  debug: function(message){
    if(debugEnabled) {
      console.log(colors.debug('» ' + message));
    }
  },
  info: function(message){
    if(debugEnabled) {
      console.log(colors.info('» ' + message));
    }
  },
  update: function(message){
    if(debugEnabled) {
      console.log(colors.update('✔ ' + message));
    }
  },
  log: function(message){
    if(debugEnabled) {
      console.log('› ' + message);
    }
  }
};

module.exports = Debugger;
