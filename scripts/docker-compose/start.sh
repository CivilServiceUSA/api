#!/usr/bin/env bash
echo "PID of start.sh: $$"

npm run start && npm run seed && npm run elasticsearch:create && npm run elasticsearch:update