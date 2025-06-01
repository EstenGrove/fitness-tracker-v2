# Use Node 23.6.0 for building the React app
FROM node:23.6.0-alpine AS build

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
