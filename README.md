# Leftovers Tracker

[![CI](https://github.com/nickperkins/leftovers-tracker/actions/workflows/ci-client.yml/badge.svg)](https://github.com/nickperkins/leftovers-tracker/actions/workflows/ci.yml)
[![codecov-client](https://codecov.io/gh/nickperkins/leftovers-tracker/branch/main/graph/badge.svg?flag=client)](https://codecov.io/gh/nickperkins/leftovers-tracker)
[![codecov-server](https://codecov.io/gh/nickperkins/leftovers-tracker/branch/main/graph/badge.svg?flag=server)](https://codecov.io/gh/nickperkins/leftovers-tracker)

A web application to track leftover meals in your freezer or fridge using GraphQL and React.

## Features

- Track leftover meals in both the freezer and fridge
- Add details like expiration dates, portions, ingredients, and tags
- Visual indicators for items that are about to expire
- Search functionality to find specific leftovers
- Mark items as consumed when used
- Responsive design that works on mobile and desktop

## Development Setup

This project uses VS Code with devcontainers for a consistent development environment.

### Prerequisites

- [VS Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [VS Code Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Getting Started

1. Clone this repository
2. Open the project in VS Code
3. When prompted, click "Reopen in Container" (or use the Command Palette: "Dev Containers: Reopen in Container")
4. Wait for the container to build and initialize
5. Set up environment variables:
   - Copy example files: `cp client/.env.example client/.env && cp server/.env.example server/.env`
   - Modify the `.env` files if needed for your development setup
6. Run the development server using one of these methods:
   - From the Command Palette: "Tasks: Run Task" > "Start Full Stack (Dev)"
   - From the terminal: `npm run dev`

The client will be available at http://localhost:3000 and the GraphQL server at http://localhost:4000/graphql.

## Project Structure

- `/client`: React frontend built with Vite and TypeScript
- `/server`: GraphQL API backend built with Node.js, Express, and SQLite
- `/.devcontainer`: Development container configuration
- `/.vscode`: VS Code settings and tasks

## Available Scripts

In the project root directory, you can run:

- `npm run dev`: Run both client and server in development mode
- `npm run dev:client`: Run only the client
- `npm run dev:server`: Run only the server
- `npm run build`: Build both client and server for production

## Database

The application uses SQLite for data storage. The database file is stored at `database.sqlite` in the project root.

## GraphQL API

The GraphQL API is available at http://localhost:4000/graphql when the server is running. You can use the Apollo Playground at this URL to explore the API.

## Deployment

### Environment Configuration

Both the client and server use environment variables for configuration. Example files are provided in their respective directories:
- Client: `/client/.env.example`
- Server: `/server/.env.example`

All `.env` files are excluded from git to protect sensitive information. Only the example files are included in the repository.

#### Server Configuration

1. Copy the example file: `cp server/.env.example server/.env`
2. Edit the values in `server/.env` based on your deployment needs:
   - `PORT`: The port number the server will listen on (default: 4000)
   - `NODE_ENV`: Set to "production" for production deployments
   - `DB_PATH`: Path to your SQLite database file
   - `CORS_ORIGIN`: Allowed origins to access your API (use comma-separated values for multiple origins)
   - `GRAPHQL_PATH`: Path for the GraphQL endpoint (default: /graphql)
   - `LOG_LEVEL`: Logging level (debug, info, warn, error)

#### Client Configuration

1. For development, copy the example file: `cp client/.env.example client/.env`
2. Edit the values based on your deployment needs:
   - `VITE_API_URL`: URL of your API server (in production, leave empty to use same-origin)
   - `VITE_GRAPHQL_PATH`: Should match the server's GRAPHQL_PATH

### Build for Production

```bash
npm run build
```

This will:
1. Build the server code using TypeScript compiler
2. Build the client code using Vite

### Production Deployment

#### Standalone Server

1. Deploy the built files to your server
2. Set up environment variables on your production server
3. Run the server using:
   ```bash
   npm start
   ```

#### Docker Deployment

The project includes Docker configuration for containerized deployment with Nginx:

1. **Using Docker Compose** (recommended):

   ```bash
   # Build and start the application
   docker-compose up -d

   # View logs
   docker-compose logs -f

   # Stop the application
   docker-compose down
   ```

The Docker setup includes:
- Multi-container architecture with separate services:
  - API server (Node.js)
  - Client frontend (Nginx)
- Nginx reverse proxy to serve static files and proxy API requests
- Volume mounting for persistent database storage
- Health checks for the API service
- Proper container networking

Access the application at http://localhost after deployment.

### Manual Deployment with Nginx

If you're deploying manually with Nginx, here's a sample configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve the static frontend files
    location / {
        root /path/to/client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to the backend server
    location /graphql {
        proxy_pass http://localhost:4000/graphql;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Planning Archive

- The full project planning folder has been archived as `.planning/archives/final-20250514.zip`.
- This archive contains all research, planning, and documentation for the refactor project.

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). This means:

### What you can do:
- Use the software for commercial purposes
- Modify the software and create derivative works
- Distribute copies of the software
- Place warranty on the software you distribute

### What you must do:
- Include the original source code when you distribute the software
- Include a copy of the GPL v3.0 license
- Indicate significant changes made to the software
- Make any modifications to the source code available under the GPL v3.0 license

### What you cannot do:
- Sublicense the software under a different license
- Hold the authors liable for damages

The full license text is available in the [LICENSE.txt](LICENSE.txt) file in this repository.

This is copyleft software: any derivative work must also be distributed under the GPL v3.0 license.