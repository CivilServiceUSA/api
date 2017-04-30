var assert = require('chai').assert;
var sinon = require('sinon');

var state = require('../../../../../app/api/v1/domain/state');
var client = require('../../../../../app/elasticsearch/client');
var ZipCode = require('../../../../../app/models/civil_services/zipcode');
var StateModel = require('../../../../../app/models/civil_services/state');

var sample_result = {
  id: 1,
  admission_date: '1819-12-14',
  admission_number: 22,
  capital_city: 'Montgomery',
  capital_url: 'http://www.montgomeryal.gov',
  civil_services_url: 'https://civil.services/state/alabama',
  constitution_url: 'http://alisondb.legislature.state.al.us/alison/default.aspx',
  facebook_url: 'https://www.facebook.com/alabamagov',
  landscape: {
    size_640x360: 'https://cdn.civil.services/us-states/backgrounds/640x360/landscape/alabama.jpg',
    size_960x540: 'https://cdn.civil.services/us-states/backgrounds/960x540/landscape/alabama.jpg',
    size_1280x720: 'https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/alabama.jpg',
    size_1920x1080: 'https://cdn.civil.services/us-states/backgrounds/1920x1080/landscape/alabama.jpg'
  },
  landscape_background_url: 'https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/alabama.jpg',
  map: {
    large: 'https://cdn.civil.services/us-states/maps/alabama-large.png',
    small: 'https://cdn.civil.services/us-states/maps/alabama-small.png'
  },
  map_image_url: 'https://cdn.civil.services/us-states/maps/alabama-large.png',
  nickname: 'Yellowhammer State',
  population: 4833722,
  population_rank: 23,
  skyline: {
    size_640x360: 'https://cdn.civil.services/us-states/backgrounds/640x360/skyline/alabama.jpg',
    size_960x540: 'https://cdn.civil.services/us-states/backgrounds/960x540/skyline/alabama.jpg',
    size_1280x720: 'https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/alabama.jpg',
    size_1920x1080: 'https://cdn.civil.services/us-states/backgrounds/1920x1080/skyline/alabama.jpg'
  },
  skyline_background_url: 'https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/alabama.jpg',
  state_code: 'AL',
  state_code_slug: 'al',
  state_flag: {
    large: 'https://cdn.civil.services/us-states/flags/alabama-large.png',
    small: 'https://cdn.civil.services/us-states/flags/alabama-small.png'
  },
  state_flag_url: 'https://cdn.civil.services/us-states/flags/alabama-large.png',
  state_name: 'Alabama',
  state_name_slug: 'alabama',
  state_seal: {
    large: 'https://cdn.civil.services/us-states/seals/alabama-large.png',
    small: 'https://cdn.civil.services/us-states/seals/alabama-small.png'
  },
  state_seal_url: 'https://cdn.civil.services/us-states/seals/alabama-large.png',
  twitter_handle: 'alabamagov',
  twitter_url: 'https://twitter.com/alabamagov',
  website: 'http://www.alabama.gov'
};

