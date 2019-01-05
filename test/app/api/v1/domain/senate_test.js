var assert = require('chai').assert;
var sinon = require('sinon');

var senate = require('../../../../../app/api/v1/domain/senate');
var client = require('../../../../../app/elasticsearch/client');
var ZipCode = require('../../../../../app/models/civil_services/zipcode');

var sample_result = {
  address_city: 'Washington',
  address_complete: '716 Hart, Washington, DC 20510',
  address_number: null,
  address_prefix: null,
  address_sec_unit_num: null,
  address_sec_unit_type: null,
  address_state: 'DC',
  address_street: '716 Hart',
  address_type: 'Building',
  address_zipcode: '20510',
  age: 74,
  aliases: [
    'Democrat Bill Nelson',
    'Democrat Nelson',
    'Senator Bill Nelson',
    'Senator Nelson',
    'Sen. Bill Nelson',
    'Sen. Nelson',
    'Bill Nelson [D]',
    'Bill Nelson (D)'
  ],
  biography: 'Bill Nelson, a Senator and a Representative from Florida; born in Miami, Dade County, Fla., September 29, 1942; attended the Brevard County public schools; graduated from Melbourne High School 1960; B.A., Yale University 1965; J.D., University of Virginia School of Law 1968; admitted to the Florida bar in 1968 and commenced practice in Melbourne in 1970; served in United States Army Reserve 1965-1971; United States Army, active duty, 1968-1970, achieving rank of captain; legislative assistant to Governor Reubin Askew 1971; elected to Florida State house of representatives in 1972 and reelected in 1974 and 1976; elected as a Democrat to the Ninety-sixth and to the five succeeding Congresses (January 3, 1979-January 3, 1991); was not a candidate for reelection in 1990 to the House of Representatives, but was a candidate for nomination for governor of Florida; crewmember on the twenty-fourth flight of the Space Shuttle Columbia, January 12-18, 1986; Florida treasurer and insurance commissioner 1995-2000; elected to the United States Senate in 2000 for the term commencing January 3, 2001; reelected in 2006 and again in 2012 for the term ending January 3, 2019; Chair, Special Committee on Aging (One Hundred Thirteenth Congress).',
  bioguide: 'N000032',
  bioguide_url: 'http://bioguide.congress.gov/scripts/biodisplay.pl?index=N000032',
  civil_services_url: 'https://civil.services/us-senate/florida/senator/bill-nelson',
  class: 'I',
  contact_page: 'https://www.billnelson.senate.gov/contact-bill',
  date_of_birth: '1942-09-29',
  entered_office: '2001-01-03',
  ethnicity: 'white-american',
  facebook_url: 'https://www.facebook.com/billnelson/',
  fax: '202-228-2183',
  fec: 'abc123',
  fec_url: null,
  first_name: 'Bill',
  gender: 'male',
  goes_by: null,
  google_entity_id: null,
  last_name: 'Nelson',
  latitude: 38.892839,
  longitude: -77.004356,
  maplight: 'abc123',
  maplight_url: null,
  middle_name: null,
  name: 'Bill Nelson',
  name_slug: 'bill-nelson',
  name_suffix: null,
  openly_lgbtq: 'no',
  opensecrets: 'N00009926',
  opensecrets_url: 'https://www.opensecrets.org/politicians/summary.php?cid=N00009926',
  opensecrets_url_tabs: {
    summary: 'https://www.opensecrets.org/politicians/summary.php?cid=N00009926',
    elections: 'https://www.opensecrets.org/politicians/elections.php?cid=N00009926',
    industries: 'https://www.opensecrets.org/politicians/industries.php?cid=N00009926',
    pacs: 'https://www.opensecrets.org/politicians/pacs.php?cid=N00009926',
    donors: 'https://www.opensecrets.org/politicians/contrib.php?cid=N00009926',
    geography: 'https://www.opensecrets.org/politicians/geog.php?cid=N00009926',
    expenditures: 'https://www.opensecrets.org/politicians/expend.php?cid=N00009926',
    legislation: 'https://www.opensecrets.org/politicians/bills.php?cid=N00009926',
    news: 'https://www.opensecrets.org/politicians/inthenews.php?cid=N00009926',
    other: 'https://www.opensecrets.org/politicians/otherdata.php?cid=N00009926'
  },
  party: 'democrat',
  phone: '202-224-5274',
  photo_url: 'https://cdn.civil.services/us-senate/headshots/512x512/bill-nelson.jpg',
  photo_url_sizes: {
    size_64x64: 'https://cdn.civil.services/us-senate/headshots/64x64/bill-nelson.jpg',
    size_128x128: 'https://cdn.civil.services/us-senate/headshots/128x128/bill-nelson.jpg',
    size_256x256: 'https://cdn.civil.services/us-senate/headshots/256x256/bill-nelson.jpg',
    size_512x512: 'https://cdn.civil.services/us-senate/headshots/512x512/bill-nelson.jpg',
    size_1024x1024: 'https://cdn.civil.services/us-senate/headshots/1024x1024/bill-nelson.jpg'
  },
  pronunciation: 'BILL NELL-suhn',
  religion: 'christian',
  state_code: 'FL',
  state_code_slug: 'fl',
  state_name: 'Florida',
  state_name_slug: 'florida',
  term_end: '2019-01-03',
  thomas: '859',
  title: 'senator',
  twitter_handle: 'SenBillNelson',
  twitter_url: 'https://twitter.com/SenBillNelson',
  votesmart: '1606',
  votesmart_url: 'http://votesmart.org/candidate/1606',
  votesmart_url_tabs: {
    summary: 'http://votesmart.org/candidate/1606',
    bio: 'http://votesmart.org/candidate/biography/1606',
    votes: 'http://votesmart.org/candidate/key-votes/1606',
    positions: 'http://votesmart.org/candidate/political-courage-test/1606',
    ratings: 'http://votesmart.org/candidate/evaluations/1606',
    speeches: 'http://votesmart.org/candidate/public-statements/1606',
    funding: 'http://votesmart.org/candidate/campaign-finance/1606'
  },
  website: 'http://www.billnelson.senate.gov',
  wikidata: 'abc123',
  wikidata_url: null,
  getAliases: function () {
    return [
      'Democrat Bill Nelson',
      'Democrat Nelson',
      'Senator Bill Nelson',
      'Senator Nelson',
      'Sen. Bill Nelson',
      'Sen. Nelson',
      'Bill Nelson [D]',
      'Bill Nelson (D)'
    ]
  }
};

