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

Using Redis for caching and faster respone to requested Long URLs. 

## Database Layer (PostgreSQL)

PostgreSQL is reliable, ACID‑compliant, and offers powerful indexing/constraints to prevent collisions. It balances SQL rigor with JSON flexibility, making it robust yet adaptable for scalable URL shorteners.

## URL Generator (Base62 encoder)
Base conversion is an approach commonly used for URL shorteners. Base conversion helps to convert the same number between its different number representation systems. Base 62 conversion is used as there are 62 possible characters for hashValue. Collision is not possible because ID is unique. ( 62 => 0-9(10) + a-z(26) + A-Z(26) )  

# 4. Request Flow for Two Operations
### Flow 1: Creating a Short URL
User → POST /shorten → API validates → 
Generate ID → Encode to Base62 → 
Store in DB → Return short URL
### Flow 2: Redirecting
User → GET /:code → Check Redis → 
If hit: redirect → 
If miss: fetch DB → update Redis → redirect


# 5. Key Design Decisions

Why Base62? (URL-safe, compact, sequential)
- URL-safe characters (no special encoding needed)
- Compact representation (7 chars = 3.5 trillion URLs)
- Sequential generation (no collisions)

Why PostgreSQL? (ACID, reliable auto-increment)
- ACID compliance
- Reliable auto-increment IDs
- Strong consistency

Why Redis? (Sub-millisecond reads for hot URLs)

Why cache-aside pattern? (Database is source of truth)
