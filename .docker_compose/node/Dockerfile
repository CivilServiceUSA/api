FROM node:6

EXPOSE 5000

WORKDIR /civilservices

ENV NPM_CONFIG_LOGLEVEL error

COPY config.json /civilservices/app/config
COPY local.json /civilservices/app/config

RUN npm install

#ADD . /civilservices

CMD npm install && node index.js