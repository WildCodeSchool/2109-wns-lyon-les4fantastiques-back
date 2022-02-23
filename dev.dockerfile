FROM node:lts-alpine

WORKDIR /app
COPY ./package.json ./
RUN yarn

COPY src src
COPY .env.dev .env
COPY tsconfig.json tsconfig.json
COPY ormconfig.json ormconfig.json

CMD yarn start