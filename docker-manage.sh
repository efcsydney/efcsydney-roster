#!/bin/bash -ex

build(){
  docker build -t efc-roster .
  docker rmi -f $(docker images | grep "<none>" | awk "{print \$3}")
}

run(){
  docker rm -f $(docker ps -a | grep "Exited" | awk "{print \$1}")
  docker run -p 3000:3000 -it efc-roster:latest
}

push() {
  docker tag efc-roster:latest 149778305054.dkr.ecr.ap-southeast-2.amazonaws.com/efc-roster:latest
  docker push 149778305054.dkr.ecr.ap-southeast-2.amazonaws.com/efc-roster:latest
}

$1
