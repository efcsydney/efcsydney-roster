#!/bin/bash -ex

export PATH=$PATH:~/.local/bin/

cd /opt/efcsydney-roster/
echo "$node_env"

if [ $node_env -ne 'local' ]; then
  aws ssm get-parameters --region ap-southeast-2 --names username password database host dialect --with-decryption --query 'Parameters[*].{key:Name,value:Value}' | jq from_entries | jq '{ $node_env : .}' > ./config/database.json
fi

yarn db-migrate
yarn db-update-events
yarn start
