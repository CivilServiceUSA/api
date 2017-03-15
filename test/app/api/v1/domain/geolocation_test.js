var assert = require('chai').assert;
var sinon = require('sinon');
var mmdbreader = require('maxmind-db-reader');

var client = require('../../../../../app/elasticsearch/client');
var Domain = require('../../../../../app/api/v1/domain/geolocation');

describe('Domain Geolocation', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be defined', function() {
    assert.isDefined(Domain);
  });

  it('prepareForAPIOutput should be defined', function() {
    assert.isDefined(Domain.prepareForAPIOutput);
  });

  it('prepareForElasticSearch should be defined', function() {
    assert.isDefined(Domain.prepareForElasticSearch);
  });

  it('getZipcode should be defined', function() {
    assert.isDefined(Domain.getZipcode);
  });

  it('getLocation should be defined', function() {
    assert.isDefined(Domain.getLocation);
  });

  it('getIpAddress should be defined', function() {
    assert.isDefined(Domain.getIpAddress);
  });

  it('prepareForAPIOutput should return correct data', function() {
    var sampleData = {
      _source: {
        alternate_city_names: ['Acmar'],
        area_codes: ['205'],
        city: 'Moody',
        county: 'St Clair County',
        created_at: '2016-10-10T22:47:38.000Z',
        estimated_population: 10090,
        id: 1,
        location: { lat: 33.59, lon: -86.49 },
        modified_at: '2016-10-10T22:47:38.000Z',
        state: 'AL',
        timezone: 'America/Chicago',
        zipcode: '35004'
      }
    };

    var output = Domain.prepareForAPIOutput(sampleData);

    assert.isDefined(output.alternate_city_names);
    assert.isDefined(output.area_codes);
    assert.isDefined(output.city);
    assert.isDefined(output.county);
    assert.isDefined(output.estimated_population);
    assert.isDefined(output.location);
    assert.isDefined(output.state);
    assert.isDefined(output.timezone);
    assert.isDefined(output.zipcode);

    assert.isTrue(output.alternate_city_names[0] === 'Acmar');
    assert.isTrue(output.area_codes[0] === '205');
    assert.isTrue(output.city === 'Moody');
    assert.isTrue(output.county === 'St Clair County');
    assert.isTrue(output.estimated_population === 10090);
    assert.isTrue(output.location.lat === 33.59);
    assert.isTrue(output.location.lon === -86.49);
    assert.isTrue(output.state === 'AL');
    assert.isTrue(output.timezone === 'America/Chicago');
    assert.isTrue(output.zipcode === '35004');

    assert.isUndefined(output.id);
    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  it('prepareForElasticSearch should return correct data', function() {

    var output = Domain.prepareForElasticSearch({
      acceptable_cities: 'Acmar',
      area_codes: '205',
      primary_city: 'Moody',
      county: 'St Clair County',
      created_at: '2016-10-10T22:47:38.000Z',
      estimated_population: 10090,
      id: 1,
      latitude: 33.59,
      longitude: -86.49,
      modified_at: '2016-10-10T22:47:38.000Z',
      state: 'AL',
      timezone: 'America/Chicago',
      zipcode: '35004'
    });

    assert.isDefined(output.id);
    assert.isDefined(output.alternate_city_names);
    assert.isDefined(output.area_codes);
    assert.isDefined(output.city);
    assert.isDefined(output.county);
    assert.isDefined(output.estimated_population);
    assert.isDefined(output.latitude);
    assert.isDefined(output.location);
    assert.isDefined(output.longitude);
    assert.isDefined(output.state);
    assert.isDefined(output.timezone);
    assert.isDefined(output.zipcode);

    assert.isTrue(output.id === 1);
    assert.isTrue(output.alternate_city_names[0] === 'Acmar');
    assert.isTrue(output.area_codes[0] === '205');
    assert.isTrue(output.city === 'Moody');
    assert.isTrue(output.county === 'St Clair County');
    assert.isTrue(output.estimated_population === 10090);
    assert.isTrue(output.latitude === 33.59);
    assert.isTrue(output.location.lat === 33.59);
    assert.isTrue(output.location.lon === -86.49);
    assert.isTrue(output.longitude === -86.49);
    assert.isTrue(output.state === 'AL');
    assert.isTrue(output.timezone === 'America/Chicago');
    assert.isTrue(output.zipcode === '35004');

    assert.isUndefined(output.created_at);
    assert.isUndefined(output.modified_at);
  });

  describe('getZipcode should return correct data', function() {
    beforeEach(function () {
      this.elasticsearchStub = this.sandbox.stub(client, 'search');
    });

    afterEach(function () {
      client.search.restore();
    });

    it('should return results', function(done) {

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 121, hits: [] }
      }));

      Domain.getZipcode('90210')
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should throw error', function(done) {

      this.elasticsearchStub.returns(Promise.reject('Fake Error'));

      Domain.getZipcode('90210')
        .then(function(results) {
          assert.isDefined(results);
          assert.isDefined(results.errors);
          assert.isDefined(results.data);

          assert.isTrue(results.errors.length === 1);
          assert.isTrue(results.errors[0] === 'Fake Error');
          assert.isTrue(results.data === null);

          done();
        });
    });
  });

  describe('getLocation should return correct data', function() {
    beforeEach(function () {
      this.elasticsearchStub = this.sandbox.stub(client, 'search');
    });

    afterEach(function () {
      client.search.restore();
    });

    var searchQuery = {
      pageSize: '30',
      page: '1',
      zipcode: '91601',
      city: 'North Hollywood',
      county: 'Los Angeles County',
      state: 'CA',
      areaCode: '818',
      timezone: 'America/Los_Angeles',
      minPopulation: 1000,
      maxPopulation: 100000,
      latitude: 34.16,
      longitude: -118.37
    };

    it('should return results with search params', function(done) {

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 121, hits: [] }
      }));

      Domain.getLocation(searchQuery)
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should return results with no params', function(done) {

      this.elasticsearchStub.returns(Promise.resolve({
        hits: { total: 121, hits: [] }
      }));

      Domain.getLocation({})
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });

    it('should throw error', function(done) {

      this.elasticsearchStub.returns(Promise.reject('Fake Error'));

      Domain.getLocation({})
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });
  });

  describe('getIpAddress should return correct data', function() {

    describe('mmdbreader should return correct data', function() {
      beforeEach(function () {
        this.sandbox.stub(mmdbreader, 'open', function (file, callback) {
          var cities = {
            getGeoData: function (ip, cb) {
              cb(null, {});
            }
          };

          callback(null, cities);
        });
      });

      it('should return results', function(done) {
        Domain.getIpAddress('97.96.74.114', 'cities')
          .then(function(results) {
            assert.isDefined(results);
            done();
          });
      });
    });

    describe('mmdbreader should return correct error', function() {
      beforeEach(function () {
        this.sandbox.stub(mmdbreader, 'open', function (file, callback) {
          var cities = {
            getGeoData: function (ip, cb) {
              cb(true, {});
            }
          };

          callback(null, cities);
        });
      });

      it('should return with error', function(done) {
        Domain.getIpAddress('97.96.74.114', 'countries')
          .catch(function(error) {
            assert.isDefined(error);
            assert.isTrue(error);
            done();
          });
      });

      it('should return with error', function(done) {
        Domain.getIpAddress('97.96.74.114', 'invalid name')
          .catch(function(error) {
            assert.isDefined(error);
            assert.isTrue(error === 'Invalid Source');
            done();
          });
      });
    });
  });
});