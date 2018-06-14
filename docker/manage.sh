#!/bin/bash -ex

BASE_DIR=$(dirname "$0")
cd $BASE_DIR

build(){
  local TARGET=$1
  if [ "$TARGET" != "dev" ] && [ "$TARGET" != "prod" ]; then
    echo "Wrong argument: must be 'dev' or 'prod'. "
    exit 1
  fi
  echo "Build Docker Image"

  docker-compose build efc-$TARGET

}

up(){
  local TARGET=$1
  if [ "$TARGET" != "dev" ] && [ "$TARGET" != "prod" ]; then
    echo "Wrong argument: must be 'dev' or 'prod'. "
    exit 1
  fi

  docker-compose up -d db efc-$TARGET
  docker-compose logs -f
}

stop(){
  local TARGET=$1
  if [ "$TARGET" != "dev" ] && [ "$TARGET" != "prod" ]; then
    echo "Wrong argument: must be 'dev' or 'prod'. "
    exit 1
  fi
  docker-compose stop db efc-$TARGET
  docker-compose rm -f efc-$TARGET
}

push() {
  read -p "Version: " version
  version=${version:-latest}

  docker tag efc-roster:latest 651220962436.dkr.ecr.ap-southeast-2.amazonaws.com/efc-roster:$version
  docker push 651220962436.dkr.ecr.ap-southeast-2.amazonaws.com/efc-roster:$version
}

$1 ${2:-dev}
