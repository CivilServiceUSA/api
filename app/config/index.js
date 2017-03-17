/**
 * @module config
 */

var path = require('path');
var convict = require('convict');

/**
 * Default API Configuration
 * @type {object}
 * @property {object} devFlags - Developer Flags
 * @property {boolean} devFlags.enableBugTracking=false - Enable Bugsnag
 * @property {boolean} devFlags.enableGoogleAnalytics=false - Enable Google Analytics
 * @property {boolean} debug=false - Whether debugging is on or off
 * @property {string} debugKey - Allow for apiDevKey param in API to check API results without token
 * @property {enum} env=local - The current application environment ['local', 'mobile', 'staging', 'production' ]
 * @property {number} port=5000 - The port to bind to
 * @property {string} version=v1 - API Version Number ( in URL )
 * @property {string} sessionKey - Express Session Key
 * @property {boolean} inviteOnly=false - Whether Invite Only System should be Active
 * @property {number} inviteCap=15 - Invitation Cap Per User
 * @property {string} bugsnag - Bugsnag API Key
 * @property {object} hashID - Settings for Hash ID
 * @property {string} hashID.secret - Hash ID Encryption Key
 * @property {number} hashID.length=6 - Hash ID String Length
 * @property {string} hashID.alphabet=BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz - Hash ID Alphabet to use if creating Hashes ( remove vowels to prevent accidental words )
 * @property {object} database - Main Database Config Object
 * @property {object} database.api - Database Settings for API
 * @property {string} database.api.host=localhost - API MySQL Host
 * @property {string} database.api.database=api_database - API MySQL Database
 * @property {string} database.api.username=root - API MySQL Username
 * @property {string} database.api.password - API MySQL Password
 * @property {string} secret - App Secret Key
 * @property {object} router - Router Settings
 * @property {boolean} router.caseSensitive=true - Whether routes are case-sensitive
 * @property {boolean} router.mergeParams=true - Whether child routes should merge with parent route params
 * @property {object} elasticsearch - Elasticsearch Settings
 * @property {string} elasticsearch.host - The Elasticsearch host/connection string/URL
 * @property {string} elasticsearch.indexName - The name of the API Elasticsearch index
 * @property {object} mandrill - Mandrill Settings
 * @property {string} mandrill.key - API Key for Mandrill, which is used for sending email. Can be retrieved/changed at: {@link https://mandrillapp.com/settings/}
 */
