![Civil Services Logo](https://cdn.civil.services/common/github-logo.png "Civil Services Logo")

**[↤ Developer Overview](../README.md)**

Server Configuration
===

This API requires a configuration file in the `./app/config/` folder based on the environment you are in.

You will need to set the API Environment via:

```bash
set API_NODE_ENV=local
```

__The supported environments are:__ ( FYI, you can download config file samples for local, staging & production below )

* [local](https://gist.github.com/manifestinteractive/7f43bd37a477ca115cb0057896304bbb)
* [staging](https://gist.github.com/manifestinteractive/78b30cec648748708a7f7d24c84607c1)
* [production](https://gist.github.com/manifestinteractive/2b4a061bcc2a68c349b0d50b579b8a50)

You can also use Environmental Variables rather than a config file, if that is easier by editing the `~/.bash_profile` file ( or whatever profile file you have ).

```bash
nano ~/.bash_profile
```

#### API Environmental Variables

```bash
export API_DEV_FLAG_BUGSNAG=true;
export API_DEV_FLAG_ANALYTICS=true;
export API_API_DATABASE='CHANGE_ME';
export API_API_HOST='locahost';
export API_API_PASSWORD='CHANGE_ME';
export API_API_USERNAME='CHANGE_ME';
export API_API_VERSION='v1'
export API_APP_SECRET='CHANGE_ME';
export API_BUGSNAG='CHANGE_ME';
export API_DEBUG=true;
export API_DEBUG_KEY='CHANGE_ME';
export API_ELASTIC_SEARCH='http://localhost:9200';
export API_HASH_ID_ALPHABET='BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz';
export API_HASH_ID_LENGTH=6;
export API_HASH_ID_SECRET='CHANGE_ME';
export API_INVITE_CAP=15;
export API_INVITE_ONLY=true;
export API_LOGZIO_DEBUG=true;
export API_LOGZIO_TOKEN='CHANGE_ME';
export API_LOGZIO_TYPE='CivilServiceAPI';
export API_MANDRILL_API_KEY='CHANGE_ME';
export API_NODE_ENV='local';
export API_OPENSTATES_API_KEY='CHANGE_ME';
export API_PORT=5000;
export API_REDIS_HOST='127.0.0.1';
export API_REDIS_PORT=6379;
export API_REDIS_PASSWORD='CHANGE_ME';
export API_SESSION_KEY='CHANGE_ME';
```

You can use [https://guid.it](https://guid.it) to create random strings for stuff like Session Key's and App Secret's.

You will now need to apply these new Environmental Variables

```bash
source ~/.bash_profile
```

Now you can verify that your settings are applied correctly:

```bash
echo $API_NODE_ENV
```