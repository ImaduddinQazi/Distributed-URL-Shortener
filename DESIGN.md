# 1. System Overview
distributed URL shortener designed for high traffic and low-latency redirects, featuring horizontal scalability, fault tolerance, and intelligent caching. It ensures unique short codes via Base62 encoding and includes security, analytics, and a clean API for a complete, portfolio-ready system.  The architecture prioritizes read-heavy optimization and graceful failure handling for real-world reliability.
# 2. High-Level Architecture Diagram

# 3. Core Components (bullet points)

## API Layer (Express routes)

### URL shortening:
To create a new short URL, a client sends a POST request, which contains one parameter: the original long URL. The API looks like this:

POST api/v1/data/shorten

- request parameter: {longUrl: longURLString}
- return: shortURL

### URL redirecting:
To redirect a short URL to the corresponding long URL, a client sends a GET request. The API looks like this:

GET api/v1/shortUrl

- return: longURL for HTTP redirection

## Cache Layer (Redis)
## Database Layer (PostgreSQL)
## URL Generator (Base62 encoder)

##4. Request Flow for Two Operations
## Flow 1: Creating a Short URL
User → POST /shorten → API validates → 
Generate ID → Encode to Base62 → 
Store in DB → Return short URL
## Flow 2: Redirecting
User → GET /:code → Check Redis → 
If hit: redirect → 
If miss: fetch DB → update Redis → redirect


# 5. Key Design Decisions

Why Base62? (URL-safe, compact, sequential)

Why PostgreSQL? (ACID, reliable auto-increment)

Why Redis? (Sub-millisecond reads for hot URLs)

Why cache-aside pattern? (Database is source of truth)
