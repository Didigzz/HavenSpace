# Nginx Configuration for BHMS Production

This directory contains the Nginx configuration files for running the Boarding House Management System in production.

## Setup Instructions

### 1. Create SSL Directory

```bash
mkdir -p nginx/ssl
chmod 700 nginx/ssl
```

### 2. Obtain SSL Certificates

#### Option A: Let's Encrypt (Recommended for Production)

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Generate certificates
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
sudo chmod 600 nginx/ssl/*.pem
```

#### Option B: Self-Signed Certificates (Development Only)

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=yourdomain.com"
```

### 3. Update Configuration

Edit `nginx/nginx.conf` and replace:
- `yourdomain.com` with your actual domain
- `www.yourdomain.com` with your actual www domain
- `api.yourdomain.com` with your API subdomain

### 4. Test Configuration

```bash
docker run --rm -v $(pwd)/nginx:/etc/nginx nginx:alpine nginx -t
```

### 5. Deploy with Docker Compose

```bash
# Start all services including nginx
docker-compose -f docker-compose.production.yml up -d

# Check nginx logs
docker-compose -f docker-compose.production.yml logs -f nginx

# Restart nginx after configuration changes
docker-compose -f docker-compose.production.yml restart nginx
```

## Configuration Features

### Security
- SSL/TLS encryption with modern protocols
- Security headers (HSTS, X-Frame-Options, etc.)
- Rate limiting to prevent abuse
- CORS configuration for API

### Routing
- Main domain → Public marketplace
- `/boarder` → Boarder dashboard
- `/landlord` → Landlord portal  
- `/admin` → Admin panel
- `/api/*` → API endpoints
- `api.yourdomain.com` → API subdomain

### Performance
- Gzip compression
- Static file caching
- Keep-alive connections
- Upstream connection pooling

### Monitoring
- Health check endpoint at `/health`
- Access and error logs
- Prometheus metrics integration

## Troubleshooting

### SSL Certificate Issues

```bash
# Check certificate expiration
openssl x509 -in nginx/ssl/cert.pem -noout -dates

# Test SSL configuration
openssl s_client -connect yourdomain.com:443
```

### Nginx Won't Start

```bash
# Check configuration syntax
docker-compose -f docker-compose.production.yml exec nginx nginx -t

# View error logs
docker-compose -f docker-compose.production.yml logs nginx
```

### Service Not Accessible

```bash
# Check if nginx is running
docker-compose -f docker-compose.production.yml ps nginx

# Test upstream connectivity
docker-compose -f docker-compose.production.yml exec nginx wget -O- http://public:3000
```

## SSL Certificate Renewal

### Let's Encrypt Auto-Renewal

```bash
# Create renewal script
cat > /etc/cron.weekly/renew-ssl.sh << 'EOF'
#!/bin/bash
certbot renew --quiet
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /path/to/bhms/nginx/ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /path/to/bhms/nginx/ssl/key.pem
chmod 600 /path/to/bhms/nginx/ssl/*.pem
docker-compose -f /path/to/bhms/docker-compose.production.yml restart nginx
EOF

chmod +x /etc/cron.weekly/renew-ssl.sh
```

## Load Balancing (Advanced)

For high-availability deployments, you can configure multiple upstream servers:

```nginx
upstream public_upstream {
    server public1:3000;
    server public2:3000;
    server public3:3000 backup;
    keepalive 64;
}
```

## Monitoring Integration

The nginx configuration is compatible with:
- Prometheus metrics collection
- Grafana dashboards
- ELK stack for log analysis
- Datadog integration

## Security Best Practices

1. **Never commit SSL certificates** to version control
2. **Use strong SSL protocols** (TLS 1.2+)
3. **Enable HSTS** for strict transport security
4. **Regular certificate rotation**
5. **Monitor access logs** for suspicious activity
6. **Keep nginx updated** for security patches

## Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
- [OWASP Secure Headers](https://owasp.org/www-project-secure-headers/)