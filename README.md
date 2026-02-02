# Who Asked Blog Framework

A self-hosted blogging platform built with Next.js, Prisma, and MinIO.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development without Docker)

### Quick Start

1. **Clone and configure**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your own values (or use the defaults for local development).

2. **Start the development server**

   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

   This will:
   - Start PostgreSQL database
   - Start MinIO (S3-compatible storage)
   - Run database migrations automatically
   - Seed the admin user
   - Start Next.js with hot reloading

3. **Access the app**

   - Blog: http://localhost:3000
   - Admin: http://localhost:3000/admin
   - Login: http://localhost:3000/login
   - MinIO Console: http://localhost:9001

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://bloguser:blogpass@db:5432/blog` |
| `S3_ENDPOINT` | MinIO/S3 endpoint (internal) | `http://minio:9000` |
| `S3_ACCESS_KEY` | MinIO access key | `minioadmin` |
| `S3_SECRET_KEY` | MinIO secret key | `minioadmin` |
| `S3_BUCKET` | Storage bucket name | `blog-uploads` |
| `S3_PUBLIC_URL` | Public URL for images | `http://localhost:9000` |
| `NEXTAUTH_URL` | App URL for auth | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Auth encryption key | Generate with `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Admin login email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin login password | `changeme123` |

---

## Theming

Themes are defined as CSS custom properties in `src/app/themes/`.

### Available Themes

- `light.css` - Light theme (default)
- `dark.css` - Dark theme

### Switching Themes

Edit `src/app/globals.css` and change the import:

```css
/* Light theme (default) */
@import "./themes/light.css";

/* Dark theme */
@import "./themes/dark.css";
```

### Theme Variables

#### Backgrounds

| Variable | Description |
|----------|-------------|
| `--bg-primary` | Main background (page, cards) |
| `--bg-secondary` | Secondary background (sections) |
| `--bg-tertiary` | Tertiary background (hover states) |
| `--bg-muted` | Muted background (disabled elements) |
| `--bg-overlay` | Modal/overlay backdrop |

#### Text

| Variable | Description |
|----------|-------------|
| `--text-primary` | Main text color |
| `--text-secondary` | Secondary text |
| `--text-muted` | Muted/subtle text |
| `--text-placeholder` | Placeholder text |
| `--text-disabled` | Disabled text |
| `--text-inverse` | Inverse text (on accent backgrounds) |

#### Borders

| Variable | Description |
|----------|-------------|
| `--border-primary` | Default border color |
| `--border-secondary` | Secondary border color |
| `--border-focus` | Focus ring color |

#### Accent Colors

| Variable | Description |
|----------|-------------|
| `--accent-primary` | Primary action color (buttons, links) |
| `--accent-primary-hover` | Primary hover state |
| `--accent-primary-light` | Lighter variant |
| `--accent-primary-dark` | Darker variant |
| `--accent-secondary` | Secondary action color |
| `--accent-secondary-hover` | Secondary hover state |

#### Status Colors

| Variable | Description |
|----------|-------------|
| `--status-success-bg` | Success background |
| `--status-success-text` | Success text |
| `--status-warning-bg` | Warning background |
| `--status-warning-text` | Warning text |
| `--status-error-bg` | Error background |
| `--status-error-text` | Error text |
| `--status-error` | Error accent |
| `--status-error-hover` | Error hover |

#### Utilities

| Variable | Description |
|----------|-------------|
| `--hover-bg` | Generic hover background |
| `--active-bg` | Active/pressed background |
| `--focus-ring` | Focus outline color |
| `--shadow-sm` | Small shadow |
| `--shadow-md` | Medium shadow |
| `--radius-sm` | Small border radius (4px) |
| `--radius-md` | Medium border radius (6px) |
| `--radius-lg` | Large border radius (8px) |
| `--radius-full` | Pill/circle radius |
| `--transition-fast` | Fast transition (150ms) |
| `--transition-normal` | Normal transition (200ms) |
| `--transition-slow` | Slow transition (300ms) |

### Creating a Custom Theme

1. Copy an existing theme:
   ```bash
   cp src/app/themes/light.css src/app/themes/custom.css
   ```

2. Edit the CSS variables in your new theme file

3. Import it in `globals.css`:
   ```css
   @import "./themes/custom.css";
   ```

### Using Theme Variables

In your CSS or Tailwind:

```css
.my-component {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  transition: background var(--transition-normal);
}

.my-component:hover {
  background: var(--hover-bg);
}
```

---

## Development Commands

```bash
# Start development environment
docker compose -f docker-compose.dev.yml up --build

# Stop and remove containers
docker compose -f docker-compose.dev.yml down

# Reset database (wipes all data)
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up --build

# View logs
docker compose -f docker-compose.dev.yml logs -f web

# Run Prisma commands
docker compose -f docker-compose.dev.yml exec web npx prisma studio
docker compose -f docker-compose.dev.yml exec web npx prisma db push
```

---

## Production Deployment

### Quick Production Start

1. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Update these values for production:
   - `NEXTAUTH_SECRET` - Generate a secure secret: `openssl rand -base64 32`
   - `ADMIN_EMAIL` - Your admin email
   - `ADMIN_PASSWORD` - A strong admin password
   - `S3_ACCESS_KEY` - Unique MinIO access key
   - `S3_SECRET_KEY` - Unique MinIO secret key
   - `NEXTAUTH_URL` - Your domain (e.g., `https://blog.example.com`)
   - `S3_PUBLIC_URL` - Public URL for images (e.g., `https://blog.example.com:9000`)

