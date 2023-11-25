FROM node:18

ARG HOST
ARG PORT
ARG NODE_ENVIRONMENT

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]