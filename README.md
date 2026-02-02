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

## License

MIT
