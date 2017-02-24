/**
 * @module elasticsearch/update
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Category = require('./category');
var Geolocation = require('./geolocation');
var House = require('./house');
var Senate = require('./senate');
var Tag = require('./tag');
var User = require('./user');

Category.update();
Geolocation.update();
House.update();
Senate.update();
Tag.update();
User.update();

/**
 * Update
 * @type {object}
 */
module.exports = {
  Category: Category,
  Geolocation: Geolocation,
  House: House,
  Senate: Senate,
  Tag: Tag,
  User: User
};
