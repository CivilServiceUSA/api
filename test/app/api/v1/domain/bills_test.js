var assert = require('chai').assert;
var sinon = require('sinon');
var http = require('http');
var mockReq = require('mock-req');
var mockRes = require('mock-res');

var Model = require('../../../../../app/models/civil_services/bills');
var Domain = require('../../../../../app/api/v1/domain/bills');

var openStatesResponse = {
  "actions": [],
  "sources": [],
  "session": "2016",
  "id": "FLB00011440",
  "votes": [
    {
      "other_count": 0,
      "other_votes": [],
      "yes_count": 1,
      "yes_votes": [
        {
          "leg_id": "FLL000054",
          "name": "Brandes"
        }
      ],
      "id": "FLV00006864",
      "motion": "Favorable with Committee Substitute",
      "chamber": "upper",
      "state": "fl",
      "session": "2016",
      "sources": [
        {
          "url": "http://flsenate.gov/Session/Bill/2016/1044/Vote/2016-01-25 0100PM~S1044 Vote Record.PDF"
        }
      ],
      "passed": true,
      "date": "2016-01-25 00:00:00",
      "vote_id": "FLV00006864",
      "type": "other",
      "no_count": 1,
      "bill_id": "FLB00011440",
      "no_votes": [
        {
          "leg_id": "FLL000170",
          "name": "Bradley"
        }
      ]
    }
  ],
  "chamber": "upper",
  "bill_id": "SB 1044"
};

describe('Domain Bills', function() {
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

  it('searchBills should be defined', function() {
    assert.isDefined(Domain.searchBills);
  });

  it('prepareForAPIOutput should return correct data', function() {
    var sampleData = [{
      dataValues: {
        bill_id: 'SB 443',
        chamber: 'upper',
        city: 'Hollywood',
        created_at: '2016-10-10T22:47:38.000Z',
        details_url: 'https://openstates.org/ca/bills/20152016/SB443/',
        id: 1,
        long_description: '',
        modified_at: '2016-10-10T22:47:38.000Z',
        notes: '',
        progress: 'good',
        published: true,
        session_id: '20152016',
        short_description: 'ends civil asset forfeiture',
        state: 'CA',
        status: 'considering',
        vote: 'unknown'
      }
    }];

    var output = Domain.prepareForAPIOutput(sampleData);

    assert.isDefined(output.upper);
    assert.isDefined(output.upper[0].bill_id);
    assert.isDefined(output.upper[0].chamber);
    assert.isDefined(output.upper[0].city);
    assert.isDefined(output.upper[0].details_url);
    assert.isDefined(output.upper[0].long_description);
    assert.isDefined(output.upper[0].progress);
    assert.isDefined(output.upper[0].session_id);
    assert.isDefined(output.upper[0].short_description);
    assert.isDefined(output.upper[0].state);
    assert.isDefined(output.upper[0].status);
    assert.isDefined(output.upper[0].vote);

    assert.isTrue(output.upper[0].bill_id === 'SB 443');
    assert.isTrue(output.upper[0].chamber === 'upper');
    assert.isTrue(output.upper[0].city === 'Hollywood');
    assert.isTrue(output.upper[0].details_url === 'https://openstates.org/ca/bills/20152016/SB443/');
    assert.isTrue(output.upper[0].long_description === '');
    assert.isTrue(output.upper[0].progress === 'good');
    assert.isTrue(output.upper[0].session_id === '20152016');
    assert.isTrue(output.upper[0].short_description === 'ends civil asset forfeiture');
    assert.isTrue(output.upper[0].state === 'CA');
    assert.isTrue(output.upper[0].status === 'considering');
    assert.isTrue(output.upper[0].vote === 'unknown');

    assert.isUndefined(output.upper[0].created_at);
    assert.isUndefined(output.upper[0].id);
    assert.isUndefined(output.upper[0].modified_at);
  });

  describe('searchBills', function() {
    beforeEach(function() {
      this.request = sinon.stub(http, 'request');
      this.billsStub = this.sandbox.stub(Model, 'findAndCountAll');
    });

    afterEach(function() {
      http.request.restore();
      this.billsStub.restore();
    });

    it('should return bill without params', function(done) {
      var fakeQuery = {};

      var fakeResponse = {
        rows: [
          {
            dataValues: {
              "bill_id": "SB 443",
              "chamber": "upper",
              "city": null,
              "details_url": "https://openstates.org/ca/bills/20152016/SB443/",
              "long_description": null,
              "progress": "good",
              "session_id": "20152016",
              "short_description": "ends civil asset forfeiture",
              "state": "CA",
              "status": "passed"
            }
          }
        ]
      };

      this.billsStub.returns(Promise.resolve(fakeResponse));

      Domain.searchBills(fakeQuery)
      .then(function(results) {
        assert.isDefined(results);
        done();
      });
    });

    it('should throw error for no Open States call', function(done) {
      var response = new mockRes();

      response.write('');
      response.end();

      var request = new mockReq();

      this.request.callsArgWith(1, response).returns(request);

      var fakeQuery = {};
      var fakeResponse = {};

      this.billsStub.returns(Promise.resolve(fakeResponse));

      Domain.searchBills(fakeQuery)
        .catch(function(error) {
          assert.isDefined(error);
          done();
        });
    });
  });
});
