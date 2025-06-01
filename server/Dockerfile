# server/Dockerfile
FROM node:23.6.0-alpine

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 3004

CMD ["node", "dist/index.js"]
