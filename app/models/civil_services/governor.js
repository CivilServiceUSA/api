/**
 * @module models/civil_services/governor
 * @version 1.1.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

/**
 * United States Senate
 * @type {object}
 * @property {number} id - Unique ID
 * @property {string} state_name - Name of State
 * @property {string} state_name_slug - Name of State converted to lowercase letters and spaces replaced with dashes
 * @property {string} state_code - Two Letter State Abbreviation
 * @property {string} state_code_slug - Two Letter State Abbreviation in lowercase letters
 * @property {string} votesmart - The numeric ID for this Governor on VoteSmart.org ( http://votesmart.org/candidate/69494 )
 * @property {enum} title - Title of Governor
 * @property {enum} party - Political Party of Governor
 * @property {string} name - Full Name of Governor
 * @property {string} name_slug - Full Name of Governor converted to lowercase letters and spaces replaced with dashes
 * @property {string} first_name - First Name of Governor
 * @property {string} [middle_name] - Middle Name of Governor
 * @property {string} last_name - Last Name of Governor
 * @property {string} [name_suffix] - Name Suffix of Governor
 * @property {string} [goes_by] - Name Governor Prefers to go by
 * @property {string} pronunciation - How to Pronounce Governor's Name
 * @property {enum} gender - Gender of Governor
 * @property {enum} ethnicity - Ethnicity of Governor
 * @property {enum} religion - Religion of Governor
 * @property {enum} openly_lgbtq - Governor is Openly LGBTQ
 * @property {date} date_of_birth - Date of Birth of Governor
 * @property {date} entered_office - Date Governor First Entered Office
 * @property {date} term_end - Date Governor's Current Term Ends
 * @property {string} biography - Governor's Biography from Congress.gov
 * @property {string} phone - Work Phone Number of Governor
 * @property {string} [fax] - Work Phone Number of Governor
 * @property {float} latitude - GPS Latitude of Office
 * @property {float} longitude - GPS Longitude of Office
 * @property {string} address_complete - Work Mailing Address of Governor
 * @property {number} [address_number]- Mailing Address Number
 * @property {string} [address_prefix] - Mailing Address Prefix
 * @property {string} [address_street] - Mailing Address Street
 * @property {string} [address_sec_unit_type] - Mailing Address Section Unit Type
 * @property {number} [address_sec_unit_num] - Mailing Address Section Unit Number
 * @property {string} [address_city] - Mailing Address City
 * @property {string} [address_state] - Mailing Address State
 * @property {string} [address_zipcode] - Mailing Address zipcode
 * @property {string} [address_type] - Mailing Address Type
 * @property {string} website - Governor's Website
 * @property {string} contact_page - Governor's Contact Page
 * @property {string} [facebook_url] - Facebook URL
 * @property {string} twitter_handle - Twitter Handle of Governor ( not always available )
 * @property {string} twitter_url - Twitter URL of Governor ( not always available )
 * @property {string} photo_url - Photo URL of Governor ( not always available )
 * @property {geometry} shape - GeoJSON Shape Data
 */
var Governor = db.dbApi.define('governor', {
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
  votesmart: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  title: {
    type: DataTypes.ENUM('governor'),
    allowNull: true,
    defaultValue: 'governor'
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
  religion: {
    type: DataTypes.ENUM('african-methodist','anglican','baptist','buddhism','catholic','christian','christian-reformed','christian-scientist','church-of-christ','church-of-god','congregationalist','deist','eastern-orthodox','episcopalian','evangelical','evangelical-lutheran','hindu','jewish','jodo-shinshu-buddhist','lutheran','methodist','mormon','muslim','nazarene-christian','pentecostal','presbyterian','protestant','roman-catholic','seventh-day-adventist-church','soka-gakkai-buddhist','southern-baptist','united-church-of-christ','united-methodist','unitarian-universalist','unspecified'),
    allowNull: true,
    defaultValue: 'unspecified'
  },
  openly_lgbtq: {
    type: DataTypes.ENUM('no','lesbian','gay','bisexual','transgender','queer'),
    allowNull: true,
    defaultValue: 'no'
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
  biography: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  fax: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    validate: { min: -90, max: 90 }
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    validate: { min: -180, max: 180 }
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
  website: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  contact_page: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  facebook_url: {
    type: DataTypes.STRING(100),
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
      fields: ['votesmart', 'name'],
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
      fields: ['religion']
    },
    {
      fields: ['openly_lgbtq']
    },
    {
      fields: ['shape'],
      type: 'spatial'
    }
  ],
  instanceMethods: {
    getAliases: function() {
      if (this.get('title') && this.get('first_name') && this.get('last_name') && this.get('party')) {
        var first_name = this.get('first_name');
        var last_name = this.get('last_name');
        var name = first_name + ' ' + last_name;
        var party = this.get('party').replace(/-/g, ' ').replace(/_/g, ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        var party_abbr = party.charAt(0).toUpperCase();

        var aliases = [
          party + ' ' + name,
          party + ' ' + last_name,
          'Governor ' + name,
          'Governor ' + last_name,
          'Gov. ' + name,
          'Gov. ' + last_name,
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

module.exports = Governor;
