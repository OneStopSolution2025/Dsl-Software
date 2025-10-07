# Production Deployment Guide - Insurance Claims App

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ **Domain name** (e.g., claims.yourcompany.com)
- ✅ **Server with Ubuntu/Debian** and root access
- ✅ **Google Maps API Key** for production
- ✅ **SSL Certificate** (recommended, using Let's Encrypt)

## 🚀 Deployment Steps

### Step 1: Server Setup
```bash
# Update your server
sudo apt update && sudo apt upgrade -y

# Install required software
sudo apt install -y nginx nodejs npm git certbot python3-certbot-nginx
```

### Step 2: Application Setup
```bash
# Create application directory
sudo mkdir -p /var/www/insurance-claims-app

# Copy your built application files to the server
# (Use SCP, FTP, or your preferred method)
# Example: scp -r dist/* user@your-server:/var/www/insurance-claims-app/

# Set proper ownership
sudo chown -R www-data:www-data /var/www/insurance-claims-app
```

### Step 3: Environment Configuration
1. **Copy the production environment file:**
   ```bash
   cp .env.production /var/www/insurance-claims-app/.env
   ```

2. **Edit the environment file:**
   ```bash
   nano /var/www/insurance-claims-app/.env
   ```

3. **Required environment variables:**
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_production_api_key
   VITE_API_BASE_URL=https://your-api-domain.com/api
   VITE_APP_ENV=production
   ```

### Step 4: Nginx Configuration
1. **Copy the Nginx configuration:**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/insurance-claims-app
   ```

2. **Update domain name in config:**
   ```bash
   sudo sed -i 's/your-domain.com/your-actual-domain.com/g' /etc/nginx/sites-available/insurance-claims-app
   ```

3. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/insurance-claims-app /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   ```

4. **Test and reload Nginx:**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Step 5: SSL Certificate (Recommended)
```bash
# Install SSL certificate using Let's Encrypt
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (runs twice daily)
sudo systemctl enable certbot.timer
```

## 🔧 Production Environment Variables

### Required Variables:
- `VITE_GOOGLE_MAPS_API_KEY` - Your production Google Maps API key
- `VITE_API_BASE_URL` - Your production API endpoint
- `VITE_APP_ENV` - Set to "production"

### Optional Variables:
- `VITE_ENABLE_ANALYTICS` - Enable/disable analytics (default: false)
- `VITE_ENABLE_ERROR_REPORTING` - Enable error reporting (default: false)

## 📊 Monitoring & Maintenance

### Check Application Status:
```bash
sudo systemctl status insurance-claims-app
```

### View Application Logs:
```bash
sudo journalctl -u insurance-claims-app -f
```

### Nginx Access Logs:
```bash
sudo tail -f /var/log/nginx/insurance-claims-app_access.log
```

### Nginx Error Logs:
```bash
sudo tail -f /var/log/nginx/insurance-claims-app_error.log
```

## 🔒 Security Best Practices

1. **SSL Certificate** - Always use HTTPS in production
2. **Environment Variables** - Never commit .env files to version control
3. **File Permissions** - Ensure proper ownership (www-data:www-data)
4. **Firewall** - Configure UFW to allow only necessary ports (22, 80, 443)
5. **Updates** - Keep server and application dependencies updated

## 🚨 Troubleshooting

### Common Issues:

**Problem:** Application not loading
```bash
# Check if the service is running
sudo systemctl status insurance-claims-app

# Check Nginx status
sudo systemctl status nginx

# Check logs for errors
sudo journalctl -u insurance-claims-app --no-pager -n 50
```

**Problem:** Google Maps not loading
- Verify `VITE_GOOGLE_MAPS_API_KEY` is correct
- Check browser console for API errors
- Ensure API key has proper domain restrictions

**Problem:** Styling issues
- Clear browser cache
- Check if CSS files are loading properly
- Verify file paths in built application

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review application logs for error details
3. Verify environment variables are correctly set
4. Ensure DNS is properly configured

## 🎯 Quick Commands Reference

```bash
# Restart application
sudo systemctl restart insurance-claims-app

# Reload Nginx configuration
sudo systemctl reload nginx

# Check disk usage
df -h

# Check memory usage
free -h

# View active connections
sudo netstat -tuln | grep :80
```

---

**🎉 Your Insurance Claims App is now deployed and ready for production use!**
