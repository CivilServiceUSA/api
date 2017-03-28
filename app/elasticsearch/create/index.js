/**
 * @module elasticsearch/create
 * @version 1.0.2
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

/**
 * Create
 * @type {object}
 */
module.exports = {
  Category: require('./category'),
  CityCouncil: require('./city_council'),
  County: require('./county'),
  Geolocation: require('./geolocation'),
  House: require('./house'),
  Senate: require('./senate'),
  State: require('./state'),
  Tag: require('./tag'),
  User: require('./user')
};
