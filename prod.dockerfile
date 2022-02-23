FROM node:lts-alpine

WORKDIR /app

COPY ./package.json ./
RUN yarn

COPY src src
COPY .env .env
COPY tsconfig.json tsconfig.json
COPY ormconfig.json ormconfig.json

RUN yarn run build

CMD cd dist && node ./index.js