describe('Domain Senate', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be defined', function() {
    assert.isDefined(senate);
  });

  it('prepareForAPIOutput should be defined', function() {
    assert.isDefined(senate.prepareForAPIOutput);
  });

  it('prepareForElasticSearch should be defined', function() {
    assert.isDefined(senate.prepareForElasticSearch);
  });

  it('extendData should be defined', function() {
    assert.isDefined(senate.extendData);
  });

  it('search should be defined', function() {
    assert.isDefined(senate.search);
  });

  it('prepareForAPIOutput should return correct data', function() {
    var output = senate.prepareForAPIOutput({
      _source: sample_result
    });

    assert.isDefined(output.aliases);
    assert.isDefined(output.age);
    assert.isDefined(output.address_city);
    assert.isDefined(output.address_complete);
    assert.isDefined(output.address_number);
    assert.isDefined(output.address_prefix);
    assert.isDefined(output.address_sec_unit_num);
    assert.isDefined(output.address_sec_unit_type);
    assert.isDefined(output.address_state);
    assert.isDefined(output.address_street);
    assert.isDefined(output.address_type);
    assert.isDefined(output.address_zipcode);
    assert.isDefined(output.biography);
    assert.isDefined(output.bioguide);
    assert.isDefined(output.civil_services_url);
    assert.isDefined(output.contact_page);
    assert.isDefined(output.class);
    assert.isDefined(output.date_of_birth);
    assert.isDefined(output.entered_office);
    assert.isDefined(output.ethnicity);
    assert.isDefined(output.facebook_url);
    assert.isDefined(output.fax);
    assert.isDefined(output.fec);
    assert.isDefined(output.first_name);
    assert.isDefined(output.gender);
    assert.isDefined(output.goes_by);
    assert.isDefined(output.google_entity_id);
    assert.isDefined(output.last_name);
    assert.isDefined(output.latitude);
    assert.isDefined(output.longitude);
    assert.isDefined(output.maplight);
    assert.isDefined(output.middle_name);
    assert.isDefined(output.name);
    assert.isDefined(output.name_slug);
    assert.isDefined(output.name_suffix);
    assert.isDefined(output.openly_lgbtq);
    assert.isDefined(output.opensecrets);
    assert.isDefined(output.party);
    assert.isDefined(output.phone);
    assert.isDefined(output.photo_url);
    assert.isDefined(output.photo_url_sizes);
    assert.isDefined(output.pronunciation);
    assert.isDefined(output.religion);
    assert.isDefined(output.state_code);
    assert.isDefined(output.state_code_slug);
    assert.isDefined(output.state_name);
    assert.isDefined(output.state_name_slug);
    assert.isDefined(output.term_end);
    assert.isDefined(output.thomas);
    assert.isDefined(output.title);
    assert.isDefined(output.twitter_handle);
    assert.isDefined(output.twitter_url);
    assert.isDefined(output.votesmart);
    assert.isDefined(output.website);
    assert.isDefined(output.wikidata);

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('prepareForElasticSearch should return correct data', function() {
    var output = senate.prepareForElasticSearch(sample_result);

    assert.isDefined(output.aliases);
    assert.isDefined(output.age);
    assert.isDefined(output.address_city);
    assert.isDefined(output.address_complete);
    assert.isDefined(output.address_number);
    assert.isDefined(output.address_prefix);
    assert.isDefined(output.address_sec_unit_num);
    assert.isDefined(output.address_sec_unit_type);
    assert.isDefined(output.address_state);
    assert.isDefined(output.address_street);
    assert.isDefined(output.address_type);
    assert.isDefined(output.address_zipcode);
    assert.isDefined(output.biography);
    assert.isDefined(output.bioguide);
    assert.isDefined(output.civil_services_url);
    assert.isDefined(output.class);
    assert.isDefined(output.contact_page);
    assert.isDefined(output.date_of_birth);
    assert.isDefined(output.entered_office);
    assert.isDefined(output.ethnicity);
    assert.isDefined(output.facebook_url);
    assert.isDefined(output.fax);
    assert.isDefined(output.fec);
    assert.isDefined(output.first_name);
    assert.isDefined(output.gender);
    assert.isDefined(output.goes_by);
    assert.isDefined(output.google_entity_id);
    assert.isDefined(output.last_name);
    assert.isDefined(output.latitude);
    assert.isDefined(output.longitude);
    assert.isDefined(output.maplight);
    assert.isDefined(output.middle_name);
    assert.isDefined(output.name);
    assert.isDefined(output.name_slug);
    assert.isDefined(output.name_suffix);
    assert.isDefined(output.openly_lgbtq);
    assert.isDefined(output.opensecrets);
    assert.isDefined(output.party);
    assert.isDefined(output.phone);
    assert.isDefined(output.photo_url);
    assert.isDefined(output.photo_url_sizes);
    assert.isDefined(output.pronunciation);
    assert.isDefined(output.religion);
    assert.isDefined(output.state_code);
    assert.isDefined(output.state_code_slug);
    assert.isDefined(output.state_name);
    assert.isDefined(output.state_name_slug);
    assert.isDefined(output.term_end);
    assert.isDefined(output.thomas);
    assert.isDefined(output.title);
    assert.isDefined(output.twitter_handle);
    assert.isDefined(output.twitter_url);
    assert.isDefined(output.votesmart);
    assert.isDefined(output.website);
    assert.isDefined(output.wikidata);

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('extendData should return correct data', function() {
    var output = senate.extendData([sample_result]);

    assert.isDefined(output[0].photo_url_sizes);
    assert.isDefined(output[0].photo_url_sizes.size_64x64);
    assert.isDefined(output[0].photo_url_sizes.size_128x128);
    assert.isDefined(output[0].photo_url_sizes.size_256x256);
    assert.isDefined(output[0].photo_url_sizes.size_512x512);
    assert.isDefined(output[0].photo_url_sizes.size_1024x1024);
    assert.isDefined(output[0].date_of_birth);
    assert.isDefined(output[0].entered_office);
    assert.isDefined(output[0].term_end);
    assert.isDefined(output[0].civil_services_url);
  });

  it('extendData should return correct null data', function() {
    var output = senate.extendData([{

    }]);

    assert.isDefined(output[0].photo_url_sizes);
    assert.isNull(output[0].photo_url_sizes.size_64x64);
    assert.isNull(output[0].photo_url_sizes.size_128x128);
    assert.isNull(output[0].photo_url_sizes.size_256x256);
    assert.isNull(output[0].photo_url_sizes.size_512x512);
    assert.isNull(output[0].photo_url_sizes.size_1024x1024);
    assert.isNull(output[0].date_of_birth);
    assert.isNull(output[0].entered_office);
    assert.isNull(output[0].term_end);
  });

  describe('search should return correct data', function() {
    beforeEach(function () {
      this.elasticsearchStub = this.sandbox.stub(client, 'search');
      this.zipCodeStub = this.sandbox.stub(ZipCode, 'findOne');
    });

    afterEach(function () {
      client.search.restore();
    });

    var searchQuery = {
      age: 50,
      atLarge: 1,
      bioguide: 'abc123',
      class: 'asc',
      district: 1,
      enteredOffice: '2017',
      enteredOfficeAfter: '2017',
      enteredOfficeBefore: '2017',
      ethnicity: 'african-american',
      fec: 'abc123',
      gender: 'male',
      googleEntityId: 'abc123',
      latitude: 34.16,
      longitude: -118.37,
      maplight: 'abc123',
      maxAge: 50,
      minAge: 50,
      name: 'John',
      openlyLGBTQ: 'no',
      opensecrets: 'abc123',
      order: 'asc',
      page: '1',
      pageSize: '30',
      party: 'democrat',
      religion: 'christian',
      sort: 'name',
      state: 'CA',
      termEnds: '2017',
      termEndsAfter: '2017',
      termEndsBefore: '2017',
      thomas: 'abc123',
      title: 'governor',
      vacant: 1,
      votesmart: 'abc123',
      wikidata: 'abc123'
    };

    it('should return results with search params', function(done) {

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 121, hits: [] }
      }));

      senate.search(searchQuery)
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should return results with no params', function(done) {

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 121, hits: [] }
      }));

      senate.search({})
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should throw error', function(done) {

      this.elasticsearchStub.returns(Promise.reject('Fake Error'));

      senate.search({})
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });

    it('should work with zip code', function(done) {

      var fakeZipCode = {
        shape: {
          coordinates: {}
        },
        state: 'NY',
        latitude: 40.6643,
        longitude: -73.9385
      };

      this.zipCodeStub.returns(Promise.resolve(fakeZipCode));

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 121, hits: [] }
      }));

      senate.search({ zipcode: 97232 })
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should fail with zip code', function(done) {

      this.zipCodeStub.returns(Promise.reject('Fake Error'));
      this.elasticsearchStub.returns(Promise.reject('Fake Error'));

      senate.search({ zipcode: 'abc123' })
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });
  });
});
