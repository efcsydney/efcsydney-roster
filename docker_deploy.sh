#!/bin/sh
# create parameter
if [ $1 = "qa" ]; then
    env='QA'
    NodeEnv='qa'
    bucket='efc-sydney-qa'
    stack='ecs-service'
else
    env='Production'
    NodeEnv='production'
    bucket='efc-sydney-production'
    stack='EFCSydney-ECS-Service'
fi

docker-compose -f docker/docker-compose.yml build efc-prod
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
