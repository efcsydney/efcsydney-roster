
file="./ecs_alb.json"
stack=ecs-alb
#file="./ecs_service.json"
#stack=ecs-service
aws --profile efc-qa cloudformation deploy --template-file $file --stack-name $stack
