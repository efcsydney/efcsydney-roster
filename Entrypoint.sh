#!/bin/bash -ex

EFC_FOLDER="/opt/efcsydney-roster"
echo "$node_env"
cd $EFC_FOLDER

if [ "$node_env" == "qa" ] || [ "$node_env" == "production" ]; then
  export PATH=$PATH:~/.local/bin/
  aws ssm get-parameters --region ap-southeast-2 --names username password database host dialect --with-decryption --query 'Parameters[*].{key:Name,value:Value}' | jq from_entries | jq '{ $node_env : .}' > ./config/database.json
elif [ "$node_env" == "development" ]; then
  yarn

  pushd $EFC_FOLDER/client/
  yarn
  popd
fi

yarn db-migrate
yarn db-update-events
#yarn start
pm2-runtime npm -- start --watch

