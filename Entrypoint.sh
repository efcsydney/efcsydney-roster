#!/bin/bash -ex

EFC_FOLDER="/opt/efcsydney-roster"
echo "$node_env"

if [ "$node_env" -ne "development" ]; then
  export PATH=$PATH:~/.local/bin/
  aws ssm get-parameters --region ap-southeast-2 --names username password database host dialect --with-decryption --query 'Parameters[*].{key:Name,value:Value}' | jq from_entries | jq '{ $node_env : .}' > ./config/database.json
else
  cd $EFC_FOLDER
  yarn

  pushd $EFC_FOLDER/client/
  yarn
  popd
fi

yarn db-migrate
yarn db-update-events
#yarn start
pm2 start npm -- start --watch
tail -f /dev/null

