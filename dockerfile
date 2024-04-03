FROM node:slim

ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000
CMD [ "npm", "run", "start" ]