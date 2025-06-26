# server/Dockerfile
FROM node:23.6.0-alpine

WORKDIR /app

# Copy package files and install dependencies first
COPY package*.json ./
RUN npm install

# Copy the rest of your app (including .env)
COPY . .

RUN npm run build

EXPOSE 3004

CMD ["node", "dist/index.js"]