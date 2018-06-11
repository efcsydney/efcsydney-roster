# efcsydney-infrastructure
Infrastructure as a code


steps:

## Network

Cloud Formation:
- vpc.yml

## DB (optional)

(1) CLoudFormation:
- eds.json

(2) update password, user, databasem, host, ... in EC2 parameter store

## Load Balancer

(1) import certificate to AWS certification manager

**Note:** get self sign key:

```bash
openssl genrsa 2048 > privatekey.pem
openssl req -new -key privatekey.pem -out csr.pem
openssl x509 -req -days 1095 -in csr.pem -signkey privatekey.pem -out server.crt
```

(2) CloudFormation:
- ecs_elb.json


(3) update the certificate with the correct DNS name of elb
### ECS

CloudFormation:
- ecs_cluster.json
- ecs_task.json
- ecs_service.json