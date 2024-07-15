# Base image
FROM node:20-alpine

RUN apk update

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["./docker-entrypoint.sh"]