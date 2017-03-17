#!/bin/bash

ssh -v civilservices@67.205.176.176 << EOF
export API_NODE_ENV=production

echo '1. Updating sources'

cd /civilservices/www/api.civil.services/html/
git checkout --force master
git pull

echo "2. Update NPM Package"
npm update

echo "3. Update Data"
npm run migrate
npm run seed

echo 'Update Complete'

EOF