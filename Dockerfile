FROM node:lts-alpine

RUN apk add automake autoconf libtool build-base pkgconfig nasm

# Set our node environment, either `development` or `production`
# defaults to `production`, compose overrides this to `development` on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Default to port 3000 for node, and 9229 and 9230 (tests) for debug
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT 9229 9230

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0

# Install dependencies first
RUN mkdir /srv/app && chown node:node /srv/app
WORKDIR /srv/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
ENV NODE_PATH=/srv/app/node_modules

WORKDIR /srv/app/src

# the official node image provides an unprivileged user as a security best practice
# but we have to manually enable it. We put it here so npm installs dependencies as the same
# user who runs the app.
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
COPY . .
USER node

CMD ["node", "../node_modules/.bin/nuxt"]