describe('Domain State', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be defined', function() {
    assert.isDefined(state);
  });

  it('prepareForAPIOutput should be defined', function() {
    assert.isDefined(state.prepareForAPIOutput);
  });

  it('prepareForElasticSearch should be defined', function() {
    assert.isDefined(state.prepareForElasticSearch);
  });

  it('extendData should be defined', function() {
    assert.isDefined(state.extendData);
  });

  it('search should be defined', function() {
    assert.isDefined(state.search);
  });

  it('getState should be defined', function() {
    assert.isDefined(state.getState);
  });

  it('prepareForAPIOutput should return correct data', function() {
    var output = state.prepareForAPIOutput({
      _source: sample_result
    });

    assert.isDefined(output.admission_date);
    assert.isDefined(output.admission_number);
    assert.isDefined(output.capital_city);
    assert.isDefined(output.capital_url);
    assert.isDefined(output.civil_services_url);
    assert.isDefined(output.constitution_url);
    assert.isDefined(output.facebook_url);
    assert.isDefined(output.landscape_background_url);
    assert.isDefined(output.map_image_url);
    assert.isDefined(output.nickname);
    assert.isDefined(output.population);
    assert.isDefined(output.population_rank);
    assert.isDefined(output.skyline_background_url);
    assert.isDefined(output.state_code);
    assert.isDefined(output.state_code_slug);
    assert.isDefined(output.state_flag_url);
    assert.isDefined(output.state_name);
    assert.isDefined(output.state_name_slug);
    assert.isDefined(output.state_seal_url);
    assert.isDefined(output.twitter_handle);
    assert.isDefined(output.twitter_url);
    assert.isDefined(output.website);

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('prepareForElasticSearch should return correct data', function() {
    var output = state.prepareForElasticSearch(sample_result);

    assert.isDefined(output.admission_date);
    assert.isDefined(output.admission_number);
    assert.isDefined(output.capital_city);
    assert.isDefined(output.capital_url);
    assert.isDefined(output.civil_services_url);
    assert.isDefined(output.constitution_url);
    assert.isDefined(output.facebook_url);
    assert.isDefined(output.landscape_background_url);
    assert.isDefined(output.map_image_url);
    assert.isDefined(output.nickname);
    assert.isDefined(output.population);
    assert.isDefined(output.population_rank);
    assert.isDefined(output.skyline_background_url);
    assert.isDefined(output.state_code);
    assert.isDefined(output.state_code_slug);
    assert.isDefined(output.state_flag_url);
    assert.isDefined(output.state_name);
    assert.isDefined(output.state_name_slug);
    assert.isDefined(output.state_seal_url);
    assert.isDefined(output.twitter_handle);
    assert.isDefined(output.twitter_url);
    assert.isDefined(output.website);

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('extendData should return correct data', function() {
    var output = state.extendData([sample_result]);

    assert.isDefined(output[0].state_flag);
    assert.isDefined(output[0].state_flag.large);
    assert.isDefined(output[0].state_flag.small);
    assert.isDefined(output[0].state_seal);
    assert.isDefined(output[0].state_seal.large);
    assert.isDefined(output[0].state_seal.small);
    assert.isDefined(output[0].map);
    assert.isDefined(output[0].map.large);
    assert.isDefined(output[0].map.small);

    assert.isDefined(output[0].landscape);
    assert.isDefined(output[0].landscape.size_640x360);
    assert.isDefined(output[0].landscape.size_960x540);
    assert.isDefined(output[0].landscape.size_1280x720);
    assert.isDefined(output[0].landscape.size_1920x1080);

    assert.isDefined(output[0].skyline);
    assert.isDefined(output[0].skyline.size_640x360);
    assert.isDefined(output[0].skyline.size_960x540);
    assert.isDefined(output[0].skyline.size_1280x720);
    assert.isDefined(output[0].skyline.size_1920x1080);

    assert.isDefined(output[0].civil_services_url);
    assert.isDefined(output[0].admission_date);
  });

  describe('getState should return correct data', function() {
    beforeEach(function () {
      this.stateStub = this.sandbox.stub(StateModel, 'findOne');

    });

    var sampleResponse = {
      "admission_date": "1845-03-03T00:00:00.000Z",
      "admission_number": 27,
      "capital_city": "Tallahassee",
      "capital_url": "https://www.talgov.com/Main/Home.aspx",
      "civil_services_url": "https://civil.services/state/florida",
      "constitution_url": "http://www.leg.state.fl.us/Statutes/index.cfm",
      "facebook_url": null,
      "landscape_background_url": "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/florida.jpg",
      "map_image_url": "https://cdn.civil.services/us-states/maps/florida-large.png",
      "nickname": "Sunshine State",
      "population": 19552860,
      "population_rank": 4,
      "skyline_background_url": "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/florida.jpg",
      "state_code": "FL",
      "state_code_slug": "fl",
      "state_flag_url": "https://cdn.civil.services/us-states/flags/florida-large.png",
      "state_name": "Florida",
      "state_name_slug": "florida",
      "state_seal_url": "https://cdn.civil.services/us-states/seals/florida-large.png",
      "twitter_handle": null,
      "twitter_url": null,
      "website": "http://www.myflorida.com"
    };

    it('should return results with state param', function(done) {

      this.stateStub.returns(Promise.resolve(sampleResponse));

      state.getState('FL')
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should fail with missing state', function(done) {

      this.stateStub.returns(Promise.reject('Request Invalid'));

      state.getState()
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });

    it('should fail with missing results', function(done) {

      this.stateStub.returns(Promise.resolve());

      state.getState('ZZ')
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });
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
      pageSize: '30',
      page: '1',
      sort: 'name',
      order: 'asc',
      name: 'Florida',
      slug: 'florida',
      code: 'FL',
      nickname: 'Sunshine State',
      minPopulation: 10000,
      maxPopulation: 10000,
      admittedBefore: '1900-01-01',
      admittedAfter: '1800-01-01',
      latitude: 27.782805,
      longitude: -82.63314
    };

    it('should return results with search params', function(done) {

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 121, hits: [] }
      }));

      state.search(searchQuery)
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should return results with no params', function(done) {

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 121, hits: [] }
      }));

      state.search({})
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should throw error', function(done) {

      this.elasticsearchStub.returns(Promise.reject('Fake Error'));

      state.search({})
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

      state.search({ zipcode: 97232 })
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should fail with zip code', function(done) {

      this.zipCodeStub.returns(Promise.reject('Fake Error'));
      this.elasticsearchStub.returns(Promise.reject('Fake Error'));

      state.search({ zipcode: 'abc123' })
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });
  });
});