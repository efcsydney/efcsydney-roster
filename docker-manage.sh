#!/bin/bash -x

release() {
  ENV=development docker-compose exec efc /bin/bash -x ./release.sh
}

build(){
  echo "Build Docker Image"
  ENV=development docker-compose build
  docker rmi -f $(docker images | grep "<none>" | awk "{print \$3}")
}

up(){
  #docker rm -f $(docker ps -a | grep "Exited" | awk "{print \$1}")
  docker-compose rm -f efc
  ENV=development docker-compose up -d
}

push() {
  read -p "Version: " version
  version=${version:-latest}

  docker tag efc-roster:latest 149778305054.dkr.ecr.ap-southeast-2.amazonaws.com/efc-roster:$version
  docker push 149778305054.dkr.ecr.ap-southeast-2.amazonaws.com/efc-roster:$version
}

$1
