# JobNova

Microservices MERN job application portal.

## Services
- api-gateway : 8080
- auth-service : 4001
- user-service : 4002
- job-service : 4003
- application-service : 4004
- ai-service : 4005
- notification-service : 4006
- frontend : 5173

## Run
1. Copy `.env.example` files to `.env` in every service.
2. Fill secrets.
3. Run:
   docker compose up --build
