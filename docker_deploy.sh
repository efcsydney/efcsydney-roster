#!/bin/sh
# create parameter
if [ $1 = "qa" ]; then
    env='QA'
    NodeEnv='qa'
    bucket='efc-sydney-dev-2019-may'
    dockerBuildTarget='efc-qa'
    stack='EFC-Dev-ECS-Service'
    dockerBuildTarget='efc-qa'
else
    env='Production'
    NodeEnv='production'
    bucket='efc-sydney-production-2019'
    stack='EFCSydney-ECS-Service'
    dockerBuildTarget='efc-prod'
fi

docker-compose -f docker/docker-compose.yml build $dockerBuildTarget
docker push kleinchang/efcsydney-roster:${BUILD_TAG:-latest}
dockerImg="docker.io/kleinchang/efcsydney-roster:${BUILD_TAG:-latest}"
file='aws/ecs_service.json'

aws --region ap-southeast-2 cloudformation deploy \
    --capabilities CAPABILITY_IAM \
    --template-file $file \
    --stack-name $stack \
    --parameter-overrides \
        Environment=$env \
        DockerImgSrc=$dockerImg \
        NodeEnv=$NodeEnv \
        S3ConfBucketName=$bucket
