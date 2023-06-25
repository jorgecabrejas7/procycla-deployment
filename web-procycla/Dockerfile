FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .


RUN npm install

COPY  . .
ENV BACK_API_AUTH_URL="enviroment.com"
RUN npm run build
CMD npm start
