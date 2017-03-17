/**
 * @module elasticsearch/update
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Category = require('./category');
var County = require('./county');
var Geolocation = require('./geolocation');
var House = require('./house');
var Senate = require('./senate');
var State = require('./state');
var Tag = require('./tag');
var User = require('./user');

Category.update();
County.update();
Geolocation.update();
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
  County: County,
  Geolocation: Geolocation,
  House: House,
  Senate: Senate,
  State: State,
  Tag: Tag,
  User: User
};
