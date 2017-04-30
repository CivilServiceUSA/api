var assert = require('chai').assert;
var sinon = require('sinon');

var city_council = require('../../../../../app/api/v1/domain/city_council');
var client = require('../../../../../app/elasticsearch/client');
var ZipCode = require('../../../../../app/models/civil_services/zipcode');

var sample_result = {
  id: 1,
  address_city: 'New York',
  address_complete: '250 Broadway Suite 1823 New York, NY 10007',
  address_number: '250',
  address_prefix: null,
  address_sec_unit_num: '1823',
  address_sec_unit_type: 'Suite',
  address_state: 'NY',
  address_street: 'Broadway',
  address_type: null,
  address_zipcode: '10007',
  age: 44,
  aliases: [
    'Democrat Daniel Garodnick',
    'Democrat Garodnick',
    'Councilor Daniel Garodnick',
    'Councilor Garodnick',
    'Daniel Garodnick [D]',
    'Daniel Garodnick (D)'
  ],
  at_large: false,
  background_url: 'https://cdn.civil.services/city-council/ny/new-york/backgrounds/1280x720/city.jpg',
  city_council_calendar_url: null,
  city_council_committees_url: 'http://legistar.council.nyc.gov/Departments.aspx',
  city_council_legislation_url: 'http://legistar.council.nyc.gov/Legislation.aspx',
  city_council_url: 'http://council.nyc.gov/districts/',
  city_government_url: 'http://www.nycgo.com',
  city_name: 'New York',
  city_name_slug: 'new-york',
  civil_services_url: null,
  date_of_birth: '1972-05-04T00:00:00.000Z',
  district: 4,
  email: 'garodnick@council.nyc.gov',
  entered_office: '2014-01-01T00:00:00.000Z',
  ethnicity: 'white-american',
  facebook_url: 'https://www.facebook.com/DanGarodnick',
  first_name: 'Daniel',
  gender: 'male',
  goes_by: null,
  last_name: 'Garodnick',
  latitude: 40.6643,
  longitude: -73.9385,
  middle_name: 'Daniel',
  name: 'Daniel Garodnick',
  name_slug: 'daniel-garodnick',
  name_suffix: null,
  party: 'democrat',
  phone: '212-818-0580',
  photo_url: 'https://cdn.civil.services/city-council/ny/new-york/headshots/512x512/daniel-garodnick.jpg',
  photo_url_sizes: {},
  population: 8550405,
  pronunciation: null,
  state_code: 'NY',
  state_code_slug: 'ny',
  state_name: 'New York',
  state_name_slug: 'new-york',
  term_end: '2017-12-31T00:00:00.000Z',
  title: 'councilor',
  twitter_handle: 'DanGarodnick',
  twitter_url: 'https://twitter.com/DanGarodnick',
  vacant: false,
  created_at: '2016-10-10T22:47:38.000Z',
  modified_at: '2016-10-10T22:47:38.000Z',
  getAliases: function (){
    return [
      'Democrat Daniel Garodnick',
      'Democrat Garodnick',
      'Councilor Daniel Garodnick',
      'Councilor Garodnick',
      'Daniel Garodnick [D]',
      'Daniel Garodnick (D)'
    ];
  }
};

