/**
 * @module routes/police_killings
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');
var PoliceKillings = require('../domain/police_killings');
var router = express.Router(config.router);

/**
 * Bills
 * @memberof module:routes/police_killings
 * @name [GET] /police-killings
 * @property {string} [state] - Two Letter US State Code Abbreviation ( ISO 3166 )
 * @property {string} [city] - Specific City this Bill Belongs to
 * @property {number} [min] - Minimum Number of Police Killings
 * @property {number} [max] - Maximum Number of Police Killings
 * @property {string} [beforeDate] - Filter by Bills Created Before or On this Date
 * @property {string} [afterDate] - Filter by Bills Created After or On this Date
 * @property {number} [pageSize=30] - Set Number of Results per Page
 * @property {number} [page=1] - Result Page to Load
 * @property {boolean} [pretty=false] - Format JSON response to be human readable
 */
/* istanbul ignore next */
router.route('/police-killings').get(function(request, response) {
  PoliceKillings.searchPoliceKillings(request.query).then(function (data) {
    response.json(util.createAPIResponse({
      meta: data.meta,
      data: PoliceKillings.prepareForAPIOutput(data.rows)
    }));
  }).catch(function (error) {
    response.json(util.createAPIResponse({
      error: true,
      errors: [error]
    }));
  });
});

module.exports = router;
