var assert = require('chai').assert;
var Senate = require('../../../../app/models/civil_services/senate');

describe('Models Senate', function() {

  var fakeSenate = {};
  var restore = function(){
    fakeSenate = {
      id: 1,
      state_name: "Alaska",
      state_name_slug: "alaska",
      state_code: "AK",
      state_code_slug: "ak",
      class: "II",
      bioguide: "S001198",
      thomas: "2290",
      opensecrets: "N00035774",
      votesmart: "114964",
      fec: null,
      maplight: null,
      wikidata: null,
      google_entity_id: null,
      title: "senator",
      party: "republican",
      name: "Daniel Sullivan",
      name_slug: "daniel-sullivan",
      first_name: "Daniel",
      middle_name: null,
      last_name: "Sullivan",
      name_suffix: null,
      goes_by: "Dan",
      pronunciation: "DAN SUHL-ih-vuhn",
      gender: "male",
      ethnicity: "white-american",
      religion: "roman-catholic",
      openly_lgbtq: "no",
      date_of_birth: "1964-11-13",
      entered_office: "2015-01-03",
      term_end: "2021-01-03",
      biography: "Dan Sullivan is a Senator from Alaska; born in Fairview Park, Cuyahoga County, Ohio, November 13, 1964; graduated Culver Military Academy, Culver, Ind., 1983; B.A., Harvard University, 1987; M.F.S. and J.D., Georgetown University, 1993; United States Marine Corps 1993-1997; United States Marine Corps Reserves 1997-present, attaining the rank of lieutenant colonel; lawyer; White House aide and director on the National Security Council staff during the George W. Bush administration; assistant U.S. secretary of state for economic, energy and business affairs 2006-2009; attorney general of Alaska 2009-2010; Commissioner of Alaska Department of Natural Resources 2010-2013; elected as a Republican to the United States Senate in 2014 for the term ending January 3, 2021.",
      phone: "202-224-3004",
      fax: "202-224-6501",
      latitude: "38.892839",
      longitude: "-77.004356",
      address_complete: "702 Hart, Washington, DC 20510",
      address_number: null,
      address_prefix: null,
      address_street: "702 Hart",
      address_sec_unit_type: null,
      address_sec_unit_num: null,
      address_city: "Washington",
      address_state: "DC",
      address_zipcode: "20510",
      address_type: "Building",
      website: "http://www.sullivan.senate.gov",
      contact_page: "https://www.sullivan.senate.gov/contact/email",
      facebook_url: "https://www.facebook.com/SenDanSullivan",
      twitter_handle: "SenDanSullivan",
      twitter_url: "https://twitter.com/SenDanSullivan",
      photo_url: "https://cdn.civil.services/us-senate/headshots/512x512/daniel-sullivan.jpg",
      shape: {},
      created_date: new Date(),
      modified_date: new Date()
    };
  };

  it('should be defined', function() {
    assert.isDefined(Senate);
  });

  it('getAliases should be defined', function() {
    restore();

    var senate = Senate.build(fakeSenate);

    assert.isDefined(senate.getAliases);
    assert.isFunction(senate.getAliases);
  });

  it('getAliases should work', function() {
    restore();

    var senate = Senate.build(fakeSenate);
    var aliases = senate.getAliases();

    assert.isDefined(aliases);
    assert.isArray(aliases);
    assert.isTrue(aliases.length === 8);
  });

  it('getAliases should work with different title', function() {
    restore();

    fakeSenate.title = 'senate-speaker';

    var senate = Senate.build(fakeSenate);
    var aliases = senate.getAliases();

    assert.isDefined(aliases);
    assert.isArray(aliases);
    assert.isTrue(aliases.length === 12);
  });

  it('getAliases should fail', function() {
    restore();

    var senate = Senate.build({});
    var aliases = senate.getAliases();

    assert.isDefined(aliases);
    assert.isArray(aliases);
    assert.isTrue(aliases.length === 0);
  });
});
