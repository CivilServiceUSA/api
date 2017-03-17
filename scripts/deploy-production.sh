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

echo -e "\n\033[38;5;34m✓ Civil Services › Update Data\033[0m\n"

npm run migrate
npm run seed

echo -e "\n\033[38;5;34m✓ Civil Services › Deployment Complete\033[0m\n"

EOF