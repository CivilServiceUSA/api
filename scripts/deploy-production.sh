#!/bin/bash

ssh -i id_6b807e557c63097610e78edbac36506f civilservices@67.205.176.176 << EOF

echo -e "\n\033[38;5;34m✓ Civil Services › Automated Deployment\033[0m\n"

export API_NODE_ENV=production

echo -e "\n\033[38;5;34m✓ Civil Services › Updating Repository\033[0m\n"

cd /civilservices/www/api.civil.services/html/
git checkout --force master
git pull

echo -e "\n\033[38;5;34m✓ Civil Services › Update NPM Package\033[0m\n"

npm install --no-optional

echo -e "\n\033[38;5;34m✓ Civil Services › Migrate Database\033[0m\n"

npm run migrate

echo -e "\n\033[38;5;34m✓ Civil Services › Seed Database\033[0m\n"

npm run seed

echo -e "\n\033[38;5;34m✓ Civil Services › Update Elasticsearch\033[0m\n"

npm run elasticsearch:delete
npm run elasticsearch:create
npm run elasticsearch:update

echo -e "\n\033[38;5;34m✓ Civil Services › Generate Documentation\033[0m\n"

npm run docs:clean
npm run docs

echo -e "\n\033[38;5;34m✓ Civil Services › Deployment Complete\033[0m\n"

EOF