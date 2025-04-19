FROM node:23-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3002
CMD ["node", "dist/index.js"]
