# 🏗️ Infrastructure & Docker Standards (V2 — Next.js Monorepo)

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19
- **Database**: Prisma ORM + SQLite (`apps/web/prisma/dev.db`)
- **Package Manager**: PNPM Workspaces
- **AI**: Google Gemini (via `@ai-sdk/google`)
- **Container**: Docker (single-service `tuvi-app`)
- **Styling**: Tailwind CSS

## 📂 Cấu trúc Monorepo
```
tu-vi-la-so/
├── apps/
│   └── web/              # Next.js Application
│       ├── prisma/        # Schema + dev.db
│       ├── src/app/       # App Router (pages + API)
│       ├── src/lib/       # Business logic (astrology engines)
│       ├── src/components/ # React components
│       ├── Dockerfile.dev # Dev container config
│       └── package.json
├── packages/             # Shared packages (future)
├── docker-compose.yml    # Root orchestration
├── pnpm-workspace.yaml
├── package.json          # Root workspace config
└── .env                  # Environment variables
```

## 🌍 Environment Mapping
| Environment | Host Port | Container Port | Domain |
|-------------|-----------|---------------|--------|
| Local       | 8950      | 3000          | localhost:8950 |
| Production  | 8900      | 3000          | tuvi.demowebest.site |

- **Production Server**: 15.235.210.4, path `/home/tuvitool`
- **SSL**: Cloudflare Flexible

## 🐳 Docker Build
- **Base**: node:20-alpine
- **Package Manager**: PNPM (cài trong container)
- **Build context**: Root monorepo (để copy `pnpm-workspace.yaml` + `pnpm-lock.yaml`)
- **CMD**: `pnpm --filter web dev` (local) / `pnpm --filter web start` (production)
- **Volumes (dev)**: `./apps/web/src`, `./apps/web/prisma`

## 🔑 Environment Variables
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3000 | Next.js dev port (internal) |
| `HOST_PORT` | No | 8950 | Docker exposed port |
| `GEMINI_API_KEY` | **Yes** | - | Google Gemini API key |
| `GEMINI_MODEL` | No | gemini-1.5-flash-latest | Gemini model ID |
| `DATABASE_URL` | No | file:./dev.db | Prisma SQLite URL |
| `NODE_ENV` | No | development | Environment mode |

## 🔒 Security Protocol
- Docker-First: KHÔNG chạy `node`/`pnpm` trực tiếp trên host.
- `.env` file NOT in Git (documented in `.env.example`).
- Production: deploy qua workflow `/deploy-production`.
- KHÔNG bao giờ chạy `docker compose down -v` trên production.