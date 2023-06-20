FROM node:18.16.0-slim

COPY package.json package-lock.json ./

RUN npm install 

COPY . . 

CMD npm start 



