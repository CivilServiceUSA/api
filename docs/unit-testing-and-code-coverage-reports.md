![Civil Services Logo](https://cdn.civil.services/common/github-logo.png "Civil Services Logo")

**[↤ Developer Overview](../README.md)**

Unit Testing and Code Coverage Reports
===

#### Unit Tests

Testing is run with [MochaJS](https://mochajs.org/) and uses [ChaiJS](http://chaijs.com/) [assert](http://chaijs.com/api/assert/). All unit tests should go under the `test/` directory and should be named to match up with files in `app/`.

To run unit tests, run:

```bash
npm test
```

#### Code Coverage

This will also generate code coverage reports in `./coverage/`.  Unit Tests will automatically fail if Code Coverage reports fall below the following thresholds:

* Statements: 70%
* Branches: 70%
* Functions: 70%
* Lines: 70%

#### JSDoc Documentation

Documentation is automatically generates everytime you run `npm start` and can be accessed via http://127.0.0.1:5000/docs/.
