FROM node:10-alpine

ARG PORT=8000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy app source
COPY . /usr/src/app

# install npm dependencies and delete cache files
RUN \
  apk --no-cache add --virtual native-deps \
  git openssh-client g++ gcc libgcc libstdc++ linux-headers make python && \
  yarn global add node-gyp && \

  # install dependencies including private dependencies
  yarn --production --silent --no-progress && \

  # bcrypt package needs to be rebuilt on node alpine
  yarn add bcrypt --force --build-from-source && \

  # cleanup install dependencies
  apk del native-deps

RUN yarn 
RUN yarn build

EXPOSE ${PORT}
CMD [ "yarn", "serve" ]
