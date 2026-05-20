# User Service

A small Express microservice for managing users. Data is stored in MongoDB via Mongoose.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- MongoDB running locally, **or** Docker / Docker Compose to run the included database container

## Quick start

```bash
# Install dependencies
npm install

# Start MongoDB (Docker)
npm run db:up
# If that fails, try: docker-compose up -d

# Start the API
npm start
```

Or run database + API in one step:

```bash
npm run dev
```

You should see:

```
Connected to MongoDB
User service running on port 3000
```

## Environment variables

| Variable       | Default                              | Description              |
|----------------|--------------------------------------|--------------------------|
| `PORT`         | `3000`                               | HTTP port for the API    |
| `MONGODB_URI`  | `mongodb://127.0.0.1:27017/users`    | MongoDB connection URI   |

Example:

```bash
PORT=4000 MONGODB_URI=mongodb://127.0.0.1:27017/users npm start
```

## API

Base URL: `http://127.0.0.1:3000`

### Health check

```http
GET /health
```

**200** — database connected  
**503** — server up but database disconnected

```bash
curl http://127.0.0.1:3000/health
```

### List users

```http
GET /users
```

```bash
curl http://127.0.0.1:3000/users
```

### Create user

```http
POST /users
Content-Type: application/json
```

| Field   | Type   | Required | Notes        |
|---------|--------|----------|--------------|
| `name`  | string | yes      |              |
| `email` | string | yes      | must be unique |

```bash
curl -X POST http://127.0.0.1:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}'
```

## Scripts

| Command        | Description                          |
|----------------|--------------------------------------|
| `npm start`    | Start the API (requires MongoDB)     |
| `npm run dev`  | Start MongoDB via Docker, then the API |
| `npm run db:up`   | Start MongoDB container           |
| `npm run db:down` | Stop MongoDB container            |

## Project structure

```
user-service/
├── docker-compose.yml    # MongoDB for local development
├── package.json
└── src/
    ├── index.js              # App entry, routes, DB connection
    ├── controllers/
    │   └── userController.js # Request handlers
    └── models/
        └── userModel.js      # User schema (name, email)
```

## Troubleshooting

### Server exits immediately on `npm start`

MongoDB is not reachable. Start it first:

```bash
npm run db:up
# or
docker-compose up -d
```

Ensure something is listening on port `27017`:

```bash
lsof -i :27017
```

### Requests hang or never reach the server

1. Confirm the process is running and bound to port 3000:

   ```bash
   lsof -i :3000
   ```

2. Use `127.0.0.1` instead of `localhost` if you see IPv6 connection issues.

3. Check the health endpoint:

   ```bash
   curl http://127.0.0.1:3000/health
   ```

### `npm run db:up` fails

- Start your Docker daemon (e.g. Colima: `colima start`, Docker Desktop, etc.).
- If `docker compose` is not installed, use `docker-compose up -d` from the project root.

### Port 3000 already in use

Stop the other process or run on a different port:

```bash
PORT=3001 npm start
```

## Git

Remote:

```text
origin  git@github.com:ChakravarthiDinavahi/user-service.git
```

First-time setup:

```bash
git init
git remote add origin git@github.com:ChakravarthiDinavahi/user-service.git
git add .
git commit -m "Initial commit: user service API"
git branch -M main
git push -u origin main
```

Create the empty repository on GitHub first (same name: `user-service`), then push.

To use SSH instead:

```bash
git remote set-url origin git@github.com:ChakravarthiDinavahi/user-service.git
```

## Tech stack

- [Express](https://expressjs.com/) 5
- [Mongoose](https://mongoosejs.com/) 9
- [MongoDB](https://www.mongodb.com/)
