![Civil Services Logo](https://cdn.civil.services/common/github-logo.png "Civil Services Logo")

**[↤ Developer Overview](../README.md)**

Elasticsearch Configuration
===

#### Start / Stop

You need Elasticsearch running, which you can do if you've Brew-installed it like this:

```bash
brew services start elasticsearch@1.7
brew services stop elasticsearch@1.7
```

On Linux you can run in like this ( assuming you installed the service ):

```bash
sudo service elasticsearch start
sudo service elasticsearch stop
```

#### Manage

There are a number of commands to run to get your local Elasticsearch index set up and maintained.

To create the events index and mappings:

```bash
npm run elasticsearch:create
```

To delete the index:

```bash
npm run elasticsearch:delete
```

To update the index:

```bash
npm run elasticsearch:update
```