FROM mhart/alpine-node:8.10.0
ARG target="dev"

RUN echo "$target"
RUN apk update && apk add --no-cache bash
RUN npm install -g pm2@latest



ADD ./efcsydney-roster.tar.gz /opt/
WORKDIR /opt/efcsydney-roster

#RUN pip install awscli --upgrade --user && \
#    echo "export PATH=$PATH:~/.local/bin/" >> ~/.bashrc
RUN if [ "$target" = "prod" ] ; then pip install awscli --upgrade --user && echo "export PATH=$PATH:~/.local/bin/" >> ~/.bashrc ; fi

ADD Entrypoint.sh /opt/
EXPOSE 3000 3001 3002
ENTRYPOINT ["/bin/bash", "-ex", "/opt/Entrypoint.sh"]
