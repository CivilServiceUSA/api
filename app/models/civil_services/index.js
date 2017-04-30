/**
 * @module models/civil_services
 * @version 1.1.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

/**
 * Civil Services
 * @type {object}
 */
module.exports = {
  CityCouncil: require('./city_council'),
  County: require('./county'),
  Governor: require('./governor'),
  House: require('./house'),
  Senate: require('./senate'),
  State: require('./state'),
  ZipCode: require('./zipcode')
};
