# Dockerized .NET + React App + Postgres

This example provides a Dockerized setup for a .NET API backend and a React frontend, along with a PostgreSQL database.

## Project Structure
```
├── API
│   └── ... (.NET API project)
├── client
│   └── ... (React frontend project)
├── nginx
│   └── nginx.conf (Nginx configuration)
├── psqlinit
│   └── init.sql (PostgreSQL initialization script)
├── Dockerfile.api
├── Dockerfile.client
├── Dockerfile.psql
├── docker-compose.yml
├── docker-compose-db.yml
└── template-net-react-postgres.sln

```

## Prerequisites

- Docker and Docker Compose

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone --no-checkout https://github.com/artemkdr/template-net-react-postgres   
   ```
2. **Configure environment variables:**
    * Create a `.env` file in the root directory to customize the following:
        * `APP_PORT` (for the frontend, defaults to 80)
        * `DB_CONNECTION_STRING` (for the backend: `Host=localhost;Port=5432;Database=somedatabase;Username=postgres;Password=postgres`)

3. **Build and run the services:**
    ```
    docker-compose up -d --build
    ```
    or for dev (with database image only)
    ```
    docker-compose -f docker-compose-db.yml up -d --build
    cd client    
    npm run start
    cd ..
    cd API
    dotnet run
    ```

## Accessing the Application
* **Frontend:** Access the React app in your browser at `http://localhost:{APP_PORT}` (replace `{APP_PORT}` with the actual port, default is 80).
* **Backend:** The .NET API will be running at `http://localhost:{APP_PORT}/api` or `http://localhost:5000` if running as a separate image.
* **Database:** The PostgreSQL database will be accessible on port 5442.

## Notes
* The [nginx.conf](nginx/nginx.conf) file configures Nginx to serve the React app and proxy API requests to the backend.
* The [init.sql](psqlinit/init.sql) script initializes the PostgreSQL database with the name `somedatabase`. Find/replace it over the project if you want to use another one (`init.sql`, `appsettings.*.json`, `.env`).
* The Dockerfiles use multi-stage builds for optimized image size