# StreamHub Deployment Guide

Complete guide for deploying StreamHub to production.

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account
- Backend API running and publicly accessible

### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/streamhub.git
git push -u origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL=https://your-api-domain.com`
   - Deploy

4. **Custom Domain (Optional)**
   - Settings → Domains
   - Add your custom domain
   - Follow DNS configuration

### Vercel Dashboard
After deployment:
- **Deployments**: View all deployments and rollback if needed
- **Analytics**: Monitor performance and usage
- **Edge Middleware**: Set up custom routing rules
- **Preview URLs**: Get unique URLs for each pull request

## 🐳 Deploy with Docker

### Prerequisites
- Docker installed
- Docker Hub account (or other registry)

### Dockerfile
Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy app
COPY . .

# Build
RUN pnpm build

# Runtime stage
FROM node:18-alpine
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start
CMD ["pnpm", "start"]
```

### Build and Push
```bash
# Build image
docker build -t streamhub:latest .

# Tag for registry
docker tag streamhub:latest yourusername/streamhub:latest

# Push to Docker Hub
docker login
docker push yourusername/streamhub:latest

# Or use other registries (ECR, GCR, Quay)
```

### Run Container
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  yourusername/streamhub:latest
```

## ☁️ Deploy to AWS

### Option 1: Elastic Container Service (ECS)

1. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name streamhub --region us-east-1
```

2. **Push Image**
```bash
# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag streamhub:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/streamhub:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/streamhub:latest
```

3. **Create ECS Cluster**
```bash
aws ecs create-cluster --cluster-name streamhub-cluster
```

4. **Create Task Definition**
```json
{
  "family": "streamhub",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "streamhub",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/streamhub:latest",
      "portMappings": [
        {"containerPort": 3000, "hostPort": 3000, "protocol": "tcp"}
      ],
      "environment": [
        {"name": "NEXT_PUBLIC_API_URL", "value": "https://api.example.com"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/streamhub",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

5. **Create Service**
```bash
aws ecs create-service \
  --cluster streamhub-cluster \
  --service-name streamhub-service \
  --task-definition streamhub \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx]}"
```

### Option 2: Amplify

1. Connect GitHub repo to AWS Amplify
2. Configure build settings
3. Amplify auto-deploys on push

## ☁️ Deploy to Google Cloud

### Cloud Run
```bash
# Build image
gcloud builds submit --tag gcr.io/PROJECT_ID/streamhub

# Deploy
gcloud run deploy streamhub \
  --image gcr.io/PROJECT_ID/streamhub \
  --platform managed \
  --region us-central1 \
  --set-env-vars NEXT_PUBLIC_API_URL=https://api.example.com \
  --allow-unauthenticated
```

### App Engine
```bash
# Create app.yaml
runtime: nodejs18

env: standard

env_variables:
  NEXT_PUBLIC_API_URL: "https://api.example.com"
```

```bash
gcloud app deploy
```

## 🔑 Environment Variables

### Frontend
```env
NEXT_PUBLIC_API_URL=https://api.example.com  # Public, visible in browser
```

### Backend (varies by implementation)
```env
DATABASE_URL=postgresql://user:pass@host/db
S3_BUCKET=videos-bucket
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
CLOUDFRONT_DOMAIN=d123.cloudfront.net
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://yourdomain.com
```

## 🔒 Security Considerations

### Frontend
- No API keys in frontend code
- Use `NEXT_PUBLIC_` prefix only for public values
- Enable HTTPS only
- Set Content Security Policy headers
- Implement CORS properly

### Backend API
- Validate all inputs
- Implement rate limiting
- Add authentication/authorization
- Use HTTPS
- Implement request logging
- Add monitoring and alerts

### S3/Storage
- Use presigned URLs (time-limited)
- Enable versioning
- Set bucket policies restrictive
- Enable encryption
- Enable logging

## 📊 Monitoring & Analytics

### Vercel
- Built-in analytics dashboard
- Real-time logs
- Performance metrics
- Error tracking

### Application Monitoring
```typescript
// Add monitoring (Sentry example)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### Backend Monitoring
- Application logs (CloudWatch, Stackdriver)
- Error tracking (Sentry, Rollbar)
- Performance monitoring (New Relic, DataDog)
- Uptime monitoring (UptimeRobot, Pingdom)

## 🚦 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Testing Before Deploy
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

## 📈 Performance Optimization

### Build Optimization
- Code splitting (automatic with Next.js)
- Image optimization (next/image)
- Font optimization
- CSS minification

### Runtime Optimization
- Caching headers
- Compression (gzip, brotli)
- CDN for static assets
- Database connection pooling

### Monitoring Performance
```bash
# Use Lighthouse
npm install -g lighthouse
lighthouse https://yourdomain.com --output html

# Use WebPageTest
# Visit webpagetest.org
```

## 🔄 Blue-Green Deployment

For zero-downtime deployments:

1. Deploy new version to separate environment
2. Run smoke tests
3. Switch traffic (DNS/Load Balancer)
4. Keep old version running for rollback

## 🔁 Rollback Procedure

### Vercel
- Dashboard → Deployments
- Click "Redeploy" on previous version

### Docker/Kubernetes
```bash
# List previous versions
docker images

# Roll back to previous tag
kubectl set image deployment/streamhub \
  streamhub=yourusername/streamhub:v1.0.0
```

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Backend API accessible
- [ ] S3/CDN configured
- [ ] Database migrations run
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Incident response plan ready
- [ ] Documentation updated
- [ ] Performance optimized
- [ ] Security reviewed

## 🆘 Troubleshooting Deployments

### Build Fails
1. Check logs in deployment platform
2. Verify dependencies are installed
3. Check Node version compatibility
4. Verify environment variables

### Runtime Errors
1. Check application logs
2. Verify API connectivity
3. Check database connections
4. Review error tracking service

### Performance Issues
1. Check Core Web Vitals
2. Profile with browser DevTools
3. Check CDN cache settings
4. Optimize database queries

---

**Deployment complete!** Your StreamHub is live and ready to serve.
