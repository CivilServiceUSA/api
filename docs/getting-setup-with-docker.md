![Civil Services Logo](https://cdn.civil.services/common/github-logo.png "Civil Services Logo")

**[↤ Developer Overview](../README.md)**

Getting Setup with Docker ( Recommended )
===

Requirements
---

* [Docker](https://nodejs.org/en/)
* [Docker Compose](http://www.mysql.com/)


Installing
---

Using Docker is Super Easy once it's installed, you just need to run the following commands:

```bash
cd /path/to/api
docker-compose up --build
```

Accessing the API via Browser
---

Once the API is up and running you can access a local URL via:

```text
http://localhost:5000/v1/geolocation/zipcode/10001?apikey=YOUR_API_KEY&pretty
```

`YOUR_API_KEY` is whatever you setup in [Downloading API](../docs/downloading-api.md)