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
  # echo $PWD
  # find ../log/* ! -name '.gitignore' -exec rm -rf {} + || true

  docker-compose build efc-$TARGET
  UNUSED_IMG=$(docker images | grep "<none>" | awk "{print \$3}")
  if [ ! -z "$UNUSED_IMG" ]; then
    docker rmi -f $UNUSED_IMG
  fi
}

up(){
  local TARGET=$1
  if [ "$TARGET" != "dev" ] && [ "$TARGET" != "prod" ]; then
    echo "Wrong argument: must be 'dev' or 'prod'. "
    exit 1
  fi

  #docker-compose rm -f efc-$TARGET
  UNUSED_CONTAINER=$(docker ps -a | grep "Exited" | awk "{print \$1}")
  if [ ! -z "$UNUSED_CONTAINER" ]; then
    docker rm -f $(docker ps -a | grep "Exited" | awk "{print \$1}")
  fi
  docker-compose up db efc-$TARGET
}

stop(){
  #docker rm -f $(docker ps -a | grep "Exited" | awk "{print \$1}")
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

  docker tag efc-roster:latest 149778305054.dkr.ecr.ap-southeast-2.amazonaws.com/efc-roster:$version
  docker push 149778305054.dkr.ecr.ap-southeast-2.amazonaws.com/efc-roster:$version
}

$1 ${2:-dev}
