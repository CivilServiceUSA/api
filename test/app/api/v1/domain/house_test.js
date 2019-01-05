var assert = require('chai').assert;
var sinon = require('sinon');

var house = require('../../../../../app/api/v1/domain/house');
var client = require('../../../../../app/elasticsearch/client');
var ZipCode = require('../../../../../app/models/civil_services/zipcode');

var sample_result = {
  address_city: 'Washington',
  address_complete: '2436 Rayburn Hob, Washington, DC 20515',
  address_number: '2436',
  address_prefix: null,
  address_sec_unit_num: null,
  address_sec_unit_type: null,
  address_state: 'DC',
  address_street: 'Rayburn Hob',
  address_type: null,
  address_zipcode: '20515',
  age: 60,
  aliases: [
    'Democrat Charlie Crist',
    'Democrat Crist',
    'Representative Charlie Crist',
    'Representative Crist',
    'Rep. Charlie Crist',
    'Rep. Crist',
    'Charlie Crist [D]',
    'Charlie Crist (D)'
  ],
  at_large: false,
  biography: 'Charlie Crist, a Representative from Florida; born in Altoona, Blair County, Pa., July 24, 1956; graduated from St. Petersburg High School, St. Petersburg, Fla., 1974; attended Wake Forest University, Winston-Salem, N.C.; B.S., Florida State University, Tallahassee, Fla., 1978; J.D., Cumberland School of Law, Birmingham, Ala., 1981; lawyer, private practice; unsuccessful candidate for election to the Florida state senate in 1986; staff, United States Senator Connie Mack of Florida, 1988-1989; member of the Florida state senate, 1993-1999; unsuccessful candidate for election to the United States Senate in 1998; Florida deputy secretary of business and professional regulation, 1999-2001; Florida state education commissioner, 2001-2003; Florida state attorney general, 2003-2007; Governor of Florida, 2007-2011; unsuccessful candidate for election to the United States Senate in 2010; unsuccessful candidate for election for Governor of Florida in 2014; elected as a Democrat to the One Hundred Fifteenth Congress (January 3, 2017-present).',
  bioguide: 'C001111',
  bioguide_url: 'http://bioguide.congress.gov/scripts/biodisplay.pl?index=C001111',
  civil_services_url: 'https://civil.services/us-house/florida/representative/charlie-crist',
  contact_page: 'https://crist.house.gov/contact/email',
  date_of_birth: '1956-07-24',
  district: 13,
  entered_office: '2017-01-03',
  ethnicity: 'white-american',
  facebook_url: 'https://www.facebook.com/charliecrist',
  fax: '202-225-9764',
  fec: 'H6FL13205',
  fec_url: 'http://www.fec.gov/fecviewer/CandidateCommitteeDetail.do?candidateCommitteeId=H6FL13205',
  first_name: 'Charlie',
  gender: 'male',
  goes_by: null,
  google_entity_id: 'kg:/m/04jyvv',
  last_name: 'Crist',
  latitude: 38.8863,
  longitude: -77.0114,
  maplight: '2209',
  maplight_url: 'http://maplight.org/us-congress/legislator/2209',
  middle_name: null,
  name: 'Charlie Crist',
  name_slug: 'charlie-crist',
  name_suffix: null,
  openly_lgbtq: 'no',
  opensecrets: 'N00002942',
  opensecrets_url: 'https://www.opensecrets.org/politicians/summary.php?cid=N00002942',
  opensecrets_url_tabs: {
    summary: 'https://www.opensecrets.org/politicians/summary.php?cid=N00002942',
    elections: 'https://www.opensecrets.org/politicians/elections.php?cid=N00002942',
    industries: 'https://www.opensecrets.org/politicians/industries.php?cid=N00002942',
    pacs: 'https://www.opensecrets.org/politicians/pacs.php?cid=N00002942',
    donors: 'https://www.opensecrets.org/politicians/contrib.php?cid=N00002942',
    geography: 'https://www.opensecrets.org/politicians/geog.php?cid=N00002942',
    expenditures: 'https://www.opensecrets.org/politicians/expend.php?cid=N00002942',
    legislation: 'https://www.opensecrets.org/politicians/bills.php?cid=N00002942',
    news: 'https://www.opensecrets.org/politicians/inthenews.php?cid=N00002942',
    other: 'https://www.opensecrets.org/politicians/otherdata.php?cid=N00002942'
  },
  party: 'democrat',
  phone: '202-225-5961',
  photo_url: 'https://cdn.civil.services/us-house/headshots/512x512/charlie-crist.jpg',
  photo_url_sizes: {
    size_64x64: 'https://cdn.civil.services/us-house/headshots/64x64/charlie-crist.jpg',
    size_128x128: 'https://cdn.civil.services/us-house/headshots/128x128/charlie-crist.jpg',
    size_256x256: 'https://cdn.civil.services/us-house/headshots/256x256/charlie-crist.jpg',
    size_512x512: 'https://cdn.civil.services/us-house/headshots/512x512/charlie-crist.jpg',
    size_1024x1024: 'https://cdn.civil.services/us-house/headshots/1024x1024/charlie-crist.jpg'
  },
  pronunciation: 'CHAR-lee KRIST',
  religion: 'united-methodist',
  state_code: 'FL',
  state_code_slug: 'fl',
  state_name: 'Florida',
  state_name_slug: 'florida',
  term_end: '2019-01-03',
  thomas: null,
  title: 'representative',
  twitter_handle: 'CharlieCrist',
  twitter_url: 'https://twitter.com/CharlieCrist',
  vacant: false,
  votesmart: '24311',
  votesmart_url: 'http://votesmart.org/candidate/24311',
  votesmart_url_tabs: {
    summary: 'http://votesmart.org/candidate/24311',
    bio: 'http://votesmart.org/candidate/biography/24311',
    votes: 'http://votesmart.org/candidate/key-votes/24311',
    positions: 'http://votesmart.org/candidate/political-courage-test/24311',
    ratings: 'http://votesmart.org/candidate/evaluations/24311',
    speeches: 'http://votesmart.org/candidate/public-statements/24311',
    funding: 'http://votesmart.org/candidate/campaign-finance/24311'
  },
  website: 'https://crist.house.gov',
  wikidata: 'Q374693',
  wikidata_url: 'https://www.wikidata.org/wiki/Q374693',
  getAliases: function () {
    return [
      'Democrat Charlie Crist',
      'Democrat Crist',
      'Representative Charlie Crist',
      'Representative Crist',
      'Rep. Charlie Crist',
      'Rep. Crist',
      'Charlie Crist [D]',
      'Charlie Crist (D)'
    ]
  }
};

