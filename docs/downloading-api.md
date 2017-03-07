![Civil Services Logo](https://cdn.civil.services/common/github-logo.png "Civil Services Logo")

**[↤ Developer Overview](../README.md)**

Downloading API
===

You can download this API using the code below ( this assumes you have [SSH integrated with Github](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/) ):

```bash
cd /path/to/api
git clone git@github.com:civilserviceusa/api.git .
npm install
```

Create API Key(s)
---

In order to prevent shipping this API with API Keys in the source code, we opted for another solution. A seeder file that is 
ignored by the source code that you can leave on your installation to store custom API keys for whomever you wish.

This solution is handy as you can add as many API keys as you like, and they will never be distributed with the source code :)

### Make Seeder File

Create a file located at `./app/seeders/00000000000000-api-authentication-seeder.js` and paste in the following contents:

```js
/**
 * @TODO: Change `api_key` & `api_secret` using {@link: https://guid.it GUID}
 */
module.exports = {
  up: function (queryInterface) {
    return queryInterface.bulkInsert('api_authentication', [
      {
        approved_whitelist: '*',
        api_key: 'CHANGE_ME',
        api_secret: 'CHANGE_ME',
        allow_api_get: 1,
        allow_api_post: 1,
        allow_api_put: 1,
        allow_api_delete: 1,
        allow_content_management: 1,
        allow_user_registration: 1,
        app_name: 'Local Developer',
        app_type: 'developer',
        app_purpose: 'Local Development',
        app_description: 'Local Development',
        status: 'approved',
        daily_limit: 0,
        created_date: new Date(),
        modified_date: new Date()
      }
    ], {
      updateOnDuplicate: ['user_id', 'approved_whitelist', 'api_key', 'api_secret', 'allow_api_get', 'allow_api_post', 'allow_api_put', 'allow_api_delete', 'allow_content_management', 'allow_user_registration', 'app_name', 'app_type', 'app_purpose', 'app_description', 'status', 'daily_limit', 'modified_date']
    }).catch(function (err) {
      if (err && err.errors) {
        for (var i = 0; i < err.errors.length; i++) {
          console.error('× SEED ERROR', err.errors[i].type, err.errors[i].message, err.errors[i].path, err.errors[i].value);
        }
      } else if (err && err.message) {
        console.error('× SEED ERROR', err.message);
      }
    });
  },
  down: function (queryInterface) {
    return queryInterface.bulkDelete('api_authentication', null, {});
  }
};
```