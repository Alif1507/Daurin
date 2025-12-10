# Daurin

## Running with Docker

The repository ships with separate Docker images for the Flask backend and the React frontend. Everything is orchestrated with `docker-compose.yml`.

### 1. Configure the backend

1. Copy `Backend_Daurin/.env.example` to `Backend_Daurin/.env` and set the values:
   - `DATABASE_URL` – defaults to `mysql+pymysql://daurin:daurinpass@mysql:3306/daurin` for the bundled MySQL service. Update this to match your credentials.
   - `JWT_SECRET_KEY` – a long random secret (mandatory for production).
   - `FRONTEND_ORIGINS` – comma-separated list of allowed origins for CORS.
   - `GOOGLE_API_KEY` / `GEMINI_API_KEY` – required when using Gemini/GGML-powered features.
2. Never commit the real `.env`; keep secrets in your deployment platform’s secret manager.

### 2. Build and run the stack

From the repo root run:

```sh
docker compose up --build
```

Services:

- **Backend** – exposed on `http://localhost:5000`, volume-mounted `uploads/` and `assistant_history.jsonl` for persistence.
- **Frontend** – served by Nginx on `http://localhost:4173` and compiled with the API base `http://localhost:5000/api`.
- **MySQL** – accessible on `localhost:3306` (credentials default to `daurin` / `daurinpass`, change in `docker-compose.yml` and `.env` as needed). Data lives in the `mysql-data` Docker volume.
- **phpMyAdmin** – available at `http://localhost:8080` for inspecting the MySQL database (log in with the same credentials).

Use `docker compose down` to stop the containers. Add `-v` if you also want to remove the named volumes (none are defined by default).

### Production checklist

- Provide a managed database via `DATABASE_URL` (SQLite is blocked in production mode). Rotate the default MySQL credentials or point to your cloud database.
- Set `JWT_SECRET_KEY` plus any Gemini/Google keys through your secret manager.
- Run the backend container behind HTTPS (reverse proxy or ingress) and scale using Docker/Kubernetes with `gunicorn`.
- Persist user uploads and assistant history on durable storage (S3, network disk, etc.) instead of the container filesystem.
