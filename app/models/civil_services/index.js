/**
 * @module models/civil_services
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

/**
 * Campaign Zero
 * @type {object}
 */
module.exports = {
  CityCouncil: require('./city_council'),
  House: require('./house'),
  Senate: require('./senate'),
  State: require('./state'),
  ShapeZipCode: require('./shape_zipcode'),
  ZipCode: require('./zipcode')
};
