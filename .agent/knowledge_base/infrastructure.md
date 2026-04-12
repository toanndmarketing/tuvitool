# 🏗️ Infrastructure & Docker Standards

## 🛠️ Tech Stack
- **Runtime**: Node.js 20 Alpine
- **Backend**: Express.js 4.21
- **Database**: SQLite (better-sqlite3)
- **Frontend**: Vanilla HTML/JS/CSS (served as static files)
- **AI**: Google Gemini API
- **Container**: Docker (single-service)

## 📂 Environment Mapping
- **Local**: `docker-compose.yml` — port 8950
- **Production**: Server 15.235.210.4, path `/home/tuvitool`, port 8900 (Nginx reverse proxy)
- **Domain**: tuvi.demowebest.site (Cloudflare Flexible SSL)

### Services (1)
- `tuvi-app` — Express server serving static frontend + API

### Port Mapping
| Environment | Host Port | Container Port |
|-------------|-----------|---------------|
| Local       | 8950      | 8950          |
| Production  | 8900      | 8950          |

### Docker Build
- **Base**: node:20-alpine
- **Build deps**: python3, make, g++ (for better-sqlite3 native bindings)
- **CMD**: `node server/server.js`
- **Volumes**: `./data`, `./public`, `./server/tuvi-cli.js`

## 🔑 Environment Variables (8)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 8950 | Server port |
| `GEMINI_API_KEY` | **Yes** | - | Google Gemini API key |
| `GEMINI_MODEL` | No | gemini-2.0-flash | Gemini model name |
| `NODE_ENV` | No | production | Environment mode |
| `AUTH_USERNAME` | **Yes** | - | Login username |
| `AUTH_PASSWORD` | **Yes** | - | Login password |
| `SKIP_AUTH` | No | false | Bypass auth |
| `ICHING_DATA_PATH` | No | ./data/iching/hexagrams.json | I Ching data path |

## 🔒 Security Protocol
- Helmet CSP configured (self + Google Fonts)
- Rate limiting: 30 req/min (API), 5 req/min (AI)
- Bearer token auth (in-memory, 30 min TTL)
- Trust proxy = 1 (behind Nginx)
- Production: `.env` file NOT in Git, copied manually via SCP