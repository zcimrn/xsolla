FROM node:alpine
WORKDIR app
COPY . .
RUN npm ci
CMD node main.js
EXPOSE 3000