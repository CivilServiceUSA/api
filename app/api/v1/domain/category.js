/**
 * @module domain/category
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');

/**
 * Category
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
      'parent_id',
      'slug'
    ];
    var prepared = _.pick(data._source, fields);

    if (data._source.subcategories) {
      prepared.subcategories = _.sortBy(_.map(data._source.subcategories, function(subcat) {
        return _.pick(subcat, fields);
      }), 'name');
    }

    return prepared;
  },

  /**
   * Prepare For Elastic Search
   * @param {object} data - Data to be Processed for Elastic Search
   * @param {number} data.id - Category ID
   * @param {number} data.parent_id - Category Parent ID
   * @param {string} data.name - Category Name
   * @param {string} data.slug - Category Slug
   * @param {object} data.subcategories - Category Subcategories
   * @return {object}
   */
  prepareForElasticSearch: function(data) {
    var prepData = {
      id: data.id,
      parent_id: data.parent_id,
      name: data.name,
      slug: data.slug,
      subcategories: []
    };

    for(var i = 0; i < data.subcategories.length; i++){
      prepData.subcategories.push({
        id: data.subcategories[i].id,
        parent_id: data.subcategories[i].parent_id,
        name: data.subcategories[i].name,
        slug: data.subcategories[i].slug
      });
    }

    return prepData;
  }
};
