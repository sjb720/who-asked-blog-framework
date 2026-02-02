#!/bin/bash
set -e

VERSION=$(date +%Y%m%d-%H%M%S)
echo "Deploying version: $VERSION"

# Tag current as previous for quick rollback
docker tag whoaskedblog-web:latest whoaskedblog-web:previous 2>/dev/null || true

# Pull latest code
git pull

# Build new image
docker compose -f docker-compose.prod.yml build

# Tag the new build with version
docker tag whoaskedblog-web:latest whoaskedblog-web:$VERSION

# Deploy
docker compose -f docker-compose.prod.yml up -d

# Wait for container to start
echo "Waiting for health check..."
sleep 15

# Verify deployment
if curl -sf http://localhost:3000/api/health > /dev/null; then
    echo "Deploy successful: $VERSION"
    echo "Tagged images:"
    docker images whoaskedblog-web --format "table {{.Tag}}\t{{.CreatedAt}}" | head -5
else
    echo "Health check failed, rolling back to previous version..."
    docker tag whoaskedblog-web:previous whoaskedblog-web:latest
    docker compose -f docker-compose.prod.yml up -d
    echo "Rollback complete"
    exit 1
fi