describe('Domain City Council', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be defined', function() {
    assert.isDefined(city_council);
  });

  it('prepareForAPIOutput should be defined', function() {
    assert.isDefined(city_council.prepareForAPIOutput);
  });

  it('prepareForElasticSearch should be defined', function() {
    assert.isDefined(city_council.prepareForElasticSearch);
  });

  it('extendData should be defined', function() {
    assert.isDefined(city_council.extendData);
  });

  it('search should be defined', function() {
    assert.isDefined(city_council.search);
  });

  it('prepareForAPIOutput should return correct data', function() {
    var output = city_council.prepareForAPIOutput({
      _source: sample_result
    });

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
    assert.isDefined(output.age);
    assert.isDefined(output.aliases);
    assert.isDefined(output.at_large);
    assert.isDefined(output.background_url);
    assert.isDefined(output.city_council_calendar_url);
    assert.isDefined(output.city_council_committees_url);
    assert.isDefined(output.city_council_legislation_url);
    assert.isDefined(output.city_council_url);
    assert.isDefined(output.city_government_url);
    assert.isDefined(output.city_name);
    assert.isDefined(output.city_name_slug);
    assert.isDefined(output.civil_services_url);
    assert.isDefined(output.date_of_birth);
    assert.isDefined(output.district);
    assert.isDefined(output.email);
    assert.isDefined(output.entered_office);
    assert.isDefined(output.ethnicity);
    assert.isDefined(output.facebook_url);
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
    assert.isDefined(output.party);
    assert.isDefined(output.phone);
    assert.isDefined(output.photo_url);
    assert.isDefined(output.photo_url_sizes);
    assert.isDefined(output.population);
    assert.isDefined(output.pronunciation);
    assert.isDefined(output.state_code);
    assert.isDefined(output.state_code_slug);
    assert.isDefined(output.state_name);
    assert.isDefined(output.state_name_slug);
    assert.isDefined(output.term_end);
    assert.isDefined(output.title);
    assert.isDefined(output.twitter_handle);
    assert.isDefined(output.twitter_url);
    assert.isDefined(output.vacant);

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('prepareForElasticSearch should return correct data', function() {
    var output = city_council.prepareForElasticSearch(sample_result);

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
    assert.isDefined(output.age);
    assert.isDefined(output.aliases);
    assert.isDefined(output.at_large);
    assert.isDefined(output.background_url);
    assert.isDefined(output.city_council_calendar_url);
    assert.isDefined(output.city_council_committees_url);
    assert.isDefined(output.city_council_legislation_url);
    assert.isDefined(output.city_council_url);
    assert.isDefined(output.city_government_url);
    assert.isDefined(output.city_name);
    assert.isDefined(output.city_name_slug);
    assert.isDefined(output.civil_services_url);
    assert.isDefined(output.date_of_birth);
    assert.isDefined(output.district);
    assert.isDefined(output.email);
    assert.isDefined(output.entered_office);
    assert.isDefined(output.ethnicity);
    assert.isDefined(output.facebook_url);
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
    assert.isDefined(output.party);
    assert.isDefined(output.phone);
    assert.isDefined(output.photo_url);
    assert.isDefined(output.photo_url_sizes);
    assert.isDefined(output.population);
    assert.isDefined(output.pronunciation);
    assert.isDefined(output.state_code);
    assert.isDefined(output.state_code_slug);
    assert.isDefined(output.state_name);
    assert.isDefined(output.state_name_slug);
    assert.isDefined(output.term_end);
    assert.isDefined(output.title);
    assert.isDefined(output.twitter_handle);
    assert.isDefined(output.twitter_url);
    assert.isDefined(output.vacant);

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('extendData should return correct data', function() {
    var output = city_council.extendData([sample_result]);

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
      district: 1,
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
      order: 'asc',
      page: '1',
      pageSize: '30',
      party: 'democrat',
      sort: 'name',
      state: 'CA',
      termEnds: '2017',
      termEndsAfter: '2017',
      termEndsBefore: '2017',
      title: 'councilor',
      vacant: 1
    };

    it('should return results with search params', function(done) {

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 121, hits: [] }
      }));

      city_council.search(searchQuery)
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should return results with no params', function(done) {

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 121, hits: [] }
      }));

      city_council.search({})
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should throw error', function(done) {

      this.elasticsearchStub.returns(Promise.reject('Fake Error'));

      city_council.search({})
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

      city_council.search({ zipcode: 97232 })
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should fail with zip code', function(done) {

      this.zipCodeStub.returns(Promise.reject('Fake Error'));
      this.elasticsearchStub.returns(Promise.reject('Fake Error'));

      city_council.search({ zipcode: 'abc123' })
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });
  });
});