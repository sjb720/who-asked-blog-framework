#!/bin/bash
set -e

# Show available versions
echo "Available versions:"
docker images whoaskedblog-web --format "table {{.Tag}}\t{{.CreatedAt}}" | grep -v "latest"
echo ""

# Get target version
TARGET=${1:-previous}

if [ "$TARGET" = "previous" ]; then
    echo "Rolling back to previous version..."
elif [[ "$TARGET" =~ ^[0-9]{8}-[0-9]{6}$ ]]; then
    echo "Rolling back to version: $TARGET"
else
    echo "Usage: ./rollback.sh [version]"
    echo "  ./rollback.sh           # Rollback to 'previous'"
    echo "  ./rollback.sh 20240115-143022  # Rollback to specific version"
    exit 1
fi

# Check if target exists
if ! docker image inspect whoaskedblog-web:$TARGET > /dev/null 2>&1; then
    echo "Error: Version '$TARGET' not found"
    exit 1
fi

# Perform rollback
docker tag whoaskedblog-web:$TARGET whoaskedblog-web:latest
docker compose -f docker-compose.prod.yml up -d

echo "Waiting for health check..."
sleep 10

if curl -sf http://localhost:3000/api/health > /dev/null; then
    echo "Rollback to $TARGET successful"
else
    echo "Warning: Health check failed after rollback"
    exit 1
fi
