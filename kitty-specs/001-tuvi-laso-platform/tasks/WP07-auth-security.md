# WP07: Authentication & Security

## Context

- Spec: `kitty-specs/001-tuvi-laso-platform/spec.md` Section 2 (User Story 5), Section 3 (FR-AUTH-001 to FR-AUTH-005, FR-API-006 to FR-API-007)
- Plan: `kitty-specs/001-tuvi-laso-platform/plan.md` — M5 Module

## Goal

Auth flow protects AI endpoint, security headers configured, rate limiting works.

## Auth Flow

```
1. POST /api/auth/login { username, password }
2. Validate: username === process.env.AUTH_USERNAME && password === process.env.AUTH_PASSWORD
3. Generate: crypto.randomBytes(32).toString('hex') → 64-char token
4. Store: authTokens.set(token, { username, expiry: Date.now() + 30min })
5. Response: { token: "..." }

Client:
6. sessionStorage.setItem('authSession', JSON.stringify({ token, expiry }))
7. Subsequent AI requests: Authorization: Bearer <token>

Server middleware:
8. requireAuth: extract Bearer → lookup in authTokens Map → check expiry
```

## Subtasks

- T058: Login flow logic
- T059: Token management (generation, storage, expiry)
- T060: requireAuth middleware
- T061: Client-side session (sessionStorage)
- T062: Helmet CSP config
- T063: CORS config
- T064: Rate limiters (general + AI)
- T065: Security testing

## Acceptance Criteria

1. Wrong credentials → 401 `{ error: "Sai thông tin đăng nhập" }`
2. Correct credentials → 200 `{ token: "hex_64_chars" }`
3. Valid token + AI request → 200 with AI response
4. Invalid/expired token → 401
5. No Authorization header → 401
6. Helmet headers present: X-Content-Type-Options, X-Frame-Options, etc.
7. Rate limit: general 100/15min, AI 10/15min

## Files to Review

- `server/server.js` (auth routes, middleware, Helmet, rate limit)
- `public/auth.js` (client session management)
