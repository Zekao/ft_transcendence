FROM node:16.10-alpine

WORKDIR /usr/src/app/

COPY    package*.json ./

RUN npm install

COPY . .

RUN npm run build
