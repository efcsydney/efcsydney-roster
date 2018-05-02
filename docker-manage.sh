#!/bin/bash -x

build(){
  echo "Clean up"
  rm -rf efcsydney-roster.tar.gz
  rm -rf client/node_modules
  find log/* ! -name '.gitignore' -exec rm -rf {} +

  echo "Tar"
  pushd ../
  tar -czf efcsydney-roster.tar.gz efcsydney-roster
  mv efcsydney-roster.tar.gz efcsydney-roster/
  popd

  echo "Build Docker Image"
  docker-compose build
  docker rmi -f $(docker images | grep "<none>" | awk "{print \$3}")

}

up(){
  docker rm -f $(docker ps -a | grep "Exited" | awk "{print \$1}")
  docker-compose up
}

push() {

  read -p "Version: " version
  version=${version:-latest}

  docker tag efc-roster:latest 149778305054.dkr.ecr.ap-southeast-2.amazonaws.com/efc-roster:$version
  docker push 149778305054.dkr.ecr.ap-southeast-2.amazonaws.com/efc-roster:$version
}

$1
