#!/bin/bash -ex

EFC_FOLDER="/opt/efcsydney-roster"
cd $EFC_FOLDER

prod() {
  cp "/opt/efcsydney-config/database.json" $EFC_FOLDER/config/
  cp "/opt/efcsydney-config/local.yaml" $EFC_FOLDER/config/
  cp "/opt/efcsydney-config/email-list.csv" $EFC_FOLDER/db/data/

  yarn db-migrate

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

  npm start
}

$1