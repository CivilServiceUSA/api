FROM node:6.9.4

LABEL maintainer "Peter Schmalfeldt hello@civil.services"
LABEL version="1.0"
LABEL description="Local Development of Civil Service API"
LABEL vendor="Civil Service USA Corp."

# Create non-root user to run app with

RUN useradd --user-group --create-home --shell /bin/bash civilservices

# Set working directory

WORKDIR /home/civilservices/api

COPY package.json ./

RUN chown -R civilservices:civilservices /home/civilservices/api

# Change user so that everything that's npm-installed belongs to it

USER civilservices

# Install dependencies

RUN npm install --no-optional && npm cache clean

# Switch to root and copy over the rest of our code
# This is here, after the npm install, so that code changes don't trigger an un-caching
# of the npm install line

USER root
COPY .jshintrc .jshintignore ./
COPY app ./app
COPY scripts ./scripts

# Copy Docker Config Files
COPY .docker_compose/config.json ./app/config
COPY .docker_compose/local.json ./app/config

# Download Required Libraries
RUN rm -f ./app/flat-db/cities.mmdb
RUN curl -o ./app/flat-db/cities.mmdb.gz http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz
RUN gunzip ./app/flat-db/cities.mmdb.gz

RUN rm -f ./app/flat-db/countries.mmdb
RUN curl -o ./app/flat-db/countries.mmdb.gz http://geolite.maxmind.com/download/geoip/database/GeoLite2-Country.mmdb.gz
RUN gunzip ./app/flat-db/countries.mmdb.gz

RUN chmod 755 ./scripts/docker-compose/*.sh
RUN chown -R civilservices:civilservices /home/civilservices/api
USER civilservices

CMD [ "npm", "start" ]