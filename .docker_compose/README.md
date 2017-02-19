![Civil Services Logo](https://raw.githubusercontent.com/CivilServiceUSA/api/master/docs/img/logo.png "Civil Services Logo")

Docker Composer for API
===

Use Docker Composer to setup a consistent Development Environment for Civil Services API.


Docker Containers
---

* ElasticSearch
* MySQL
* Node
* Redis


Requirements
---

- [X] [Docker](https://www.docker.com/)
- [X] [Docker Compose](https://docs.docker.com/compose/install/)


Installation
---

Clone this repository on your project root directory.

```bash
git submodule add git@github.com:CivilServiceUSA/docker-api.git
git submodule update --init --recursive
```

Run your `docker-compose` command inside the project root directory.

```bash
cd docker-api
docker-compose up
```

At any point, you can update the `git submodule` via:

```bash
git submodule update --recursive --remote
```