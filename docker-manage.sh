#!/bin/bash -x

release() {
  docker-compose run  --entrypoint='/bin/bash -x /opt/efcsydney-roster/release.sh' efc-dev
}

build(){
  local TARGET=$1
  if [ "$TARGET" != "dev" ] && [ "$TARGET" != "prod" ]; then
    echo "Wrong argument: must be 'dev' or 'prod'. "
    exit 1
  fi
  echo "Build Docker Image"
  docker-compose build efc-$TARGET
  docker rmi -f $(docker images | grep "<none>" | awk "{print \$3}")

}

up(){
  #docker rm -f $(docker ps -a | grep "Exited" | awk "{print \$1}")
  local TARGET=$1
  if [ "$TARGET" != "dev" ] && [ "$TARGET" != "prod" ]; then
    echo "Wrong argument: must be 'dev' or 'prod'. "
    exit 1
  fi
  docker-compose rm -f efc-$TARGET
  docker-compose up db efc-$TARGET
}

push() {
  read -p "Version: " version
  version=${version:-latest}

  docker tag efc-roster:latest 149778305054.dkr.ecr.ap-southeast-2.amazonaws.com/efc-roster:$version
  docker push 149778305054.dkr.ecr.ap-southeast-2.amazonaws.com/efc-roster:$version
}

$1 ${2:-dev}
