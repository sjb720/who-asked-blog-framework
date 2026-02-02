#!/bin/sh
set -e

echo "Running database migrations..."
./node_modules/prisma/build/index.js db push --skip-generate

echo "Seeding database (if needed)..."
node prisma/seed.js 2>/dev/null || true

echo "Starting production server..."
exec node server.js
