# Nginx Configuration Guide

This guide will walk you through installing and configuring Nginx as a reverse proxy.

## 1. Install Nginx

Update package list and install Nginx:
# Update package list
sudo apt update

# Install Nginx
sudo apt install nginx

# Check Nginx status
sudo systemctl status nginx

2. Create a new Nginx configuration file:
# Create/edit the configuration file
sudo nano /etc/nginx/sites-available/server

3. Add this configuration:
server {
    listen 80;
    server_name 134.255.180.63;  # Your VPS IP

    location / {
        proxy_pass http://localhost:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

4. Enable the configuration:
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/server /etc/nginx/sites-enabled/

# Remove default configuration (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

5. Verify it's working:

# Check Nginx status
sudo systemctl status nginx

# Check logs if there are issues
sudo tail -f /var/log/nginx/error.log

Now you should be able to access your NestJS API through port 80 (http://134.255.180.63) and Nginx will proxy the requests to your NestJS application running on port 3100.
If you want to check that everything is working:

# Install curl if not already installed
sudo apt install curl

# Test the API
curl http://134.255.180.63

## SSL Certificate Configuration with Certbot

### Installing Certbot

1. First, update your package list:
