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

echo "Clean up"
rm -rf client/node_modules
rm -rf log

echo "Tar"
cd ../
tar -czf efcsydney-roster.tar.gz efcsydney-roster

echo "Upload"
scp -i ~/.ssh/key/efcsydney.pem ./efcsydney-roster.tar.gz ec2-user@${ip}:/opt/

echo "Replace"
ssh -i ~/.ssh/key/efcsydney.pem ec2-user@${ip} 'export NODE_ENV=${node_env}; cd /opt; rm -rf pre-efcsydney-roster; mv efcsydney-roster pre-efcsydney-roster; tar -xf efcsydney-roster.tar.gz'

echo "After deploy"
ssh -i ~/.ssh/key/efcsydney.pem ec2-user@${ip} 'export NODE_ENV=${node_env}; cd /opt/efcsydney-roster; . ~/.bash_profile; nvm use 8; yarn; yarn db-migrate'

echo "Do links"
ssh -i ~/.ssh/key/efcsydney.pem ec2-user@${ip} 'export NODE_ENV=${node_env}; cd /opt/efcsydney-roster; ln -s /opt/config/email-list.csv ./db/data/email-list.csv'
ssh -i ~/.ssh/key/efcsydney.pem ec2-user@${ip} 'export NODE_ENV=${node_env}; cd /opt/efcsydney-roster; ln -s /opt/config/local.yaml ./config/local.yaml'
ssh -i ~/.ssh/key/efcsydney.pem ec2-user@${ip} 'export NODE_ENV=${node_env}; cd /opt/efcsydney-roster; ln -s /opt/config/log/ ./log'

echo "Restart Node Process Using Monit, Config in the /etc/monit.d/roster"
ssh -i ~/.ssh/key/efcsydney.pem ec2-user@${ip} 'sudo monit restart all'
