var assert = require('chai').assert;
var sinon = require('sinon');

var governor = require('../../../../../app/api/v1/domain/governor');
var client = require('../../../../../app/elasticsearch/client');
var ZipCode = require('../../../../../app/models/civil_services/zipcode');

var sample_result = {
  address_city: 'Tallahassee',
  address_complete: 'State of Florida, The Capitol, 400 South Monroe Street, Tallahassee, FL 32399',
  address_number: '400',
  address_prefix: 'South',
  address_sec_unit_num: null,
  address_sec_unit_type: null,
  address_state: 'FL',
  address_street: 'Monroe Street',
  address_type: 'Street',
  address_zipcode: '32399',
  age: 64,
  aliases: [
    'Republican Rick Scott',
    'Republican Scott',
    'Governor Rick Scott',
    'Governor Scott',
    'Gov. Rick Scott',
    'Gov. Scott',
    'Rick Scott [R]',
    'Rick Scott (R)'
  ],
  biography: 'Richard Lynn "Rick" Scott (born December 1, 1952) is an American businessman and politician who has been the 45th Governor of Florida, since 2011. He is a member of the Republican Party of Florida.',
  civil_services_url: 'https://civil.services/us-governor/florida/governor/rick-scott',
  contact_page: 'http://www.flgov.com/contact-governor/',
  date_of_birth: '1952-12-01',
  entered_office: '2011-01-04',
  ethnicity: 'white-american',
  facebook_url: 'https://www.facebook.com/governorrickscott',
  fax: null,
  first_name: 'Rick',
  gender: 'male',
  goes_by: null,
  last_name: 'Scott',
  latitude: 30.437722,
  longitude: -84.2836701,
  middle_name: null,
  name: 'Rick Scott',
  name_slug: 'rick-scott',
  name_suffix: null,
  openly_lgbtq: null,
  party: 'republican',
  phone: '850-488-7146',
  photo_url: 'https://cdn.civil.services/us-governors/headshots/512x512/rick-scott.jpg',
  photo_url_sizes: {
    size_64x64: 'https://cdn.civil.services/us-governors/headshots/64x64/rick-scott.jpg',
    size_128x128: 'https://cdn.civil.services/us-governors/headshots/128x128/rick-scott.jpg',
    size_256x256: 'https://cdn.civil.services/us-governors/headshots/256x256/rick-scott.jpg',
    size_512x512: 'https://cdn.civil.services/us-governors/headshots/512x512/rick-scott.jpg',
    size_1024x1024: 'https://cdn.civil.services/us-governors/headshots/1024x1024/rick-scott.jpg'
  },
  pronunciation: 'RIK SKAHT',
  religion: 'christian',
  state_code: 'FL',
  state_code_slug: 'fl',
  state_name: 'Florida',
  state_name_slug: 'florida',
  term_end: '2019-01-01',
  title: 'governor',
  twitter_handle: 'FLGovScott',
  twitter_url: 'https://twitter.com/FLGovScott',
  votesmart: '124204',
  votesmart_url: 'http://votesmart.org/candidate/124204',
  votesmart_url_tabs: {
    summary: 'http://votesmart.org/candidate/124204',
    bio: 'http://votesmart.org/candidate/biography/124204',
    votes: 'http://votesmart.org/candidate/key-votes/124204',
    positions: 'http://votesmart.org/candidate/political-courage-test/124204',
    ratings: 'http://votesmart.org/candidate/evaluations/124204',
    speeches: 'http://votesmart.org/candidate/public-statements/124204',
    funding: 'http://votesmart.org/candidate/campaign-finance/124204'
  },
  website: 'http://www.flgov.com',
  getAliases: function () {
    return [
      'Republican Rick Scott',
      'Republican Scott',
      'Governor Rick Scott',
      'Governor Scott',
      'Gov. Rick Scott',
      'Gov. Scott',
      'Rick Scott [R]',
      'Rick Scott (R)'
    ]
  }
};

