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
http://localhost:5000/v1/geolocation/zipcode/10001?apikey=7E07D864-209A-F9E4-819F-2DD7E76B6F24&pretty
```

The default API Key for Development is `7E07D864-209A-F9E4-819F-2DD7E76B6F24` so you can just append `?apikey=7E07D864-209A-F9E4-819F-2DD7E76B6F24` to any API endpoint for authentication.
