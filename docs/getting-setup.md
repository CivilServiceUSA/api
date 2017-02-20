![Civil Services Logo](https://cdn.civil.services/common/github-logo.png "Civil Services Logo")

**[↤ Developer Overview](../README.md)**

Getting Setup
===

Requirements
---

* [NodeJS 6.x](https://nodejs.org/en/)
* [MySQL](http://www.mysql.com/)
* [Elasticsearch 1.7.x](https://www.elastic.co/)
* [Redis](http://redis.io/)
* [Bcrypt](http://bcrypt.sourceforge.net/)


Installing Requirements
---

#### OSX

It's recommended that you install and use [Homebrew](http://brew.sh/) for the system-level requirements for the project. Once you have it installed, you can run the following:

```bash
brew tap homebrew/services
brew install node mysql elasticsearch@1.7 bcrypt redis
```

#### Linux

Please use the requirement links above to review install instructions for each dependency.


#### NPM Packages

```bash
npm install -g mysql
npm install -g forever
npm install -g istanbul
npm install -g sequelize-cli
```