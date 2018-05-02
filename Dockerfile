FROM mhart/alpine-node:8.10.0

RUN apk update && apk add --no-cache python py-pip jq bash

# install node
RUN node -v ; npm -v
RUN yarn --version

# install dependency packages
ADD ./efcsydney-roster.tar.gz /opt/

WORKDIR /opt/efcsydney-roster/
RUN yarn

WORKDIR /opt/efcsydney-roster/client/
RUN yarn

# install as-cli

RUN pip install awscli --upgrade --user && \
    echo "export PATH=$PATH:~/.local/bin/" >> ~/.bashrc


ADD Entrypoint.sh /opt/
EXPOSE 3000
ENTRYPOINT ["/bin/bash", "-ex", "/opt/Entrypoint.sh"]
