#!/bin/bash -ex

BASE_DIR=$(dirname "$0")
cd $BASE_DIR

build(){
  local TARGET=$1
  if [ "$TARGET" !== 'qa' ] && [ "$TARGET" != "dev" ] && [ "$TARGET" != "prod" ]; then
    echo "Wrong argument: must be 'qa', 'dev' or 'prod'. "
    exit 1
  fi
  echo "Build Docker Image"

  docker-compose build efc-$TARGET
}

up(){
  local TARGET=$1
  if [ "$TARGET" !== 'qa' ] && [ "$TARGET" != "dev" ] && [ "$TARGET" != "prod" ]; then
    echo "Wrong argument: must be 'qa', 'dev' or 'prod'. "
    exit 1
  fi

  docker-compose up -d db efc-$TARGET
  docker-compose logs -f
}

stop(){
  local TARGET=$1
  if [ "$TARGET" !== 'qa' ] && [ "$TARGET" != "dev" ] && [ "$TARGET" != "prod" ]; then
    echo "Wrong argument: must be 'qa', 'dev' or 'prod'. "
    exit 1
  fi
  docker-compose stop db efc-$TARGET
  docker-compose rm -f efc-$TARGET
}

push() {
  local TARGET=$1
  if [ "$TARGET" !== 'qa' ] && [ "$TARGET" != "dev" ] && [ "$TARGET" != "prod" ]; then
    echo "Wrong argument: must be 'qa', 'dev' or 'prod'. "
    exit 1
  fi

  docker tag efcsydney/roster:latest efcsydney/roster:$TARGET
  docker push efcsydney/roster:$TARGET
}

$1 ${2:-dev}
