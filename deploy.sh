#!/bin/sh -x

if [ "$1" = "qa" ]; then
	ip="54.206.106.116"
  export node_env=qa
elif [ "$1" = "prod" ]; then
	ip="13.210.76.160"
  export node_env=production
else
	ip="54.206.106.116"
  export node_env=qa
fi

echo "Clean up Useless files"
rm -rf client/node_modules

echo "Compress all the code into tarball"
cd ../
tar -czf efcsydney-roster.tar.gz efcsydney-roster

echo "Upload Tarball files to server under /opt"
scp -i ~/.ssh/key/efcsydney.pem ./efcsydney-roster.tar.gz ec2-user@${ip}:/opt/

echo "Replace existed code to /opt/pre-efcsydney-roster and untar current code into /opt/efcsydney-roster"
ssh -i ~/.ssh/key/efcsydney.pem ec2-user@${ip} 'export NODE_ENV=${node_env}; cd /opt; rm -rf pre-efcsydney-roster; mv efcsydney-roster pre-efcsydney-roster; tar -xf efcsydney-roster.tar.gz'

echo "Run DB migrate"
ssh -i ~/.ssh/key/efcsydney.pem ec2-user@${ip} 'export NODE_ENV=${node_env}; cd /opt/efcsydney-roster; . ~/.bash_profile; nvm use 8; yarn; yarn db-migrate'

echo "Restart Node Process Using Monit, Config in the /etc/monit.d/roster"
ssh -i ~/.ssh/key/efcsydney.pem ec2-user@${ip} 'sudo monit restart all'
