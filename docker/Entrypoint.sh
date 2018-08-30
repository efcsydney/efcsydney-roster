#!/bin/bash -ex

EFC_FOLDER="/opt/efcsydney-roster"
cd $EFC_FOLDER

prod() {
  export PATH=$PATH:~/.local/bin/
  aws ssm get-parameters --region ap-southeast-2 \
    --names username password database host dialect \
    --with-decryption \
    --query 'Parameters[*].{key:Name,value:Value}' \
    | jq from_entries \
    > parameter.json

  jq '{ "'$NODE_ENV'" : .}' parameter.json > ./config/database.json

  user=$(jq -r .username parameter.json)
  password=$(jq -r .password parameter.json)

  cat > ~/.my.cnf <<EOF
[mysqldump]
user=$user
password=$password
EOF

  yarn db-migrate

  aws s3 cp s3://$S3_BUCKET/local.yaml $EFC_FOLDER/config/local.yaml
  aws s3 cp s3://$S3_BUCKET/email-list.csv $EFC_FOLDER/db/data/email-list.csv
  aws s3 cp s3://$S3_BUCKET/email-list-example.csv $EFC_FOLDER/db/data/email-list-example.csv

  pm2-runtime server.js
}

dev(){
  yarn

  pushd $EFC_FOLDER/client/
  yarn
  popd

  bash -x $EFC_FOLDER/docker/wait-for-it.sh db:3306
  yarn db-migrate
  yarn db-update-events

  pm2-runtime npm -- start --watch
}

$1