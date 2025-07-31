FROM node:22-alpine

RUN mkdir -p -m 0777 /vuetorrent

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src/ src/

EXPOSE 3000

CMD ["node", "src/index.js"]