describe('Domain House', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be defined', function() {
    assert.isDefined(house);
  });

  it('prepareForAPIOutput should be defined', function() {
    assert.isDefined(house.prepareForAPIOutput);
  });

  it('prepareForElasticSearch should be defined', function() {
    assert.isDefined(house.prepareForElasticSearch);
  });

  it('extendData should be defined', function() {
    assert.isDefined(house.extendData);
  });

  it('search should be defined', function() {
    assert.isDefined(house.search);
  });

  it('prepareForAPIOutput should return correct data', function() {
    var output = house.prepareForAPIOutput({
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
    assert.isDefined(output.at_large);
    assert.isDefined(output.biography);
    assert.isDefined(output.bioguide);
    assert.isDefined(output.civil_services_url);
    assert.isDefined(output.contact_page);
    assert.isDefined(output.date_of_birth);
    assert.isDefined(output.district);
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
    assert.isDefined(output.vacant);
    assert.isDefined(output.votesmart);
    assert.isDefined(output.website);
    assert.isDefined(output.wikidata);

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('prepareForElasticSearch should return correct data', function() {
    var output = house.prepareForElasticSearch(sample_result);

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
    assert.isDefined(output.at_large);
    assert.isDefined(output.biography);
    assert.isDefined(output.bioguide);
    assert.isDefined(output.civil_services_url);
    assert.isDefined(output.contact_page);
    assert.isDefined(output.date_of_birth);
    assert.isDefined(output.district);
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
    assert.isDefined(output.vacant);
    assert.isDefined(output.votesmart);
    assert.isDefined(output.website);
    assert.isDefined(output.wikidata);

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('extendData should return correct data', function() {
    var output = house.extendData([sample_result]);

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
    var output = house.extendData([{

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

      house.search(searchQuery)
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should return results with no params', function(done) {

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 121, hits: [] }
      }));

      house.search({})
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should throw error', function(done) {

      this.elasticsearchStub.returns(Promise.reject('Fake Error'));

      house.search({})
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

      house.search({ zipcode: 97232 })
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should fail with zip code', function(done) {

      this.zipCodeStub.returns(Promise.reject('Fake Error'));
      this.elasticsearchStub.returns(Promise.reject('Fake Error'));

      house.search({ zipcode: 'abc123' })
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });
  });
});
