/**
 * @module domain/tag
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');

/**
 * Domain Tag
 * @type {object}
 */
module.exports = {
  /**
   * Prepare For API Output
   * @param {object} data - Data to be processed for API Output
   * @return {object}
   */
  prepareForAPIOutput: function(data) {
    var fields = [
      'name',
      'slug'
    ];
    return _.pick(data._source, fields);
  },

  /**
   * Prepare For Elastic Search
   * @param {object} data - Data to be Processed for Elastic Search
   * @param {object} data.id - Tag ID
   * @param {object} data.name - Tag Name
   * @param {object} data.slug - Tag Slug
   * @return {object}
   */
  prepareForElasticSearch: function(data) {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug
    };
  }
};
