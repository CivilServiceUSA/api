var assert = require('chai').assert;
var Governor = require('../../../../app/models/civil_services/governor');

describe('Models Governor', function() {

  var fakeGovernor = {};
  var restore = function(){
    fakeGovernor = {
      id: 1,
      state_name: "Alaska",
      state_name_slug: "alaska",
      state_code: "AK",
      state_code_slug: "ak",
      votesmart: "123219",
      title: "governor",
      party: "independent",
      name: "William Walker",
      name_slug: "william-walker",
      first_name: "William",
      middle_name: null,
      last_name: "Walker",
      name_suffix: null,
      goes_by: "Bill",
      pronunciation: "BIL WAH-ker",
      gender: "male",
      ethnicity: "white-american",
      religion: "christian",
      openly_lgbtq: null,
      date_of_birth: "1951-04-16",
      entered_office: "2014-12-01",
      term_end: "2019-01-01",
      biography: "William Martin \"Bill\" Walker (born April 16, 1951) is an American attorney and politician who is the 13th and current Governor of Alaska. He is the second native-born governor of Alaska after William A. Egan (1959–1966 and 1970–1974).",
      phone: "907-465-3500",
      fax: "407-465-3532",
      latitude: "27.7812652",
      longitude: "-82.6321373",
      address_complete: "Office of Governor Bill Walker, 3rd Floor, State Capitol, P.O Box 110001, Juneau, AK 99811",
      address_number: null,
      address_prefix: null,
      address_street: "P.O Box 110001",
      address_sec_unit_type: "Office",
      address_sec_unit_num: null,
      address_city: "Juneau",
      address_state: "AK",
      address_zipcode: "99811",
      address_type: "Street",
      website: "https://gov.alaska.gov",
      contact_page: "https://gov.alaska.gov/contact/email-the-governor/",
      facebook_url: "https://www.facebook.com/Governor.BillWalker",
      twitter_handle: "AkGovBillWalker",
      twitter_url: "https://twitter.com/AkGovBillWalker",
      photo_url: "https://cdn.civil.services/us-governors/headshots/512x512/william-walker.jpg",
      shape: {},
      created_date: new Date(),
      modified_date: new Date()
    };
  };

  it('should be defined', function() {
    assert.isDefined(Governor);
  });

  it('getAliases should be defined', function() {
    restore();

    var governor = Governor.build(fakeGovernor);

    assert.isDefined(governor.getAliases);
    assert.isFunction(governor.getAliases);
  });

  it('getAliases should work', function() {
    restore();

    var governor = Governor.build(fakeGovernor);
    var aliases = governor.getAliases();

    assert.isDefined(aliases);
    assert.isArray(aliases);
    assert.isTrue(aliases.length === 8);
  });

  it('getAliases should fail', function() {
    restore();

    var governor = Governor.build({});
    var aliases = governor.getAliases();

    assert.isDefined(aliases);
    assert.isArray(aliases);
    assert.isTrue(aliases.length === 0);
  });
});