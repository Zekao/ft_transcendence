FROM        alpine:latest
LABEL		maintainer="robriard"

RUN         apk add bash npm \
            && npm install --global yarn \
            && yarn add @nestjs/cli

COPY ./api/ /home/api/

WORKDIR     /home/api/
EXPOSE      3000


ENTRYPOINT [ "yarn", "start:dev" ]
