![Civil Services Logo](https://cdn.civil.services/common/github-logo.png "Civil Services Logo")

**[↤ Developer Overview](../README.md)**

Maintaining API
===

This project uses `npm shrinkwrap` to lock down dependencies so we're better guarded against breaking changes to public packages. If you need to add or update a dependency, in addition updating `package.json` you'll also need to run the following:

```bash
npm prune             # Remove locally installed pacakges not in packages.json
npm dedupe            # Deduplicate child dependencies to minimize copies
npm shrinkwrap --dev  # Update our npm-shrinkwrap.json
```

Verify that the updated shrinkwrap file doesn't incorporate unexpected changes, primarily watching out for changes to versions in child packages. Changes can result in some unfortunately large diffs, so generally your best bet is to only add/update a single dependency at a time and ensure it gets its own commit so tools like `git bisect` can work their magic to surface bugs and regressions.

**NOTE: When using a dependency installed directly off GitHub, shrinkwrap requires a SHA:**

```bash
npm install --save git://github.com/mysqljs/mysql.git#a0f2cec26ee86536dbc1c2837b92b191ca9618f1
```