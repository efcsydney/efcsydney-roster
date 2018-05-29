#!/bin/bash -ex

EFC_FOLDER="/opt/efcsydney-roster"
cd $EFC_FOLDER

prod() {
  export PATH=$PATH:~/.local/bin/
  aws ssm get-parameters --region ap-southeast-2 --names username password database host dialect --with-decryption --query 'Parameters[*].{key:Name,value:Value}' | jq from_entries | jq '{ $node_env : .}' > ./config/database.json
  yarn db-migrate

  aws s3 cp s3://efc-roster/email-list.csv $EFC_FOLDER/db/data/email-list.csv
  pm2-runtime server.js
}

prod-local() {
  bash -x $EFC_FOLDER/docker/wait-for-it.sh db:3306
  sed -i -e "s/docker/$NODE_ENV/g" ./config/database.json
  yarn db-migrate
  yarn db-update-events
  cp db/data/email-list-example.csv db/data/email-list.csv
  pm2-runtime server.js
}

dev(){
  yarn

  pushd $EFC_FOLDER/client/
  yarn
  popd

  yarn db-migrate
  yarn db-update-events

  pm2-runtime npm -- start --watch
}

$1