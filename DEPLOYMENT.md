# Creator World Backend - Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- PostgreSQL 12+ and Redis 6+ (if not using Docker)
- Node.js 18+ (for local development)
- Environment variables configured

## Local Development Setup

### 1. Database Configuration
```bash
# Using Docker Compose (Recommended)
docker-compose up -d

# Or setup PostgreSQL locally
psql -U postgres
CREATE DATABASE creator_world;
CREATE USER creator_user WITH PASSWORD 'creator_password';
ALTER ROLE creator_user SET client_encoding TO 'utf8mb4';
GRANT ALL PRIVILEGES ON DATABASE creator_world TO creator_user;
```

### 2. Environment Setup
```bash
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Install and Run
```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Server: `http://localhost:3001/api/v1`

## Docker Deployment

### Build and Run
```bash
# Build image
docker build -t creator-world-be:latest .

# Run container
docker run -d \
  --name creator-world-api \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e REDIS_HOST=redis-host \
  creator-world-be:latest
```

### Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3001
LOG_LEVEL=warn

# Database
DATABASE_URL=postgresql://user:password@prod-db-host:5432/creator_world
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20

# Redis
REDIS_HOST=prod-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=secure_redis_password

# JWT
JWT_SECRET=very_secure_random_secret_key_minimum_32_chars
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=another_secure_random_secret_key

# CORS
CORS_ORIGIN=https://creatorworld.com,https://app.creatorworld.com

# File Upload
MAX_FILE_SIZE=52428800

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=1000
```

### Build for Production
```bash
npm run build
npm start
```

### Health Check
```bash
curl http://localhost:3001/health
```

### Database Migrations
```bash
npm run prisma:migrate:deploy
```

## Kubernetes Deployment

### Create Deployment YAML
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: creator-world-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: creator-world-api
  template:
    metadata:
      labels:
        app: creator-world-api
    spec:
      containers:
      - name: api
        image: creator-world-be:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 5
```

### Deploy
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

## Monitoring

### Logs
```bash
# Docker
docker logs -f creator-world-api

# Kubernetes
kubectl logs -f deployment/creator-world-api

# Application logs
tail -f logs/all.log
tail -f logs/error.log
```

### Metrics
Monitor these metrics:
- Response time (p95 < 500ms)
- Error rate (< 0.1%)
- Request throughput
- Database connection pool usage
- Redis memory usage
- CPU and memory usage

### Alerting
Set up alerts for:
- Service down (health check failing)
- Error rate spike
- Response time degradation
- Database connection errors
- Redis connection errors

## Scaling

### Horizontal Scaling
1. Services are stateless (scale via load balancer)
2. Configure database connection pooling
3. Use Redis for session management
4. Deploy multiple instances with load balancer

### Vertical Scaling
- Increase CPU/memory allocation
- Increase database connection pool
- Optimize queries and indexes

## Backup and Recovery

### Database Backups
```bash
# Backup
pg_dump -U creator_user creator_world > backup.sql

# Restore
psql -U creator_user creator_world < backup.sql
```

### Redis Backups
```bash
# Backup persistence enabled in docker-compose.yml
# Data saved to redis_data volume

# Manual backup
docker exec creator_world_redis redis-cli BGSAVE
```

## Troubleshooting

### Service Won't Start
```bash
# Check logs
docker logs creator-world-api

# Check environment variables
docker exec creator-world-api env

# Verify database connection
docker exec creator-world-api npm run prisma:migrate:status
```

### Database Connection Issues
```bash
# Check PostgreSQL status
docker exec creator_world_postgres pg_isready

# Test connection
psql postgresql://user:password@localhost:5432/creator_world
```

### Redis Connection Issues
```bash
# Check Redis status
docker exec creator_world_redis redis-cli ping

# Monitor Redis
docker exec creator_world_redis redis-cli MONITOR
```

### Performance Issues
```bash
# Check slow queries (Prisma logs)
# Enable query logging: DATABASE_LOG_QUERIES=true

# Analyze database
docker exec creator_world_postgres psql -U creator_user creator_world -c "ANALYZE;"

# Check indexes
docker exec creator_world_postgres psql -U creator_user creator_world -c "\d+ user_table"
```

## Maintenance

### Database Maintenance
```bash
# Weekly: VACUUM and ANALYZE
VACUUM ANALYZE;

# Monthly: Check bloat
SELECT * FROM pgstattuple('user');
```

### Security Updates
```bash
# Keep Node.js updated
node --version

# Update dependencies
npm outdated
npm update

# Security audit
npm audit fix
```

### Cleanups
```bash
# Remove old logs
find logs/ -name "*.log" -mtime +30 -delete

# Clean Docker
docker system prune -a
```

## Rollback Procedures

### Application Rollback
```bash
# Keep previous Docker images
docker images

# Rollback to previous version
docker run -d --name creator-world-api-old image-sha

# Switch DNS/load balancer to old version
```

### Database Rollback
```bash
# Revert to previous migration
npm run prisma:migrate -- --name revert_latest

# Or restore from backup
psql -U creator_user creator_world < backup.sql
```

## Performance Optimization

### Database
- Add indexes on frequently queried fields
- Use connection pooling
- Optimize slow queries
- Archive old data

### Application
- Enable compression
- Use caching (Redis)
- Implement rate limiting
- Load balance requests

### Infrastructure
- Use CDN for static files
- Enable gzip compression
- Configure caching headers
- Use multiple instances

## Disaster Recovery Plan

### Recovery Time Objective (RTO): 15 minutes
### Recovery Point Objective (RPO): 5 minutes

1. Database automated backups every hour
2. Keep last 30 daily backups
3. Weekly backups stored offline
4. Test recovery quarterly
5. Document restoration procedures

---

For emergency support, contact: support@creatorworld.com
