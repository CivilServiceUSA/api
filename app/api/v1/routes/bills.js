/**
 * @module routes/bills
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');
var BillsDomain = require('../domain/bills');
var router = express.Router(config.router);

/**
 * Bills
 * @memberof module:routes/bills
 * @name [GET] /bills
 * @property {enum} [status] - Status of Bill ['considering','passed','failed']
 * @property {enum} [progress] - Whether this bill passing is Good or Bad ['good','bad']
 * @property {enum} [chamber] - Which Chamber of Congress this bill is for ['upper','lower']
 * @property {string} [state] - Two Letter US State Code Abbreviation ( ISO 3166, required to get vote status )
 * @property {string} [city] - Specific City this Bill Belongs to
 * @property {string} [billId] - Unique Bill ID from Open States ( required to get vote status )
 * @property {string} [repId] - Unique Representative ID from Open States ( required to get vote status )
 * @property {string} [sessionId] - Unique Session ID from Open States ( required to get vote status )
 * @property {string} [beforeDate] - Filter by Bills Created Before or On this Date
 * @property {string} [afterDate] - Filter by Bills Created After or On this Date
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/bills').get(function(request, response) {
  BillsDomain.searchBills(request.query).then(function (data) {
    response.json(util.createAPIResponse({
      meta: data.meta,
      data: BillsDomain.prepareForAPIOutput(data.rows)
    }));
  }).catch(function (error) {
    response.json(util.createAPIResponse({
      error: true,
      errors: [error]
    }));
  });
});

module.exports = router;
