var assert = require('chai').assert;
var config = require('../../../app/config');

describe('Config', function() {
  it('should be defined', function() {
    assert.isDefined(config);
  });

  describe('config options exist', function() {
    it('should be defined', function() {
      assert.isDefined(config.get('debug'));
      assert.isDefined(config.get('debugKey'));
      assert.isDefined(config.get('env'));
      assert.isDefined(config.get('port'));
      assert.isDefined(config.get('version'));
      assert.isDefined(config.get('sessionKey'));
      assert.isDefined(config.get('inviteOnly'));
      assert.isDefined(config.get('inviteCap'));
      assert.isDefined(config.get('bugsnag'));
      assert.isDefined(config.get('hashID.secret'));
      assert.isDefined(config.get('hashID.length'));
      assert.isDefined(config.get('hashID.alphabet'));
      assert.isDefined(config.get('database.api.host'));
      assert.isDefined(config.get('database.api.database'));
      assert.isDefined(config.get('database.api.username'));
      assert.isDefined(config.get('database.api.password'));
      assert.isDefined(config.get('secret'));
      assert.isDefined(config.get('router.caseSensitive'));
      assert.isDefined(config.get('router.mergeParams'));
      assert.isDefined(config.get('elasticsearch.host'));
      assert.isDefined(config.get('elasticsearch.indexName'));
      assert.isDefined(config.get('elasticsearch.apiVersion'));
      assert.isDefined(config.get('elasticsearch.requestTimeout'));
      assert.isDefined(config.get('elasticsearch.log'));
      assert.isDefined(config.get('mandrill.key'));
      assert.isDefined(config.get('openStates.key'));
      assert.isDefined(config.get('logzio.token'));
      assert.isDefined(config.get('logzio.type'));
      assert.isDefined(config.get('logzio.debug'));
    });
  });
});
