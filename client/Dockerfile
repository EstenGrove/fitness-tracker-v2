# Stage 1: Build React app
FROM node:23.6.0-alpine AS build

WORKDIR /app

# Copy package files and install dependencies (cache this layer)
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the app (adjust if your build output folder is different)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files to Nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (adjust path if needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
