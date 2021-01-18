/**
 * @module models/civil_services/house
 * @version 1.0.0
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
 * @property {string} district - District of Representative ( not always available )
 * @property {boolean} at_large - Representative is considered At-Large
 * @property {boolean} vacant - Representative Seat is Vacant
 * @property {string} bioguide - The alphanumeric ID for this Senator on http://bioguide.congress.gov ( http://bioguide.congress.gov/scripts/biodisplay.pl?index=C001075 )
 * @property {string} [thomas] - The numeric ID for this Senator ( not really used anymore )
 * @property {string} opensecrets - The alphanumeric ID for this Senator on OpenSecrets.org ( https://www.opensecrets.org/politicians/summary.php?cid=N00030245 )
 * @property {string} votesmart - The numeric ID for this Senator on VoteSmart.org ( http://votesmart.org/candidate/69494 )
 * @property {string} [fec] - Federal Election Commission ID ( http://www.fec.gov/fecviewer/CandidateCommitteeDetail.do?candidateCommitteeId=H6AL04098 )
 * @property {string} [maplight] - The numeric ID for this Senator on MapLight.org  ( http://maplight.org/us-congress/legislator/127 )
 * @property {string} [wikidata] - The numeric ID for this Senator on wikidata.org ( https://www.wikidata.org/wiki/Q672671 )
 * @property {string} [google_entity_id] - Google Integration
 * @property {enum} title - Title of Senator
 * @property {enum} party - Political Party of Senator
 * @property {string} name - Full Name of Senator
 * @property {string} name_slug - Full Name of Senator converted to lowercase letters and spaces replaced with dashes
 * @property {string} first_name - First Name of Senator
 * @property {string} [middle_name] - Middle Name of Senator
 * @property {string} last_name - Last Name of Senator
 * @property {string} [name_suffix] - Name Suffix of Senator
 * @property {string} [goes_by] - Name Senator Prefers to go by
 * @property {string} pronunciation - How to Pronounce Senator's Name
 * @property {enum} gender - Gender of Senator
 * @property {enum} ethnicity - Ethnicity of Senator
 * @property {enum} religion - Religion of Senator
 * @property {enum} openly_lgbtq - Senator is Openly LGBTQ
 * @property {date} date_of_birth - Date of Birth of Senator
 * @property {date} entered_office - Date Senator First Entered Office
 * @property {date} term_end - Date Senator's Current Term Ends
 * @property {string} biography - Senator's Biography from Congress.gov
 * @property {string} phone - Work Phone Number of Senator
 * @property {string} [fax] - Work Phone Number of Senator
 * @property {float} latitude - GPS Latitude of Office
 * @property {float} longitude - GPS Longitude of Office
 * @property {string} address_complete - Work Mailing Address of Senator
 * @property {number} [address_number]- Mailing Address Number
 * @property {string} [address_prefix] - Mailing Address Prefix
 * @property {string} [address_street] - Mailing Address Street
 * @property {string} [address_sec_unit_type] - Mailing Address Section Unit Type
 * @property {number} [address_sec_unit_num] - Mailing Address Section Unit Number
 * @property {string} [address_city] - Mailing Address City
 * @property {string} [address_state] - Mailing Address State
 * @property {string} [address_zipcode] - Mailing Address zipcode
 * @property {string} [address_type] - Mailing Address Type
 * @property {string} website - Senator's Website
 * @property {string} contact_page - Senator's Contact Page
 * @property {string} [facebook_url] - Facebook URL
 * @property {string} twitter_handle - Twitter Handle of Senator ( not always available )
 * @property {string} twitter_url - Twitter URL of Senator ( not always available )
 * @property {string} photo_url - Photo URL of Senator ( not always available )
 * @property {geometry} shape - GeoJSON Shape Data
 */
var House = db.dbApi.define('house', {
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
  district: {
    type: DataTypes.INTEGER(2).UNSIGNED,
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
  bioguide: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  thomas: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  opensecrets: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  votesmart: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  fec: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  maplight: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  wikidata: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  google_entity_id: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  title: {
    type: DataTypes.ENUM('representative','house-speaker','house-majority-leader','house-majority-whip','house-minority-leader','house-minority-whip','republican-conference-chairman','republican-policy-committee-chairman','assistant-democratic-leader','democratic-caucus-chairman'),
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
    type: DataTypes.STRING(100),
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
      fields: ['bioguide', 'name'],
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
        var title = this.get('title').replace(/-/g, ' ').replace(/_/g, ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        var first_name = this.get('first_name');
        var last_name = this.get('last_name');
        var name = first_name + ' ' + last_name;
        var party = this.get('party').replace(/-/g, ' ').replace(/_/g, ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        var party_abbr = party.charAt(0).toUpperCase();

        var aliases = [
          party + ' ' + name,
          party + ' ' + last_name,
          'Representative ' + name,
          'Representative ' + last_name,
          'Rep. ' + name,
          'Rep. ' + last_name,
          name + ' [' + party_abbr + ']',
          name + ' (' + party_abbr + ')'
        ];

        if (title !== 'Representative') {
          aliases.push(title + ' ' + name);
          aliases.push(title + ' ' + last_name);
          aliases.push(title.replace('House ', '') + ' ' + name);
          aliases.push(title.replace('House ', '') + ' ' + last_name);
        }

        return aliases;
      } else {
        return [];
      }
    }
  }
});

module.exports = House;
