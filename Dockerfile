FROM node:21
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY server.js server.js
EXPOSE 3000
CMD ["node", "server.js"]