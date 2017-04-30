var assert = require('chai').assert;
var CityCouncil = require('../../../../app/models/civil_services/city_council');

describe('Models City Council', function() {

  var fakeCityCouncil = {};
  var restore = function(){
    fakeCityCouncil = {
      id: 1,
      state_name: "New York",
      state_name_slug: "new-york",
      state_code: "NY",
      state_code_slug: "ny",
      city_name: "New York",
      city_name_slug: "new-york",
      district: 1,
      at_large: false,
      vacant: false,
      title: "councilor",
      party: "democrat",
      name: "Margaret Chin",
      name_slug: "margaret-chin",
      first_name: "Margaret",
      middle_name: "Margaret",
      last_name: "Chin",
      name_suffix: null,
      goes_by: null,
      pronunciation: null,
      gender: "female",
      ethnicity: "asian-american",
      date_of_birth: "1954-05-26",
      entered_office: "2014-01-01",
      term_end: "2017-12-31",
      email: "chin@council.nyc.gov",
      phone: "212-587-3159",
      latitude: 40.6643,
      longitude: -73.9385,
      address_complete: "250 Broadway Suite 1823 New York, NY 10007",
      address_number: 250,
      address_prefix: null,
      address_street: "Broadway",
      address_sec_unit_type: "Suite",
      address_sec_unit_num: 1823,
      address_city: "New York",
      address_state: "NY",
      address_zipcode: 10007,
      address_type: null,
      population: 8550405,
      background_url: "https://cdn.civil.services/city-council/ny/new-york/backgrounds/1280x720/city.jpg",
      city_government_url: "http://www.nycgo.com",
      city_council_url: "http://council.nyc.gov/districts/",
      city_council_calendar_url: null,
      city_council_legislation_url: "http://legistar.council.nyc.gov/Legislation.aspx",
      city_council_committees_url: "http://legistar.council.nyc.gov/Departments.aspx",
      twitter_handle: "CM_MargaretChin",
      twitter_url: "https://twitter.com/CM_MargaretChin",
      facebook_url: "https://www.facebook.com/councilmembermargaret.chin",
      photo_url: "https://cdn.civil.services/city-council/ny/new-york/headshots/512x512/margaret-chin.jpg",
      shape: {},
      created_date: new Date(),
      modified_date: new Date()
    };
  };

  it('should be defined', function() {
    assert.isDefined(CityCouncil);
  });

  it('publicJSON should be defined', function() {
    restore();

    var user = CityCouncil.build(fakeCityCouncil);

    assert.isDefined(user.getAliases);
    assert.isFunction(user.getAliases);
  });

  it('getAliases should work', function() {
    restore();

    var city_council = CityCouncil.build(fakeCityCouncil);
    var aliases = city_council.getAliases();

    assert.isDefined(aliases);
    assert.isArray(aliases);
    assert.isTrue(aliases.length === 6);
  });

  it('getAliases should fail', function() {
    restore();

    var city_council = CityCouncil.build({});
    var aliases = city_council.getAliases();

    assert.isDefined(aliases);
    assert.isArray(aliases);
    assert.isTrue(aliases.length === 0);
  });
});