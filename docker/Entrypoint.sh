#!/bin/bash -ex

EFC_FOLDER="/opt/efcsydney-roster"
cd $EFC_FOLDER

prod() {
  # Copy database config from external mount point
  if [ -f /opt/efcsydney-config/database.json ]; then
    cp /opt/efcsydney-config/database.json ./config/database.json
    echo "Database config loaded from /opt/efcsydney-config/database.json"
  else
    echo "ERROR: Database config not found at /opt/efcsydney-config/database.json"
    exit 1
  fi

  # Extract credentials for mysqldump
  user=$(jq -r '.production.username // .qa.username // empty' ./config/database.json)
  password=$(jq -r '.production.password // .qa.password // empty' ./config/database.json)

  if [ -n "$user" ] && [ -n "$password" ]; then
    cat > ~/.my.cnf <<EOF
[mysqldump]
user=$user
password=$password
EOF
  fi

  # Copy additional config files if they exist
  if [ -f /opt/efcsydney-config/local.yaml ]; then
    cp /opt/efcsydney-config/local.yaml ./config/production.yaml
    echo "Local config loaded from /opt/efcsydney-config/production.yaml"
  fi

  if [ -f /opt/efcsydney-config/email-list.csv ]; then
    cp /opt/efcsydney-config/email-list.csv ./db/data/email-list.csv
    echo "Email list loaded from /opt/efcsydney-config/email-list.csv"
  fi

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