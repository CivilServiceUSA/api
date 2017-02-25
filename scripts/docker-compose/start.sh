#!/usr/bin/env bash
echo "PID of start.sh: $$"

export API_NODE_ENV=docker && ./scripts/civil-services-api.sh start debug