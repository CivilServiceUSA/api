var assert = require('chai').assert;
var ZipCode = require('../../../../app/models/civil_services/zipcode');

describe('Models Zip Code', function() {

  var fakeZipCode = {};
  var restore = function(){
    fakeZipCode = {
      id: 1,
      zipcode: "00601",
      primary_city: "Adjuntas",
      acceptable_cities: null,
      unacceptable_cities: "Colinas Del Gigante, Jard De Adjuntas, Urb San Joaquin",
      state: "PR",
      county: "Adjuntas",
      timezone: "America/Puerto_Rico",
      area_codes: "787,939",
      latitude: 18.16000000,
      longitude: -66.72000000,
      estimated_population: "0",
      shape: {},
      created_date: new Date(),
      modified_date: new Date()
    };
  };

  it('should be defined', function() {
    assert.isDefined(ZipCode);
  });
});