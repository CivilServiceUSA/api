/**
 * @module domain/util/registration
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var Promise = require('bluebird');
var randomString = require('randomstring');
var email = require('../email');
var hasher = require('../../../../util/hasher');
var User = require('../../../../models/api/users');
var UserInvite = require('../../../../models/api/user_invite');
var config = require('../../../../config');
var RegistrationForm = require('./registration_form');
var auth = require('./auth');
var Hashids = require('hashids');

var hashID = new Hashids(config.get('hashID.secret'), config.get('hashID.length'), config.get('hashID.alphabet'));

/**
 * Registration
 * @type {object}
 */
module.exports = {

  /**
   * Confirmation Key Length
   * @constant {number}
   */
  CONFIRMATION_KEY_LENGTH: 12,

  /**
   * Extensive List of Usernames that cannot be used
   * @constant {array}
   */
  INVALID_NAMES: [
    '400', '401', '403', '404', '500', 'about', 'abuse', 'account', 'account', 'add', 'admin', 'administration',
    'administrator', 'advertise', 'affiliate', 'affiliates', 'ajax', 'api', 'app', 'apps', 'auth', 'autoconfig',
    'backup', 'banner', 'beta', 'billing', 'billings', 'blog', 'blogs', 'bookmark', 'bookmarks', 'broadcasthost',
    'cache', 'calendar', 'campaign', 'careers', 'cart', 'change', 'chat', 'checkout', 'comment', 'comments',
    'compose', 'config', 'connect', 'contact', 'contest', 'cookies', 'copyright', 'create', 'css', 'dashboard',
    'deals', 'delete', 'dev', 'disconnect', 'dns', 'docs', 'documentation', 'download', 'downloads', 'downvote',
    'drop', 'edit', 'email', 'enterprise', 'error', 'errors', 'event', 'events', 'example', 'exception', 'exit',
    'false', 'faq', 'faqs', 'features', 'feed', 'feedback', 'feeds', 'feeds', 'follow', 'follower', 'followers',
    'following', 'forgot', 'forgot-password', 'forgotpassword', 'forum', 'forums', 'friend', 'friends', 'group',
    'groups', 'guest', 'head', 'header', 'help', 'home', 'host', 'hosting', 'hostmaster', 'htpasswd', 'http',
    'https', 'images', 'imap', 'info', 'insert', 'investors', 'invitations', 'invite', 'invite', 'invites', 'invoice',
    'is', 'isatap', 'isatap', 'issues', 'it', 'jobs', 'join', 'json', 'learn', 'licensing', 'load', 'local',
    'localdomain', 'localhost', 'login', 'logout', 'lost-password', 'mail', 'mail', 'mailer-daemon', 'mailerdaemon',
    'marketing', 'marketplace', 'master', 'me', 'media', 'message', 'messages', 'mis', 'moderator', 'modify', 'more',
    'mx', 'my', 'new', 'news', 'newsletter', 'newsletters', 'next', 'nil', 'no-reply', 'nobody', 'noc', 'none',
    'noreply', 'notification', 'notifications', 'ns0', 'ns1', 'ns2', 'ns3', 'ns4', 'ns5', 'ns6', 'ns7', 'ns8', 'ns9',
    'null', 'oauth', 'offer', 'offers', 'online', 'openid', 'order', 'orders', 'owner', 'page', 'pages', 'partners',
    'passwd', 'password', 'pay', 'payment', 'payments', 'photo', 'photos', 'plans', 'policies', 'policy', 'pop',
    'pop3', 'popular', 'postmaster', 'poweruser', 'previous', 'pricing', 'print', 'privacy', 'product', 'profile',
    'profiles', 'put', 'quota', 'redirect', 'refund', 'refuns', 'register', 'remove', 'replies', 'reply', 'request',
    'request-password', 'reset', 'reset-password', 'response', 'return', 'returns', 'review', 'reviews', 'root',
    'rootuser', 'rss', 'rules', 'sales', 'save', 'search', 'security', 'select', 'services', 'session', 'sessions',
    'settings', 'share', 'shift', 'shop', 'signin', 'signup', 'site', 'sitemap', 'sites', 'smtp', 'sort', 'sql',
    'ssl', 'ssladmin', 'ssladministrator', 'sslwebmaster', 'stage', 'stats', 'status', 'store', 'subscribe', 'sudo',
    'super', 'superuser', 'support', 'survey', 'sync', 'sysadmin', 'system', 'tag', 'tags', 'team', 'terms',
    'terms-of-use', 'test', 'testimonials', 'topic', 'topics', 'tour', 'translations', 'trial', 'true', 'undefined',
    'unfollow', 'unsubscribe', 'update', 'usenet', 'user', 'username', 'users', 'uucp', 'var', 'view', 'void', 'vote',
    'webmaster', 'website', 'widget', 'widgets', 'wiki', 'wpad', 'write', 'www', 'you', '4r5e', '5h1t', '5hit', 'a55',
    'anal', 'anus', 'ar5e', 'arrse', 'arse', 'ass', 'ass-fucker', 'asses', 'assfucker', 'assfukka', 'asshole', 'assholes',
    'asswhole', 'a_s_s', 'b!tch', 'b00bs', 'b17ch', 'b1tch', 'ballbag', 'ballsack', 'bastard', 'beastial', 'beastiality',
    'bellend', 'bestial', 'bestiality', 'bi+ch', 'biatch', 'bitch', 'bitcher', 'bitchers', 'bitches', 'bitchin', 'bitching',
    'bloody', 'blow job', 'blowjob', 'blowjobs', 'boiolas', 'bollock', 'bollok', 'boner', 'boob', 'boobs', 'booobs',
    'boooobs', 'booooobs', 'booooooobs', 'breasts', 'buceta', 'bugger', 'bum', 'bunny fucker', 'butt', 'butthole',
    'buttmuch', 'buttplug', 'c0ck', 'c0cksucker', 'carpet muncher', 'cawk', 'chink', 'cipa', 'cl1t', 'clit',
    'clitoris', 'clits', 'cnut', 'cock', 'cock-sucker', 'cockface', 'cockhead', 'cockmunch', 'cockmuncher', 'cocks',
    'cocksuck', 'cocksucked', 'cocksucker', 'cocksucking', 'cocksucks', 'cocksuka', 'cocksukka', 'cok',
    'cokmuncher', 'coksucka', 'coon', 'crap', 'cum', 'cummer', 'cumming', 'cums', 'cumshot', 'cunilingus',
    'cunillingus', 'cunnilingus', 'cunt', 'cuntlick', 'cuntlicker', 'cuntlicking', 'cunts', 'cyalis', 'cyberfuc',
    'cyberfuck', 'cyberfucked', 'cyberfucker', 'cyberfuckers', 'cyberfucking', 'd1ck', 'damn', 'dick', 'dickhead',
    'dildo', 'dildos', 'dink', 'dinks', 'dirsa', 'dlck', 'dog-fucker', 'doggin', 'dogging', 'donkeyribber', 'doosh',
    'duche', 'dyke', 'ejaculate', 'ejaculated', 'ejaculates', 'ejaculating', 'ejaculatings', 'ejaculation',
    'ejakulate', 'f u c k', 'f u c k e r', 'f4nny', 'fag', 'fagging', 'faggitt', 'faggot', 'faggs', 'fagot', 'fagots',
    'fags', 'fanny', 'fannyflaps', 'fannyfucker', 'fanyy', 'fatass', 'fcuk', 'fcuker', 'fcuking', 'feck', 'fecker',
    'felching', 'fellate', 'fellatio', 'fingerfuck', 'fingerfucked', 'fingerfucker', 'fingerfuckers',
    'fingerfucking', 'fingerfucks', 'fistfuck', 'fistfucked', 'fistfucker', 'fistfuckers', 'fistfucking',
    'fistfuckings', 'fistfucks', 'flange', 'fook', 'fooker', 'fuck', 'fucka', 'fucked', 'fucker', 'fuckers',
    'fuckhead', 'fuckheads', 'fuckin', 'fucking', 'fuckings', 'fuckingshitmotherfucker', 'fuckme', 'fucks',
    'fuckwhit', 'fuckwit', 'fudge packer', 'fudgepacker', 'fuk', 'fuker', 'fukker', 'fukkin', 'fuks', 'fukwhit',
    'fukwit', 'fux', 'fux0r', 'f_u_c_k', 'gangbang', 'gangbanged', 'gangbangs', 'gaylord', 'gaysex', 'goatse',
    'god', 'god-dam', 'god-damned', 'goddamn', 'goddamned', 'hardcoresex', 'hell', 'heshe', 'hoar', 'hoare', 'hoer',
    'homo', 'hore', 'horniest', 'horny', 'hotsex', 'jack-off', 'jackoff', 'jap', 'jerk-off', 'jism', 'jiz', 'jizm',
    'jizz', 'kawk', 'knob', 'knobead', 'knobed', 'knobend', 'knobhead', 'knobjocky', 'knobjokey', 'kock', 'kondum',
    'kondums', 'kum', 'kummer', 'kumming', 'kums', 'kunilingus', 'l3i+ch', 'l3itch', 'labia', 'lmfao', 'lust',
    'lusting', 'm0f0', 'm0fo', 'm45terbate', 'ma5terb8', 'ma5terbate', 'masochist', 'master-bate', 'masterb8',
    'masterbat*', 'masterbat3', 'masterbate', 'masterbation', 'masterbations', 'masturbate', 'mo-fo', 'mof0', 'mofo',
    'mothafuck', 'mothafucka', 'mothafuckas', 'mothafuckaz', 'mothafucked', 'mothafucker', 'mothafuckers',
    'mothafuckin', 'mothafucking', 'mothafuckings', 'mothafucks', 'mother fucker', 'motherfuck', 'motherfucked',
    'motherfucker', 'motherfuckers', 'motherfuckin', 'motherfucking', 'motherfuckings', 'motherfuckka', 'motherfucks',
    'muff', 'mutha', 'muthafecker', 'muthafuckker', 'muther', 'mutherfucker', 'n1gga', 'n1gger', 'nazi', 'nigg3r',
    'nigg4h', 'nigga', 'niggah', 'niggas', 'niggaz', 'nigger', 'niggers', 'nob', 'nob jokey', 'nobhead', 'nobjocky',
    'nobjokey', 'numbnuts', 'nutsack', 'orgasim', 'orgasims', 'orgasm', 'orgasms', 'p0rn', 'pawn', 'pecker',
    'penis', 'penisfucker', 'phonesex', 'phuck', 'phuk', 'phuked', 'phuking', 'phukked', 'phukking', 'phuks', 'phuq',
    'pigfucker', 'pimpis', 'piss', 'pissed', 'pisser', 'pissers', 'pisses', 'pissflaps', 'pissin', 'pissing',
    'pissoff', 'poop', 'poo', 'porn', 'porno', 'pornography', 'pornos', 'prick', 'pricks', 'pron', 'pube', 'pusse',
    'pussi', 'pussies', 'pussy', 'pussys', 'rectum', 'retard', 'rimjaw', 'rimming', 's hit', 's.o.b.', 'sadist',
    'schlong', 'screwing', 'scroat', 'scrote', 'scrotum', 'semen', 'sex', 'sh!+', 'sh!t', 'sh1t', 'shag', 'shagger',
    'shaggin', 'shagging', 'shemale', 'shi+', 'shit', 'shitdick', 'shite', 'shited', 'shitey', 'shitfuck', 'shitfull',
    'shithead', 'shiting', 'shitings', 'shits', 'shitted', 'shitter', 'shitters', 'shitting', 'shittings', 'shitty',
    'skank', 'slut', 'sluts', 'smegma', 'smut', 'snatch', 'son-of-a-bitch', 'spac', 'spunk', 's_h_i_t', 't1tt1e5',
    't1tties', 'teets', 'teez', 'testical', 'testicle', 'tit', 'titfuck', 'tits', 'titt', 'tittie5', 'tittiefucker',
    'titties', 'tittyfuck', 'tittywank', 'titwank', 'tosser', 'turd', 'tw4t', 'twat', 'twathead', 'twatty', 'twunt',
    'twunter', 'v14gra', 'v1gra', 'vagina', 'viagra', 'vulva', 'w00se', 'wang', 'wank', 'wanker', 'wanky', 'whoar',
    'whore', 'willies', 'willy', 'xrated', 'xxx', 'civilservice', 'civilservices'
  ],

  /**
   * Check if Username is acceptable
   * @param name
   * @returns {boolean}
   */
  validUserName: function(name){
    var validPattern = /^[a-zA-Z0-9-_]{3,30}$/;
    if(typeof name === 'string') {
      name = name.toLowerCase().trim();
      return validPattern.test(name) && (this.INVALID_NAMES.indexOf(name) === -1);
    }
  },

  /**
   * Check if Name is acceptable
   * @param name
   * @returns {boolean}
   */
  validName: function(name){
    if(typeof name === 'string') {
      name = name.toLowerCase().trim();
      return (this.INVALID_NAMES.indexOf(name) === -1);
    }
  },

  /**
   * Validate passed in user data and, if valid, create the user. Returns
   * a promise object that should spit out the created user data.
   * @param  {object} data Object of user registration data
   * @return {object} Promise
   */
  register: function(data) {
    var self = this;
    var form = new RegistrationForm();

    return form
      .validate(data)
      .then(function(cleanedData) {
        return self.createUser(cleanedData);
      });
  },

  /**
   * Create a user in the database, encoding
   * @param  {object} data Object of validated and cleaned user data to insert into the database
   * @return {object} Promise object
   */
  createUser: function(data) {

    var self = this;
    var insert = _.clone(data);

    if (insert.inviteCode) {
      var inviteID = parseInt(hashID.decode(insert.inviteCode), 10);

      if( !inviteID){
        return Promise.reject({ inviteCode: ['Invalid Invite Code'] });
      }
    }

    if(self.validUserName(insert.username) === false) {
      return Promise.reject({ username: ['Unacceptable Username'] });
    } else if(self.validName(insert.first_name) === false) {
      return Promise.reject({ first_name: ['Unacceptable First Name'] });
    } else if(self.validName(insert.last_name) === false) {
      return Promise.reject({ last_name: ['Unacceptable Last Name'] });
    }

    // Set Display name to Username if not defined
    if( !insert.profile_name){
      insert.profile_name = insert.username;
    }

    // Store username as lowercase
    insert.username = insert.username.toLowerCase();

    return hasher
      .generate(insert.password)
      .then(function(encodedPassword) {
        insert.activated = false;
        insert.password = encodedPassword;

        if (insert.email) {
          insert.new_email_key = randomString.generate(self.CONFIRMATION_KEY_LENGTH);
        }

        return User
          .create(insert)
          .then(function(created) {

            if (created) {
              email.sendUserConfirmationEmail(created);

              if (typeof created.id !== 'undefined') {
                return UserInvite.create({
                  user_id: inviteID,
                  new_user_id: created.id
                }).then(function(){
                  return Promise.resolve(created);
                });
              }
            }  else {
              return Promise.reject('Unable to Create User');
            }
          });
      });
  },

  /**
   * Activate account matching passed in new_email_key value
   * @param  {string} key Activation key to find a match for
   * @return {object} Returns promise that passes the user if found
   */
  confirmAccount: function(key) {
    if (key && key.length === this.CONFIRMATION_KEY_LENGTH) {
      return User.findOne({
        where: {
          new_email_key: key
        }
      })
      .then(function(user) {
        if (user) {

          var currentTimeMinus24Hours = new Date()-24*60*60*1000;
          var requestedDate = new Date(user.new_email_requested).getTime();

          if(requestedDate > currentTimeMinus24Hours){

            user.set('activated', true);
            user.set('new_email', null);
            user.set('new_email_key', null);
            user.set('new_email_requested', null);
            user.set('new_password_requested', null);

            return user.save();

          } else {

            user.set('activated', false);
            user.set('new_email', null);
            user.set('new_email_key', null);
            user.save();

            return Promise.reject('Activation Key Expired');
          }

        } else {
          return Promise.reject('Activation Key not found');
        }
      });
    } else {
      return Promise.reject('Invalid Key');
    }
  },

  /**
   * Activate account matching passed in new_email_key value
   * @param {string} key Activation key to find a match for
   * @return {object} Returns promise that passes the user if found
   */
  confirmEmail: function(key) {
    if (key && key.length === this.CONFIRMATION_KEY_LENGTH) {
      return User.findOne({
        where: {
          new_email_key: key
        }
      })
      .then(function(user) {
        if (user) {

          var email = user.new_email;
          var currentTimeMinus24Hours = new Date()-24*60*60*1000;
          var requestedDate = new Date(user.new_email_requested).getTime();

          user.set('new_email', null);
          user.set('new_email_key', null);
          user.set('new_email_requested', null);

          if(requestedDate > currentTimeMinus24Hours){

            user.set('email', email);
            return user.save();

          } else {

            user.save();
            return Promise.reject('Email Confirmation Key Expired');
          }

        } else {
          return Promise.reject('Confirmation Key not found');
        }
      });
    } else {
      return Promise.reject('Invalid Key');
    }
  },

  /**
   * Activate account matching passed in new_email_key value
   * @param  {string} key Activation key to find a match for
   * @return {object} Returns promise that passes the user if found
   */
  confirmPassword: function(key) {
    if (key && key.length === this.CONFIRMATION_KEY_LENGTH) {
      return User.findOne({
        where: {
          new_password_key: key
        }
      })
      .then(function(user) {
        if (user) {

          var password = user.new_password;
          var currentTimeMinus24Hours = new Date()-24*60*60*1000;
          var requestedDate = new Date(user.new_password_requested).getTime();

          user.set('new_password', null);
          user.set('new_password_key', null);
          user.set('new_password_requested', null);

          if(requestedDate > currentTimeMinus24Hours){


            user.set('password', password);
            return user.save();

          } else {

            user.save();
            return Promise.reject('Password Confirmation Key Expired');
          }

        } else {
          return Promise.reject('Confirmation Key not found');
          }
        });
    } else {
      return Promise.reject('Invalid Key');
    }
  },

  /**
   * User Password Recover
   * @param {object} data to find a match for and sets `new_password_key` & `new_password_requested`
   * @return {object} Returns promise that passes the user if found
   */
  forgotPassword: function(data) {
    var self = this;
    if (data && data.email) {
      return User
        .findOne({
          where: {
            email: data.email
          }
        })
        .then(function(user) {
          if (user) {
            var generatedKey = randomString.generate(self.CONFIRMATION_KEY_LENGTH);
            user.set('new_password_key', generatedKey);
            user.set('new_password_requested', Date.now());
            return user.save();
          } else {
            return Promise.reject('No Matching Email Found');
          }
        });
    } else {
      return Promise.reject('Forgot Password Request Invalid');
    }
  },

  /**
   * Reset Password if token is valid and not older than 24 hours, and passwords match
   * @param  {object} data to find a match for and sets `token` & `password` & `retype_password`
   * @return {object} Returns promise that passes the user if found
   */
  resetPassword: function(data) {
    var self = this;

    if (data && data.password && data.retype_password && data.token && data.token.length === self.CONFIRMATION_KEY_LENGTH) {

      if(data.password !== data.retype_password){
        return Promise.reject('Passwords do not match');
      }

      var currentTimeMinus24Hours = new Date()-24*60*60*1000;

      return User
        .findOne({
          where: {
            new_password_key: data.token,
            new_password_requested: {
              gt: currentTimeMinus24Hours
            }
          }
        })
        .then(function(user) {
          if (user) {
            return hasher
              .generate(data.password)
              .then(function(encodedPassword) {
                user.set('password', encodedPassword);
                user.set('new_password_key', null);
                user.set('new_password_requested', null);
                return user.save();
              });
          } else {
            return Promise.reject('Request Invalid or Expired');
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  },

  /**
   * Reset Password if token is valid and not older than 24 hours, and passwords match
   * @param  {object} id to find a match for and sets `token` & `password` & `retype_password`
   * @return {object} Returns promise that passes the user if found
   */
  resendConfirmation: function(id) {

    id = parseInt(hashID.decode(id, 10));

    if(id > 0) {

      var self = this;

      return User
        .findOne({
          where: {
            id: id,
            activated: false
          }
        })
        .then(function(user) {
          if (user) {

            user.set('new_password_requested', null);
            user.set('new_email_requested', Date.now());
            user.set('new_email_key', randomString.generate(self.CONFIRMATION_KEY_LENGTH));
            user.save();

            email.sendUserConfirmationEmail(user);

            return Promise.resolve('Confirmation Email Resent');
          } else {
            return Promise.reject('Reset Password Token Invalid of Expired');
          }
        });
    } else {
      return Promise.reject('Invalid Request');
    }
  }
};
