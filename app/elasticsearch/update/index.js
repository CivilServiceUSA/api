/**
 * @module elasticsearch/update
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Category = require('./category');
var Geolocation = require('./geolocation');
var Tag = require('./tag');
var User = require('./user');

Category.update();
Geolocation.update();
Tag.update();
User.update();

/**
 * Update
 * @type {object}
 */
module.exports = {
  Category: Category,
  Geolocation: Geolocation,
  Tag: Tag,
  User: User
};
