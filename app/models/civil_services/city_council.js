/**
 * @module models/civil_services/city_council
 * @version 1.0.2
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

/**
 * Zip Codes
 * @type {object}
 * @property {number} id - Unique ID
 * @property {string} state - State City Council belongs to
 * @property {string} city - The City Name or City Council
 * @property {string} representative - Name of City Council Representative
 * @property {enum} title=council_member - Title of City Council Representative ['council_member','mayor','district_attorney']
 * @property {number} district_number - District Number
 * @property {enum} party=nonpartisan - Party of City Council Representative ['democrat','republican','nonpartisan']
 * @property {string} [email] - Email Address
 * @property {string} [phone] - Phone Number
 * @property {string} [twitter_url] - Twitter URL
 * @property {string} [facebook_url] - Facebook URL
 * @property {string} [photo_url] - Photo URL
 */
var CityCouncil = db.dbApi.define('city_council', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  state_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  state_name_slug: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  state_code: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  state_code_slug: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  city_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  city_name_slug: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  district: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  at_large: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  vacant: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  title: {
    type: DataTypes.ENUM('alderman','chairman','city-attorney','city-auditor','city-controller','commissioner','council-president','councilor','deputy-leader','deputy-mayor-pro-tem','deputy-majority-leader','deputy-majority-whip','deputy-minority-leader','deputy-minority-whip','district-attorney','majority-leader','majority-whip','mayor','mayor-pro-tem','minority-leader','minority-whip','representative','supervisor','president','president-pro-tem','vice-chairman','vice-mayor','vice-president','vacant'),
    allowNull: true,
    defaultValue: 'representative'
  },
  party: {
    type: DataTypes.ENUM('constitution','democrat','green','independent','libertarian','nonpartisan','republican'),
    allowNull: true,
    defaultValue: 'nonpartisan'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  name_slug: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  middle_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  name_suffix: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  goes_by: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  pronunciation: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('female','male','unspecified'),
    allowNull: true,
    defaultValue: 'unspecified'
  },
  ethnicity: {
    type: DataTypes.ENUM('african-american','asian-american','hispanic-american','middle-eastern-american','multi-racial-american','native-american','pacific-islander','white-american','unspecified'),
    allowNull: true,
    defaultValue: 'unspecified'
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: true
  },
  entered_office: {
    type: DataTypes.DATE,
    allowNull: true
  },
  term_end: {
    type: DataTypes.DATE,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  latitude: {
    type: DataTypes.FLOAT(14),
    allowNull: true
  },
  longitude: {
    type: DataTypes.FLOAT(14),
    allowNull: true
  },
  address_complete: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  address_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  address_prefix: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  address_street: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  address_sec_unit_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  address_sec_unit_num: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  address_city: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  address_state: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  address_zipcode: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  address_type: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  population: {
    type: DataTypes.INTEGER(2).UNSIGNED,
    allowNull: true
  },
  background_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  city_government_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  city_council_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  city_council_calendar_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  city_council_legislation_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  city_council_committees_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  twitter_handle: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  twitter_url: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  facebook_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  photo_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  shape: {
    type: DataTypes.GEOMETRY,
    allowNull: false
  }
}, {
  validate: {
    bothCoordsOrNone: function() {
      if ((this.latitude === null) !== (this.longitude === null)) {
        throw new Error('Require either both latitude and longitude or neither');
      }
    }
  },
  indexes: [
    {
      fields: ['state_name', 'city_name', 'name'],
      unique: true
    },
    {
      fields: ['state_name_slug']
    },
    {
      fields: ['state_code_slug']
    },
    {
      fields: ['title']
    },
    {
      fields: ['party']
    },
    {
      fields: ['gender']
    },
    {
      fields: ['ethnicity']
    },
    {
      fields: ['shape'],
      type: 'spatial'
    }
  ],
  instanceMethods: {
    getAliases: function() {
      if (this.get('title') && this.get('first_name') && this.get('last_name') && this.get('party')) {
        var title = this.get('title').replace(/-/g, ' ').replace(/_/g, ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        var first_name = this.get('first_name');
        var last_name = this.get('last_name');
        var name = first_name + ' ' + last_name;
        var party = this.get('party').replace(/-/g, ' ').replace(/_/g, ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        var party_abbr = party.charAt(0).toUpperCase();

        var aliases = [
          party + ' ' + name,
          party + ' ' + last_name,
          title + ' ' + name,
          title + ' ' + last_name,
          name + ' [' + party_abbr + ']',
          name + ' (' + party_abbr + ')'
        ];

        return aliases;
      } else {
        return [];
      }
    }
  }
});

module.exports = CityCouncil;
