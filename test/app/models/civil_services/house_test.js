var assert = require('chai').assert;
var House = require('../../../../app/models/civil_services/house');

describe('Models House', function() {

  var fakeHouse = {};
  var restore = function(){
    fakeHouse = {
      id: 1,
      state_name: "Alaska",
      state_name_slug: "alaska",
      state_code: "AK",
      state_code_slug: "ak",
      district: null,
      at_large: true,
      vacant: false,
      bioguide: "Y000033",
      thomas: "1256",
      opensecrets: "N00007999",
      votesmart: "26717",
      fec: "H6AK00045",
      maplight: "525",
      wikidata: "Q1239590",
      google_entity_id: "kg:/m/024p1k",
      title: "representative",
      party: "republican",
      name: "Don Young",
      name_slug: "don-young",
      first_name: "Don",
      middle_name: null,
      last_name: "Young",
      name_suffix: null,
      goes_by: null,
      pronunciation: "DAHN YUHNG",
      gender: "male",
      ethnicity: "white-american",
      religion: "episcopalian",
      openly_lgbtq: "no",
      date_of_birth: "1933-06-09",
      entered_office: "1973-01-03",
      term_end: "2019-01-03",
      biography: "Don Young, a Representative from Alaska; born in Meridian, Sutter County, Calif., June 9, 1933; A.A., Yuba Junior College, Marysville, Calif., 1952; B.A., California State University, Chico, Calif., 1958; United States Army, 1955-1957; teacher; Mayor of Fort Yukon, Alaska, 1960-1968; riverboat captain, 1968-1972; member of the Fort Yukon, Alaska, city council, 1960-1968; member of the Alaska state house of representatives, 1966-1970; member of the Alaska state senate, 1970-1973; delegate, Alaska state Republican conventions, 1964, 1966, 1968, and 1972; elected as a Republican to the Ninety-third Congress, by special election, to fill the vacancy caused by the death of United States Representative Nick Begich, and reelected to the twenty-two succeeding Congresses (March 6, 1973-present); chair, Committee on Resources (One Hundred Fourth through One Hundred Sixth Congresses); chair, Committee on Transportation and Infrastructure (One Hundred Seventh through One Hundred Ninth Congresses).",
      phone: "202-225-5765",
      fax: null,
      latitude: 38.8863,
      longitude: -77.0114,
      address_complete: "2436 Rayburn Hob, Washington, DC 20515",
      address_number: "2436",
      address_prefix: null,
      address_street: "Rayburn Hob",
      address_sec_unit_type: null,
      address_sec_unit_num: null,
      address_city: "Washington",
      address_state: "DC",
      address_zipcode: "20515",
      address_type: null,
      website: "https://donyoung.house.gov",
      contact_page: "http://donyoung.house.gov/contact/",
      facebook_url: "https://www.facebook.com/RepDonYoung",
      twitter_handle: "repdonyoung",
      twitter_url: "https://twitter.com/repdonyoung",
      photo_url: "https://cdn.civil.services/us-house/headshots/512x512/don-young.jpg",
      shape: {},
      created_date: new Date(),
      modified_date: new Date()
    };
  };

  it('should be defined', function() {
    assert.isDefined(House);
  });

  it('getAliases should be defined', function() {
    restore();

    var house = House.build(fakeHouse);

    assert.isDefined(house.getAliases);
    assert.isFunction(house.getAliases);
  });

  it('getAliases should work', function() {
    restore();

    var house = House.build(fakeHouse);
    var aliases = house.getAliases();

    assert.isDefined(aliases);
    assert.isArray(aliases);
    assert.isTrue(aliases.length === 8);
  });

  it('getAliases should work with different title', function() {
    restore();

    fakeHouse.title = 'house-speaker';

    var house = House.build(fakeHouse);
    var aliases = house.getAliases();

    assert.isDefined(aliases);
    assert.isArray(aliases);
    assert.isTrue(aliases.length === 12);
  });

  it('getAliases should fail', function() {
    restore();

    var house = House.build({});
    var aliases = house.getAliases();

    assert.isDefined(aliases);
    assert.isArray(aliases);
    assert.isTrue(aliases.length === 0);
  });
});
