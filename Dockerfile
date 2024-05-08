FROM node:21-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src/ src/
EXPOSE 3000
CMD ["node", "src/index.js"]