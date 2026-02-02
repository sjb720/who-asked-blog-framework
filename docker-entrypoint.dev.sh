#!/bin/sh
set -e

echo "Waiting for database..."
npx prisma db push --skip-generate

echo "Seeding database (if needed)..."
npm run db:seed 2>/dev/null || true

echo "Starting dev server..."
exec npm run dev
