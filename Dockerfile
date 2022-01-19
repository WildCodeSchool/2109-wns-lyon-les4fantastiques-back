FROM node:lts-alpine

RUN mkdir /app
WORKDIR /app
COPY ./package.json ./
RUN npm i

COPY src src
COPY .env .env
COPY tsconfig.json tsconfig.json
COPY database.sqlite database.sqlite
COPY ormconfig.json ormconfig.json

CMD npm start