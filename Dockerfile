# Use nginx alpine for a lightweight image
FROM nginx:alpine

# Copy the website files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY graphics-demo.html /usr/share/nginx/html/
COPY admin.html /usr/share/nginx/html/
COPY graphics_engine.js /usr/share/nginx/html/
COPY graphics_engine.wasm /usr/share/nginx/html/
COPY docs/ /usr/share/nginx/html/docs/
COPY cpu-simulator/ /usr/share/nginx/html/cpu-simulator/
COPY graphics-engine/ /usr/share/nginx/html/graphics-engine/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