2. **Start production containers**

   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

3. **Check status**

   ```bash
   docker compose -f docker-compose.prod.yml ps
   docker compose -f docker-compose.prod.yml logs -f
   ```

### Production Features

- **Health checks**: All services have health checks that trigger automatic restarts
- **Automatic migrations**: Database migrations run on startup
- **Persistent data**: Named volumes ensure data survives container restarts
- **Restart policy**: Containers restart automatically unless manually stopped

### Reverse Proxy Setup (Recommended)

For production, place a reverse proxy (nginx, Caddy, Traefik) in front of the app:

**Example nginx configuration:**

```nginx
server {
    listen 80;
    server_name blog.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name blog.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Cloudflare Tunnel Setup

For exposing only the frontend through Cloudflare Tunnel (recommended for home servers):

1. **Install cloudflared** on your server:
   ```bash
   # Debian/Ubuntu
   curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
   sudo dpkg -i cloudflared.deb
   ```

2. **Authenticate and create tunnel**:
   ```bash
   cloudflared tunnel login
   cloudflared tunnel create whoaskedblog
   ```

3. **Configure the tunnel** (`~/.cloudflared/config.yml`):
   ```yaml
   tunnel: <your-tunnel-id>
   credentials-file: /home/<user>/.cloudflared/<tunnel-id>.json

   ingress:
     - hostname: blog.yourdomain.com
       service: http://localhost:3000
     - service: http_status:404
   ```

4. **Add DNS record**:
   ```bash
   cloudflared tunnel route dns whoaskedblog blog.yourdomain.com
   ```

5. **Run as a service**:
   ```bash
   sudo cloudflared service install
   sudo systemctl enable cloudflared
   sudo systemctl start cloudflared
   ```

**Important**: The production config uses an image proxy (`/api/images`) so MinIO stays internal. Images are served through Next.js and cached by Cloudflare's CDN.

### Production Commands

```bash
# Start in background
docker compose -f docker-compose.prod.yml up -d --build

# Stop containers
docker compose -f docker-compose.prod.yml down

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Restart a specific service
docker compose -f docker-compose.prod.yml restart web

# Check health status
curl http://localhost:3000/api/health

# Backup database
docker compose -f docker-compose.prod.yml exec db pg_dump -U bloguser blog > backup.sql

# Restore database
cat backup.sql | docker compose -f docker-compose.prod.yml exec -T db psql -U bloguser blog
```

### Deploying Updates

Follow this procedure to deploy updates with the ability to rollback:

**1. Tag the current release before updating:**

```bash
# Get current version (or use your own versioning)
VERSION=$(date +%Y%m%d-%H%M%S)

# Tag current working images
docker tag whoaskedblog-web:latest whoaskedblog-web:$VERSION
docker tag whoaskedblog-web:latest whoaskedblog-web:previous

# List your tagged versions
docker images whoaskedblog-web
```

**2. Pull and deploy the update:**

```bash
# Pull latest code
git pull

# Build and deploy (containers restart automatically)
docker compose -f docker-compose.prod.yml up -d --build

# Watch the deployment
docker compose -f docker-compose.prod.yml logs -f web
```

**3. Verify the deployment:**

```bash
# Check health
curl http://localhost:3000/api/health

# Check container status
docker compose -f docker-compose.prod.yml ps
```

**4. Rollback if needed:**

```bash
# Quick rollback to previous version
docker tag whoaskedblog-web:previous whoaskedblog-web:latest
docker compose -f docker-compose.prod.yml up -d

# Or rollback to a specific tagged version
docker tag whoaskedblog-web:20240115-143022 whoaskedblog-web:latest
docker compose -f docker-compose.prod.yml up -d
```

**Automated deploy script** (save as `deploy.sh`):

```bash
#!/bin/bash
set -e

VERSION=$(date +%Y%m%d-%H%M%S)
echo "Deploying version: $VERSION"

# Tag current as previous for quick rollback
docker tag whoaskedblog-web:latest whoaskedblog-web:previous 2>/dev/null || true

# Pull and build
git pull
docker compose -f docker-compose.prod.yml build

# Tag the new build
docker tag whoaskedblog-web:latest whoaskedblog-web:$VERSION

# Deploy
docker compose -f docker-compose.prod.yml up -d

# Wait for health check
echo "Waiting for health check..."
sleep 10
if curl -sf http://localhost:3000/api/health > /dev/null; then
    echo "Deploy successful: $VERSION"
else
    echo "Health check failed, rolling back..."
    docker tag whoaskedblog-web:previous whoaskedblog-web:latest
    docker compose -f docker-compose.prod.yml up -d
    exit 1
fi
```

Make it executable: `chmod +x deploy.sh`

### Data Persistence

Production uses named volumes for data persistence:

- `whoaskedblog_pgdata` - PostgreSQL database
- `whoaskedblog_minio_data` - Uploaded images and files

To backup these volumes:

```bash
# Backup
docker run --rm -v whoaskedblog_pgdata:/data -v $(pwd):/backup alpine tar czf /backup/pgdata-backup.tar.gz /data
docker run --rm -v whoaskedblog_minio_data:/data -v $(pwd):/backup alpine tar czf /backup/minio-backup.tar.gz /data

# Restore
docker run --rm -v whoaskedblog_pgdata:/data -v $(pwd):/backup alpine tar xzf /backup/pgdata-backup.tar.gz -C /
docker run --rm -v whoaskedblog_minio_data:/data -v $(pwd):/backup alpine tar xzf /backup/minio-backup.tar.gz -C /
```

---

## License

MIT
