/**
 * @module elasticsearch/update
 * @version 1.1.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Category = require('./category');
var CityCouncil = require('./city_council');
var County = require('./county');
var Geolocation = require('./geolocation');
var Governor = require('./governor');
var House = require('./house');
var Senate = require('./senate');
var State = require('./state');
var Tag = require('./tag');
var User = require('./user');

Category.update();
CityCouncil.update();
County.update();
Geolocation.update();
Governor.update();
House.update();
Senate.update();
State.update();
Tag.update();
User.update();

/**
 * Update
 * @type {object}
 */
module.exports = {
  Category: Category,
  CityCouncil: CityCouncil,
  County: County,
  Geolocation: Geolocation,
  Governor: Governor,
  House: House,
  Senate: Senate,
  State: State,
  Tag: Tag,
  User: User
};
