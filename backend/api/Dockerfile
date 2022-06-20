FROM node:16-alpine

WORKDIR /usr/src/app/

RUN npm install --location=global npm@8.12.2

COPY    package*.json ./

RUN npm install

COPY . .

RUN npm run build
