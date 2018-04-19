FROM amazonlinux

RUN yum update && yum install -y python36 python36-pip jq

# install node
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
RUN yum install -y nodejs gcc-c++ make
RUN node -v ; npm -v

# install yarn
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN yum install -y yarn
RUN yarn --version

# install dependency packages
ADD ./efcsydney-roster.tar.gz /opt/
WORKDIR /opt/efcsydney-roster/
RUN ls
RUN yarn

WORKDIR /opt/efcsydney-roster/client/
RUN ls
RUN yarn

# install as-cli
WORKDIR /opt/efcsydney-roster/

RUN pip-3.6 install awscli --upgrade --user && \
    echo "export PATH=$PATH:~/.local/bin/" >> ~/.bashrc


ADD Entrypoint.sh /opt/
EXPOSE 3000
ENTRYPOINT ["/bin/bash", "-ex", "/opt/Entrypoint.sh"]