describe('Domain Governor', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be defined', function() {
    assert.isDefined(governor);
  });

  it('prepareForAPIOutput should be defined', function() {
    assert.isDefined(governor.prepareForAPIOutput);
  });

  it('prepareForElasticSearch should be defined', function() {
    assert.isDefined(governor.prepareForElasticSearch);
  });

  it('extendData should be defined', function() {
    assert.isDefined(governor.extendData);
  });

  it('search should be defined', function() {
    assert.isDefined(governor.search);
  });

  it('prepareForAPIOutput should return correct data', function() {
    var output = governor.prepareForAPIOutput({
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
    assert.isDefined(output.civil_services_url);
    assert.isDefined(output.contact_page);
    assert.isDefined(output.date_of_birth);
    assert.isDefined(output.entered_office);
    assert.isDefined(output.ethnicity);
    assert.isDefined(output.facebook_url);
    assert.isDefined(output.fax);
    assert.isDefined(output.first_name);
    assert.isDefined(output.gender);
    assert.isDefined(output.goes_by);
    assert.isDefined(output.last_name);
    assert.isDefined(output.latitude);
    assert.isDefined(output.longitude);
    assert.isDefined(output.middle_name);
    assert.isDefined(output.name);
    assert.isDefined(output.name_slug);
    assert.isDefined(output.name_suffix);
    assert.isDefined(output.openly_lgbtq);
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
    assert.isDefined(output.title);
    assert.isDefined(output.twitter_handle);
    assert.isDefined(output.twitter_url);
    assert.isDefined(output.votesmart);
    assert.isDefined(output.website);

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('prepareForElasticSearch should return correct data', function() {
    var output = governor.prepareForElasticSearch(sample_result);

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
    assert.isDefined(output.civil_services_url);
    assert.isDefined(output.contact_page);
    assert.isDefined(output.date_of_birth);
    assert.isDefined(output.entered_office);
    assert.isDefined(output.ethnicity);
    assert.isDefined(output.facebook_url);
    assert.isDefined(output.fax);
    assert.isDefined(output.first_name);
    assert.isDefined(output.gender);
    assert.isDefined(output.goes_by);
    assert.isDefined(output.last_name);
    assert.isDefined(output.latitude);
    assert.isDefined(output.longitude);
    assert.isDefined(output.middle_name);
    assert.isDefined(output.name);
    assert.isDefined(output.name_slug);
    assert.isDefined(output.name_suffix);
    assert.isDefined(output.openly_lgbtq);
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
    assert.isDefined(output.title);
    assert.isDefined(output.twitter_handle);
    assert.isDefined(output.twitter_url);
    assert.isDefined(output.votesmart);
    assert.isDefined(output.website);

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('extendData should return correct data', function() {
    var output = governor.extendData([sample_result]);

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
    var output = governor.extendData([{

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
      enteredOffice: '2017',
      enteredOfficeAfter: '2017',
      enteredOfficeBefore: '2017',
      ethnicity: 'african-american',
      gender: 'male',
      latitude: 34.16,
      longitude: -118.37,
      maxAge: 50,
      minAge: 50,
      name: 'John',
      openlyLGBTQ: 'no',
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
      title: 'governor',
      votesmart: 'abc123'
    };

    it('should return results with search params', function(done) {

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 121, hits: [] }
      }));

      governor.search(searchQuery)
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should return results with no params', function(done) {

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 121, hits: [] }
      }));

      governor.search({})
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should throw error', function(done) {

      this.elasticsearchStub.returns(Promise.reject('Fake Error'));

      governor.search({})
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

      governor.search({ zipcode: 97232 })
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should fail with zip code', function(done) {

      this.zipCodeStub.returns(Promise.reject('Fake Error'));
      this.elasticsearchStub.returns(Promise.reject('Fake Error'));

      governor.search({ zipcode: 'abc123' })
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });
  });
});