var assert = require('chai').assert;
var sinon = require('sinon');

var Model = require('../../../../../app/models/civil_services/police_killings');
var Domain = require('../../../../../app/api/v1/domain/police_killings');

describe('Domain Police Killings', function() {
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

  it('searchPoliceKillings should be defined', function() {
    assert.isDefined(Domain.searchPoliceKillings);
  });

  it('prepareForAPIOutput should return correct data', function() {
    var sampleData = [{
      dataValues: {
        id: 1,
        state: 'CA',
        city: 'Hollywood',
        killings: 123,
        created_at: '2016-10-10T22:47:38.000Z',
        modified_at: '2016-10-10T22:47:38.000Z'
      }
    }];

    var output = Domain.prepareForAPIOutput(sampleData);

    assert.isDefined(output[0].state);
    assert.isDefined(output[0].city);
    assert.isDefined(output[0].killings);

    assert.isTrue(output[0].state === 'CA');
    assert.isTrue(output[0].city === 'Hollywood');
    assert.isTrue(output[0].killings === 123);

    assert.isUndefined(output[0].id);
    assert.isUndefined(output[0].created_at);
    assert.isUndefined(output[0].modified_at);
  });

  describe('searchPoliceKillings', function() {
    beforeEach(function() {
      this.policeKillingsStub = this.sandbox.stub(Model, 'findAndCountAll');
    });

    it('should return killings with params', function(done) {
      var fakeQuery = {
        pageSize: '30',
        page: '1',
        state: 'CA',
        city: 'Hollywood',
        min: '15',
        max: '100',
        beforeDate: '2016-12-31',
        afterDate: '2016-01-31'
      };
      var fakeResponse = {
        rows: [
          {
            "state": "AL",
            "city": null,
            "killings": 20
          },
          {
            "state": "AK",
            "city": null,
            "killings": 6
          },
          {
            "state": "AZ",
            "city": null,
            "killings": 38
          }
        ]
      };

      this.policeKillingsStub.returns(Promise.resolve(fakeResponse));

      Domain.searchPoliceKillings(fakeQuery)
      .then(function(results) {
        assert.isDefined(results);
        done();
      });
    });

    it('should return killings without params', function(done) {
      var fakeQuery = {};
      var fakeResponse = {
        rows: [
          {
            "state": "AL",
            "city": null,
            "killings": 20
          },
          {
            "state": "AK",
            "city": null,
            "killings": 6
          },
          {
            "state": "AZ",
            "city": null,
            "killings": 38
          }
        ]
      };

      this.policeKillingsStub.returns(Promise.resolve(fakeResponse));

      Domain.searchPoliceKillings(fakeQuery)
        .then(function(results) {
          assert.isDefined(results);
          done();
        });
    });
  });
});