var config = convict({
  devFlags: {
    enableBugTracking: {
      doc: 'Enable Bug Tracking',
      format: Boolean,
      default: false,
      env: 'API_DEV_FLAG_BUGSNAG'
    },
    enableGoogleAnalytics: {
      doc: 'Enable Google Analytics',
      format: Boolean,
      default: false,
      env: 'API_DEV_FLAG_ANALYTICS'
    }
  },
  debug: {
    doc: 'Whether debugging is on or off',
    format: Boolean,
    default: false,
    env: 'API_DEBUG'
  },
  debugKey: {
    doc: 'Allow for apiDevKey param in API to check API results without token',
    format: String,
    default: '97C83185-3909-BDD4-F9F0-E39C81B92F30',
    env: 'API_DEBUG_KEY'
  },
  env: {
    doc: 'The current application environment',
    format: ['local', 'mobile', 'staging', 'production', 'test', 'docker'],
    default: 'local',
    env: 'API_NODE_ENV'
  },
  port: {
    doc: 'The port to bind to',
    format: 'port',
    default: 5000,
    env: 'API_PORT'
  },
  version: {
    doc: 'API Version Number ( in URL )',
    format: String,
    default: 'v1',
    env: 'API_API_VERSION'
  },
  sessionKey: {
    doc: 'Express Session Key',
    format: String,
    default: '4D393E9A-5A83-37B4-6929-53C5231AA813',
    env: 'API_SESSION_KEY'
  },
  inviteOnly: {
    doc: 'Whether Invite Only System should be Active',
    format: Boolean,
    default: false,
    env: 'API_INVITE_ONLY'
  },
  inviteCap: {
    doc: 'Invitation Cap Per User',
    format: Number,
    default: 15,
    env: 'API_INVITE_CAP'
  },
  bugsnag: {
    doc: 'Bugsnag API Key',
    format: String,
    default: '',
    env: 'API_BUGSNAG'
  },
  analytics: {
    doc: 'Google Analytics API Key',
    format: String,
    default: '',
    env: 'API_GOOGLE_ANALYTICS'
  },
  hashID: {
    secret: {
      doc: 'Hash ID Encryption Key',
      format: String,
      default: '02BFD94E-BA1D-F7A4-CDB7-32BA1E9A6C3D',
      env: 'API_HASH_ID_SECRET'
    },
    length: {
      doc: 'Hash ID String Length',
      format: Number,
      default: 6,
      env: 'API_HASH_ID_LENGTH'
    },
    alphabet: {
      doc: 'Hash ID Alphabet to use if creating Hashes ( remove vowels to prevent accidental words )',
      format: String,
      default: 'BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz',
      env: 'API_HASH_ID_ALPHABET'
    }
  },
  database: {
    api: {
      host: {
        doc: 'API MySQL Host',
        format: String,
        default: 'localhost',
        env: 'API_API_HOST'
      },
      database: {
        doc: 'API MySQL Database',
        format: String,
        default: 'api_database',
        env: 'API_API_DATABASE'
      },
      username: {
        doc: 'API MySQL Username',
        format: String,
        default: 'root',
        env: 'API_API_USERNAME'
      },
      password: {
        doc: 'API MySQL Password',
        format: String,
        default: '',
        env: 'API_API_PASSWORD'
      }
    }
  },
  secret: {
    doc: 'App secret key',
    format: String,
    default: 'CB3F63A5-3C80-7444-DD2D-E9D31DB869CF',
    env: 'API_APP_SECRET'
  },
  router: {
    caseSensitive: {
      doc: 'Whether routes are case-sensitive',
      format: Boolean,
      default: true
    },
    mergeParams: {
      doc: 'Whether child routes should merge with parent route params',
      format: Boolean,
      default: true
    }
  },
  elasticsearch: {
    host: {
      doc: 'The Elasticsearch host/connection string/URL',
      format: String,
      env: 'API_ELASTIC_SEARCH',
      default: 'http://localhost:9200'
    },
    indexName: {
      doc: 'The name of the API Elasticsearch index',
      format: String,
      default: 'api'
    },
    apiVersion: {
      doc: 'Change the API that they client provides, specify the major version of the Elasticsearch nodes you will be connecting to.',
      format: String,
      default: '2.3'
    },
    requestTimeout: {
      doc: 'Milliseconds before an HTTP request will be aborted and retried. This can also be set per request.',
      format: Number,
      default: 30000
    },
    log: {
      doc: 'Elasticsearch API Logging. See: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/logging.html',
      format: '*',
      default: 'error'
    }
  },
  mandrill: {
    key: {
      doc: 'API Key for Mandrill, which is used for sending email. Can be retrieved/changed at: https://mandrillapp.com/settings/',
      format: String,
      env: 'API_MANDRILL_API_KEY'
    }
  },
  openStates: {
    key: {
      doc: 'API Key for Open States',
      format: String,
      env: 'API_OPENSTATES_API_KEY'
    }
  },
  logzio: {
    token: {
      doc: 'Logzio API logging token',
      format: String,
      env: 'API_LOGZIO_TOKEN',
      default: ''
    },
    type: {
      doc: 'The name of the API Elasticsearch index',
      format: String,
      env: 'API_LOGZIO_TYPE',
      default: 'CivilServiceAPI'
    },
    debug: {
      doc: 'Print debug messages to the console',
      format: Boolean,
      env: 'API_LOGZIO_DEBUG',
      default: false
    }
  },
  redis: {
    host: {
      doc: 'Redis Host',
      format: String,
      env: 'API_REDIS_HOST',
      default: '127.0.0.1'
    },
    port: {
      doc: 'Redis Port',
      format: 'port',
      env: 'API_REDIS_PORT',
      default: 6379
    },
    password: {
      doc: 'Redis Password',
      format: String,
      env: 'API_REDIS_PASSWORD',
      default: null
    },
    cacheExpire: {
      doc: 'How long to cache results in redis',
      format: Number,
      env: 'API_REDIS_CACHE_EXPIRE',
      default: 21600
    }
  }
});

var env = config.get('env');
try {
  config.loadFile(path.join(__dirname, env + '.json'));
  config.validate({strict: true});
} catch(e) {
  if(e.message.indexOf('configuration param') === -1){
    console.error('INVALID CONFIG: ' + e.name + ' - ' + e.message);
  }
}

module.exports = config;
