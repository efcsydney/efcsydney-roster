#!/bin/sh -x

echo "Clean up"
rm -rf client/node_modules

echo "Tar"
cd ../
tar -czf efcsydney-roster.tar.gz efcsydney-roster

echo "Upload"
scp -i ~/.ssh/key/efcsydney.pem ./efcsydney-roster.tar.gz ec2-user@54.206.106.116:/opt/

echo "Replace"
ssh -i ~/.ssh/key/efcsydney.pem ec2-user@54.206.106.116 "cd /opt; rm -rf pre-efcsydney-roster; mv efcsydney-roster pre-efcsydney-roster; tar -xf efcsydney-roster.tar.gz"
