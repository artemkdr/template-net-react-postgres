# Dockerized .NET + React App + Postgres + Consul (for discovery)

This example provides a Dockerized setup for a .NET API backend and a React frontend, along with a PostgreSQL database.

This setup also includes a Consul container for service discovery.

The API backend automatically registers itself with Consul when it starts up. Consul Template, installed in the entry point container, then triggers an update to the Nginx configuration based on the registered services.

.NET app has [LoginController](API/Controllers/LoginController.cs) using JWT token for authorization.

React client app has one ['Welcome' public page](client/src//pages/Welcome.tsx) and one ['Users' page](client/src/pages/UsersPage.tsx) that can be accessed for authenticated users only.

Authentication is done via [Login page](client/src/pages/Login.tsx) and [authStore](client/src/stores/authStore.ts).

## Project Structure
```
├── API
│   └── ... (.NET API project)
├── API.Tests
│   └── ... (.NET API tests)
├── client
│   └── ... (React frontend project)
├── nginx
│   └── nginx.conf (Nginx configuration)
│   └── nginx.conf.ctmpl (Consul-template Nginx configuration)
│   └── consul-template.hcl (Consul-template config)
├── psqlinit
│   └── init.sql (PostgreSQL initialization script)
├── Dockerfile.api
├── Dockerfile.client
├── Dockerfile.psql
├── docker-compose.yml
├── docker-compose-consul.yml
├── docker-compose-db.yml
└── template-net-react-postgres.sln

```

## Prerequisites

- Docker and Docker Compose

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/artemkdr/template-net-react-postgres   
   ```
2. **Configure environment variables:**
    * Create a `.env` file in the root directory to customize the following:
        * `APP_PORT` (for the frontend, defaults to 80)
        * `DB_CONNECTION_STRING` (for the backend: `Host=db;Port=5432;Database=somedatabase;Username=postgres;Password=postgres`)

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
If you run it via docker-compose as one service then you can access only **Frontend** with http://localhost and http://localhost/api (http://localhost/api/swagger/index.html).

If you you run as separate parts:
* **Frontend:** Access the React app in your browser at `http://localhost:{APP_PORT}` (replace `{APP_PORT}` with the actual port, default is 80 or 3000 if running with `npm run start`).
* **Backend:** The .NET API will be running at `http://localhost:{APP_PORT}/api` or `http://localhost:5000` if running as a separate image or with `dotnet run`.
* **Database:** The PostgreSQL database will be accessible on port 5442 if you run it with docker-compose-db.yml file.
* **Consul:** Consul server is accessible on http://localhost:8500.

## Notes
* The [nginx.conf.ctmpl](nginx/nginx.conf.ctmpl) file is a Consul Template for Nginx to serve the React app and proxy API requests to the backend.
* The [consul-template.hcl](nginx/consul-template.hcl) is the simplest Consul Template configuration file pointing to nginx configuration template.
* The [nginx.conf](nginx/nginx.conf) file configures Nginx to serve the React app and proxy API requests to the backend.
* The [init.sql](psqlinit/init.sql) script initializes the PostgreSQL database with the name `somedatabase` and fills `users` table with 5 users with hashed passwords (user1/password1, user2/password2...). Find/replace it over the project if you want to use another one (`init.sql`, `appsettings.*.json`, `.env`).
* The Dockerfiles use multi-stage builds for optimized image size
