#!/bin/sh
# create parameter
if [ $1 = "qa" ]; then
  dockerBuildTarget='efc-qa'
else
  dockerBuildTarget='efc-prod'
fi

docker-compose -f docker/docker-compose.yml build $dockerBuildTarget
docker push efcsydney/roster:${BUILD_TAG:-latest}
dockerImg="docker.io/efcsydney/roster:${BUILD_TAG:-latest}"

# Not sure how to sync remote - Docker Context?