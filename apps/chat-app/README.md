### Chat App — Service Documentation

This is a NestJS backend application that lives in an Nx monorepo (`apps/chat-app`). It uses MongoDB, Redis, and RabbitMQ.

## Requirements
- Node.js 18+
- npm 9+
- Nx 17 (you can run via `npx nx ...`)

## Environment variables
Copy `.env-sample` to `.env` and adjust values:

- `NODE_ENV` — `development` | `production`
- `PORT` — application port (default: 3000)
- `MONGODB_URI` — e.g. `mongodb://admin:password@localhost:27017/chat-app?authSource=admin`
- `REDIS_URI` — e.g. `redis://localhost:6379`
- `RABBITMQ_URI` — e.g. `amqp://admin:password@localhost:5672`
- `RABBITMQ_QUEUE` — e.g. `chat_messages`
- `JWT_SECRET`, `JWT_EXPIRES_IN`

## Installation
```bash
npm ci
```

## Run (Nx Targets)
- Development serve:
  ```bash
  npx nx serve chat-app --configuration=development
  ```
- Production serve:
  ```bash
  npx nx serve chat-app --configuration=production
  ```
- Debug serve (Node inspector 9229):
  ```bash
  npx nx serve chat-app --configuration=debug
  ```
- Build (dev/prod):
  ```bash
  npx nx build chat-app --configuration=development
  npx nx build chat-app --configuration=production
  ```
- Test:
  ```bash
  npx nx test chat-app
  npx nx test chat-app --configuration=ci
  ```
- Lint:
  ```bash
  npx nx lint chat-app
  ```

## VS Code Tasks
The project includes `/.vscode/tasks.json`. Available tasks:
- Build Chat App (Dev)
- Build Chat App (Prod)
- Serve Chat App (Dev)
- Serve Chat App (Prod)
- Serve Chat App (Debug)
- Lint Chat App
- Test Chat App
- Test Chat App (CI)

Run Task → select the desired task.

## Docker
### Docker Compose (recommended locally)
```bash
docker compose up -d
```
This will start:
- backend (port `3000`)
- mongodb (port `27017`)
- redis (port `6379`)
- rabbitmq + management UI (ports `5672`, `15672`)

### Single local image
```bash
docker build -t chat-app-backend -f apps/chat-app/Dockerfile .
docker run --rm -p 3000:3000 \
  --env-file apps/chat-app/.env \
  chat-app-backend
```

## Architecture and configs
- Entry point: `apps/chat-app/src/main.ts` → after build: `dist/apps/chat-app/main.js`
- Configs: `apps/chat-app/src/config/*` (MongoDB/Redis/RabbitMQ modules, app config)

## Troubleshooting
- Port already in use? Change `PORT` in `.env` or stop conflicting processes.
- Mongo/Redis/RabbitMQ unavailable? Check `docker compose logs` and URIs in `.env`.


