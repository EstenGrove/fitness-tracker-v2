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

# Remove default nginx website and configs
RUN rm -rf /usr/share/nginx/html/* && \
    find /etc/nginx/conf.d -name "*.conf" -type f -delete || true

# Ensure SSL directories exist with correct permissions
RUN mkdir -p /etc/ssl/certs /etc/ssl/private && \
    chmod 755 /etc/ssl/certs && \
    chmod 750 /etc/ssl/private

# Copy built static files to Nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]