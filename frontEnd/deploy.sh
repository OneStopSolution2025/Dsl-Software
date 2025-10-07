#!/bin/bash

# Insurance Claims App Deployment Script
# Run this script on your production server

set -e  # Exit on any error

echo "🚀 Starting Insurance Claims App Deployment..."

# Variables - Update these for your environment
APP_DIR="/var/www/insurance-claims-app"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
DOMAIN="your-domain.com"

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p $APP_DIR

# Copy built files to server (adjust path if using different method)
echo "📋 Copying built files..."
sudo cp -r ../dist/* $APP_DIR/

# Set proper permissions
echo "🔒 Setting permissions..."
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR

# Create environment file
echo "🌍 Setting up production environment..."
if [ ! -f "$APP_DIR/.env" ]; then
    sudo cp .env.production $APP_DIR/.env
    echo "⚠️  Please edit $APP_DIR/.env with your production values!"
fi

# Setup Nginx configuration
echo "🌐 Configuring Nginx..."
if [ ! -f "$NGINX_SITES_AVAILABLE/insurance-claims-app" ]; then
    sudo cp nginx.conf $NGINX_SITES_AVAILABLE/insurance-claims-app
    sudo sed -i "s/your-domain.com/$DOMAIN/g" $NGINX_SITES_AVAILABLE/insurance-claims-app
    sudo sed -i "s|/var/www/insurance-claims-app|$APP_DIR|g" $NGINX_SITES_AVAILABLE/insurance-claims-app

    # Enable the site
    sudo ln -sf $NGINX_SITES_AVAILABLE/insurance-claims-app $NGINX_SITES_ENABLED/

    # Remove default site if exists
    sudo rm -f $NGINX_SITES_ENABLED/default

    echo "✅ Nginx configuration updated"
else
    echo "ℹ️  Nginx configuration already exists"
fi

# Test Nginx configuration
echo "🔍 Testing Nginx configuration..."
sudo nginx -t

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

# Create systemd service (optional, for process management)
echo "⚙️  Setting up systemd service..."
sudo tee /etc/systemd/system/insurance-claims-app.service > /dev/null <<EOF
[Unit]
Description=Insurance Claims App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
ExecStart=/usr/bin/serve -s . -l 3000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable insurance-claims-app
sudo systemctl start insurance-claims-app

echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update $APP_DIR/.env with your production environment variables"
echo "2. Update DNS to point to your server IP"
echo "3. Obtain and configure SSL certificate (recommended)"
echo "4. Test your application at http://$DOMAIN"
echo ""
echo "🔧 Useful commands:"
echo "- Check app status: sudo systemctl status insurance-claims-app"
echo "- View logs: sudo journalctl -u insurance-claims-app -f"
echo "- Restart app: sudo systemctl restart insurance-claims-app"
echo "- Check Nginx status: sudo systemctl status nginx"
