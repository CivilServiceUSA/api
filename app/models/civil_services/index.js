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
  Bills: require('./bills'),
  CityCouncil: require('./city_council'),
  PoliceKillings: require('./police_killings'),
  ZipCode: require('./zipcode')
};
