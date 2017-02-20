#!/usr/bin/env bash
echo "PID of start.sh: $$"

export API_NODE_ENV=docker

npm run -s migrate
npm run -s seed
npm run -s elasticsearch:create
npm run -s elasticsearch:update
npm run -s cleanup && npm run -s docs

DEBUG=express:* ./node_modules/nodemon/bin/nodemon.js index.js