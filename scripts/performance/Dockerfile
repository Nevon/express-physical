FROM node:9-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache git openssh

RUN mkdir ~/.ssh && touch ~/.ssh/known_hosts && ssh-keyscan github.com >> ~/.ssh/known_hosts

WORKDIR /app

ADD run-benchmark.sh run.sh
ADD benchmarks benchmarks

RUN chmod u+x run.sh

CMD [ "sh", "run.sh" ]