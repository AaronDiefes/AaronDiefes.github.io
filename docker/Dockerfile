# Multi-stage build: Node build + Nginx serve
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build React app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy WASM files to assets directory
COPY --from=build /app/graphics_engine.js /usr/share/nginx/html/assets/
COPY --from=build /app/graphics_engine.wasm /usr/share/nginx/html/assets/

# Copy C++ source reference (for admin page)
COPY --from=build /app/graphics-engine /usr/share/nginx/html/graphics-engine-src

# Copy custom nginx configuration for SPA routing
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
