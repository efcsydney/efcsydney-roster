#!/bin/bash -ex

export PATH=$PATH:~/.local/bin/
export NODE_ENV="test";

cd /opt/efcsydney-roster/

aws ssm get-parameters --region ap-southeast-2 --names username password database host dialect --with-decryption --query 'Parameters[*].{key:Name,value:Value}' | jq from_entries | jq '{ "test" : .}' > ./config/database.json
yarn db-migrate
yarn db-update-events
yarn start
