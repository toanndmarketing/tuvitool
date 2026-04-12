---
name: tech
description: Technical standards for tu-vi-la-so project
---

# Technical Standards

## Stack
- Backend: Express.js 4.21 (Node.js 20 Alpine)
- Database: SQLite (better-sqlite3)
- Frontend: Vanilla HTML + JavaScript + CSS (NO framework)
- AI: Google Gemini API (gemini-2.0-flash)
- Container: Docker (tuvi-app)

## Ports
- Local: 8950
- Production: 8900

## Rules
- Docker-First: NO running node/python on host
- Vietnamese language responses
- NO hardcoded URLs, Tokens, Keys — use .env
- Frontend: Global functions (NO import/export)
- Backend: CommonJS require()
- Domain accuracy: Test with /test-tuvi workflow
