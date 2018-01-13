#!/bin/sh -x

if [ "$1" = "qa" ]; then
	ip="54.206.106.116"
elif [ "$1" = "prod" ]; then
	ip="13.210.76.160"
else
	ip="54.206.106.116"
fi

echo "Clean up"
rm -rf client/node_modules

echo "Tar"
cd ../
tar -czf efcsydney-roster.tar.gz efcsydney-roster

echo "Upload"
scp -i ~/.ssh/key/efcsydney.pem ./efcsydney-roster.tar.gz ec2-user@${ip}:/opt/

echo "Replace"
ssh -i ~/.ssh/key/efcsydney.pem ec2-user@${ip} "cd /opt; rm -rf pre-efcsydney-roster; mv efcsydney-roster pre-efcsydney-roster; tar -xf efcsydney-roster.tar.gz"

echo "After deploy"
ssh -i ~/.ssh/key/efcsydney.pem ec2-user@${ip} "cd /opt/efcsydney-roster; . ~/.bash_profile; nvm use 8; yarn; yarn db-migrate"
