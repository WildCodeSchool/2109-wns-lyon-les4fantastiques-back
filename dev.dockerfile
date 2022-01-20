FROM node:lts-alpine

WORKDIR /app
COPY ./package.json ./
RUN npm i

COPY src src
COPY .env .env
COPY tsconfig.json tsconfig.json
COPY ormconfig.json ormconfig.json

CMD npm start