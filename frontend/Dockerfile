# Use a lightweight web server
FROM nginx:alpine

# Copy frontend files to the Nginx web server's default directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
