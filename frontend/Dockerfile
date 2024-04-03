## Node Runtime version
FROM node:18.17.0

##Set the working directory to /app
WORKDIR /app

##COPY 
COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]