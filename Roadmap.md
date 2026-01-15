# 🗺️ Distributed URL Shortener — 2 to 2.5 Week Roadmap

> **Goal:** Build a production-style, distributed URL shortener, deploy it live for free, then add unique features to make it resume-impactful and interview-ready.

---

## 🔹 PHASE 0 — Planning & Setup (Day 0.5)

### Objectives
- Decide core tech stack
- Avoid design mistakes early

### Tasks
- Choose backend: **Node.js (Express)** or **Python (Flask)**
- Choose database: **PostgreSQL (preferred)** or **MongoDB**
- Create GitHub repository
- Write a **1-page design document** containing:
  - High-level architecture diagram
  - Core components
  - Request–response data flow

### Deliverables
- GitHub repo initialized
- Basic architecture clarity

---

## 🔹 PHASE 1 — Core Backend (Days 1–4)

### Day 1 — Project Skeleton
- Setup folder structure
- Environment variable configuration
- Health check API (`/health`)
- Database connection

**Checkpoint:** Server runs and DB connects successfully

---

### Day 2 — URL Creation
- Implement `POST /shorten`
- Store long URL in database
- Use auto-increment ID
- Convert ID → Base62 short code
- Return generated short URL

**Checkpoint:** Short URLs can be generated

---

### Day 3 — URL Redirection
- Implement `GET /:short_code`
- Fetch long URL from DB
- Perform `301` redirect
- Handle invalid or expired codes

**Checkpoint:** Short URL redirects correctly

---

### Day 4 — Edge Cases & Stability
- Input validation
- Optional duplicate URL handling
- Expiry support (optional)
- Centralized error handling

**Checkpoint:** Stable and safe core system

---

## 🔹 PHASE 2 — Caching & Performance (Days 5–7)

### Day 5 — Redis Integration
- Setup **Upstash Redis**
- Cache `short_code → long_url`
- Implement cache-aside pattern

**Checkpoint:** Cache hit/miss logic working

---

### Day 6 — Cache Strategy
- TTL strategy
- Cache invalidation rules
- Fallback to DB if Redis fails

**Checkpoint:** Caching logic clearly explainable

---

### Day 7 — Scalability Thinking
- Identify read-heavy optimization
- Add logging
- Write performance section in README

**Checkpoint:** Interview-ready system explanation

---

## 🔹 PHASE 3 — Deployment (Days 8–9)

### Day 8 — Backend Deployment
- Deploy backend to **Render / Fly.io**
- Configure environment variables
- Test APIs on live server

---

### Day 9 — Frontend Deployment (Minimal)
- Build simple UI (input + output)
- Deploy frontend to **Vercel / Netlify**
- Connect frontend to live backend

**Checkpoint:** End-to-end system live

---

## 🔹 PHASE 4 — Uniqueness Layer (Days 10–13)

> Choose **only two** features to avoid overengineering.

### Day 10 — Feature 1 (Security / Intelligence)
Choose one:
- URL risk scoring
- Abuse rate limiting
- Signed short URLs

---

### Day 11 — Polish Feature 1
- Handle edge cases
- Add explanation in README
- Update architecture diagram

---

### Day 12 — Feature 2 (Analytics / Performance)
Choose one:
- Geo-based click analytics
- Adaptive Redis caching
- Click analytics dashboard

---

### Day 13 — Polish Feature 2
- Code cleanup
- Validate logic
- Update system design notes

---

## 🔹 PHASE 5 — Resume & Interview Prep (Days 14–16)

### Day 14 — README Finalization
Include:
- System architecture
- Design decisions
- Trade-offs
- Scalability approach
- Unique features

---

### Day 15 — Resume Bullet Points
- 2 technical bullets
- 1 impact-focused bullet

Example:
- Designed a distributed URL shortener using Redis caching and Base62 encoding to handle high read traffic efficiently.

---

### Day 16 — Interview Preparation
Practice answering:
- Why Base62 encoding?
- Why Redis?
- How does the system scale?
- What happens if Redis fails?

---

## 🏁 Final Outcome
- Live deployed project
- Strong system design discussion ability
- Resume-ready, unique backend project
