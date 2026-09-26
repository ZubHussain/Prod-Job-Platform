# JobNova

Microservices MERN job application portal.

## Services
- api-gateway : 8080
- mongodb : 27017
- redis : 6379
- auth-service : 4001
- user-service : 4002
- job-service : 4003
- application-service : 4004
- ai-service : 4005
- notification-service : 4006
- job-ingestion-service : 5007
- job-digestion-service : 5008
- frontend : 5173

## Run locally

Docker Compose supplies local MongoDB, Kafka, Redis, service URLs, and development
defaults; no per-service `.env.example` files are needed. Set provider credentials
in the project-root `.env` file (or in the shell) before starting the stack:

```dotenv
ADZUNA_APP_ID=your-adzuna-app-id
ADZUNA_APP_KEY=your-adzuna-app-key
INGEST_API_KEY=replace-with-a-local-secret
JWT_SECRET=replace-with-a-local-secret
```

`ADZUNA_APP_ID` and `ADZUNA_APP_KEY` are needed for job ingestion. The rest of the
platform starts without them, but ingestion scheduling stays disabled until they
are configured. `OPENAI_API_KEY`, Cloudinary, and SMTP settings are optional and
are needed only for their respective integrations. Compose's default JWT and
ingestion keys are for local development only; replace them outside local use.

Start the services and frontend:

```sh
docker compose up --build
```

Open <http://localhost:5173>. The frontend calls `/api` on the same host; Nginx
forwards those requests to the API gateway. With Vite development mode, requests
are proxied to `http://localhost:8080` (override with
`VITE_API_PROXY_TARGET` if needed).

## Job ingestion and digestion

The ingestion scheduler searches Adzuna using `JOB_KEYWORDS`, `JOB_LOCATIONS`,
`ADZUNA_COUNTRY`, and `INGEST_CRON`. It publishes raw events to `jobs.raw`.
The digestion service validates and normalizes them, then publishes accepted
records to `jobs.cleaned` and rejected records to `jobs.rejected`. The job
service consumes `jobs.cleaned`, upserts each source job by its stable external
key, and publishes it through the existing `GET /api/jobs` endpoint. Imported
jobs link to the provider's application page; they are not internal JobNova
applications.

To run ingestion immediately rather than waiting for the schedule:

```sh
curl -X POST http://localhost:5007/api/v1/ingestion/run \
  -H "x-ingest-api-key: replace-with-the-INGEST_API_KEY-value"
```

Replace the header value with the same key configured for Compose.
The endpoint returns per-run counts and identifies searches that failed. It
responds with `503` when Adzuna credentials are missing and `409` when another
ingestion run is already active.

## Tests

```sh
cd job-digestion-service && npm test
cd ../job-service && npm test
