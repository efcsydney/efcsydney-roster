FROM node:8.10.0

RUN apt-get update && apt-get install -y apt-transport-https curl
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn mysql-client

ADD ./efcsydney-roster.tar.gz /opt/
WORKDIR /opt/efcsydney-roster/
RUN ls
RUN yarn

WORKDIR /opt/efcsydney-roster/client/
RUN ls
RUN yarn

WORKDIR /opt/efcsydney-roster/

CMD sleep 5 ; yarn db-migrate; yarn db-update-events; yarn start
