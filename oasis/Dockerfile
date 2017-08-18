FROM node:6.9.2-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app
RUN rm -rf node_modules
RUN npm cache clear
RUN npm install
RUN npm run build

EXPOSE 8080

CMD [ "node", "server.js" ]
