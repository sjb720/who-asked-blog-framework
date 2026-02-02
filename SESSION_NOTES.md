# Session Notes - Production Deployment

## Current Status
- Production is LIVE at https://whoasked.blog
- Cloudflare Tunnel is running manually (not as a service yet)
- Database tables created manually with `prisma db push`

## TODO Next Session

### 1. Fix Production Auto-Migration
The production entrypoint uses `prisma migrate deploy` which requires migration files.
Dev uses `prisma db push` which works without migration files.

**Options:**
- A) Change prod entrypoint to use `db push` (simpler, matches dev)
- B) Generate proper migration files and commit them (more "correct" for production)

**Current entrypoint (`docker-entrypoint.prod.sh`):**
```sh
./node_modules/prisma/build/index.js migrate deploy  # Fails - no migrations
```

**Should probably be:**
```sh
./node_modules/prisma/build/index.js db push --accept-data-loss
```

Or generate migrations:
```bash
npx prisma migrate dev --name init
# Then commit the prisma/migrations folder
```

### 2. Install Cloudflare Tunnel as a Service
Currently running manually. Need to run:
```bash
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

### 3. Seed Admin User in Production
The dev setup seeds an admin user. Production may need this too.
Check if `/login` works and admin user exists.

## What's Working
- Docker containers running (web, db, minio)
- Health check passing
- Cloudflare Tunnel routing traffic
- HTTPS via Cloudflare
- Image proxy for MinIO

## Server Details
- Ubuntu machine on local network
- SSH access configured
- Docker installed
- Auto-login enabled (no monitor needed)
