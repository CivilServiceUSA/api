/**
 * @module domain/util
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');

/**
 * Doing domain utilities
 * @type {Object}
 */
module.exports = {
  /**
   * Takes a string of comma-separated numbers, e.g. "1,5,7", splits by comma and returns an array of integers, pruning out anything that's not an integer
   * @param  {string} str Comma-separated numbers
   * @return {array}
   */
  normalizeCommaSeparatedIntegers: function(str) {
    var ints = _.compact(_.map(str.split(','), function(raw) {
      var num = parseInt(_.trim(raw), 10);
      /* istanbul ignore else */
      if (_.isNumber(num)) {
        return num;
      } else {
        return null;
      }
    }));

    return ints && ints.length ? ints : null;
  }
};
