#!/bin/sh

rm -rf client/node_modules
cd ../
tar -czf efcsydney-roster.tar.gz efcsydney-roster

scp -i ~/.ssh/key/efcsydney.pem ./efcsydney-roster.tar.gz ec2-user@54.206.106.116:/opt/

ssh -i ~/.ssh/key/efcsydney.pem ec2-user@54.206.106.116 "cd /opt; mv efcsydney-roster pre-efcsydney-roster; tar -xf efcsydney-roster.tar.gz"