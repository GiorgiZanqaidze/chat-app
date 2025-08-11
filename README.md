# Chat App (Nx Monorepo) — NestJS + Angular + Redis + RabbitMQ + MongoDB + Docker

ეს დოკუმენტაცია გასწავლით როგორ ააწყოთ სრულფასოვანი chat აპლიკაცია ამ არსებულ Nx მონორეპოში. ამჟამად გაქვთ NestJS აპი `apps/chat-app` (backend). ქვემოთ ნახავთ როგორ დავამატოთ Angular frontend, საერთო ლაიბრერები, კონტეინერები (Mongo, Redis, RabbitMQ) და როგორ გავუშვათ ყველაფერი ერთად Docker-ით.

## მონორეპოს მიმდინარე სტრუქტურა (ინიციალური)

```
chat-app/
├─ apps/
│  ├─ chat-app/            # NestJS backend (უკვე არსებობს)
│  └─ chat-app-e2e/        # e2e ტესტები backend-სთვის
├─ libs/                   # საერთო ლაიბრერები (ს boş, შევქმნით ქვემოთ)
├─ nx.json
├─ package.json
├─ tsconfig.base.json
└─ README.md
```

ამ სტრუქტურაში backend აპის Nx სახელი არის `chat-app`. შესაბამისად, სერვისის გაშვებისა და ბილდის ბრძანებები იქნება `nx serve chat-app` და `nx build chat-app`.

## წინაპირობები

- Node.js 18+
- Nx CLI (ნებაყოფლობითი, მაგრამ სასარგებლოა): `npm i -g nx`
- Docker Desktop (შემდეგ `docker-compose`)

## სწრაფი დასტარტი

1) დამოკიდებულებების დაყენება

```bash
npm install
```

2) ინფრასტრუქტურის სერვისები Docker-ით (MongoDB, Redis, RabbitMQ)

ჯერ შექმენით `docker-compose.yml` (იხ. ქვემოთ „Docker Compose“ სექცია), შემდეგ გაუშვით:

```bash
docker compose up -d
```

3) Backend-ის გაშვება (უკვე არსებულის)

```bash
nx serve chat-app
```

4) Frontend-ის გენერაცია და გაშვება (ქვემოთ „Angular Frontend-ის დამატება“ სექცია)

```bash
# დამატების შემდეგ
nx serve frontend
```

---

## Backend (NestJS) — გაფართოება Chat ფუნქციონალისთვის

აითვისეთ შემდეგი პაკეტები (Mongo, Config, WebSockets, RabbitMQ, Redis, Validation/Auth):

```bash
npm i @nestjs/mongoose mongoose @nestjs/config \
  @nestjs/websockets @nestjs/platform-socket.io socket.io \
  @nestjs/microservices amqplib ioredis \
  class-validator class-transformer bcryptjs passport @nestjs/passport passport-jwt
```

რისთვის გვჭირდება:
- MongoDB/Mongoose — მომხმარებლები, ჩატები, მესიჯები
- ConfigModule — `.env` ცვლადები
- WebSockets (Socket.io) — რეალურ დროში კომუნიკაცია
- RabbitMQ (Nest Microservices) — მესიჯების ქუინგი და background პროცესები
- Redis (ioredis) — cache/pub-sub
- Validation/Auth — უსაფრთხოება, DTO ვალიდაცია

სასურველი `.env` (workspace root ან `apps/chat-app/.env`):

```env
PORT=3000
NODE_ENV=development

MONGODB_URI=mongodb://admin:password@localhost:27017/chat-app?authSource=admin
REDIS_URI=redis://localhost:6379
RABBITMQ_URI=amqp://admin:password@localhost:5672

JWT_SECRET=super-secret
JWT_EXPIRES_IN=7d
```

საბაზისო გაშვება:

```bash
nx serve chat-app
```

ბილდის შექმნა:

```bash
nx build chat-app
```

ტესტები:

```bash
nx test chat-app
nx e2e chat-app-e2e
```

---

## Angular Frontend-ის დამატება (Nx)

თუ Angular ჯერ არ გაქვთ ჩართული workspace-ში, დაამატეთ Nx Angular plugin:

```bash
npm i -D @nx/angular@17
```

შემდეგ გენერაცია:

```bash
nx g @nx/angular:app frontend --routing --style=scss --strict
```

სასარგებლო frontend პაკეტები (Socket.io client, Angular Material და სხვ.):

```bash
npm i socket.io-client @angular/material @angular/cdk
```

დევ-გაშვება:

```bash
nx serve frontend
```

პროდაქშენ ბილდი:

```bash
nx build frontend --configuration=production
```

Frontend გარემოს ცვლადები (`apps/frontend/src/environments/environment.ts`):

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  wsUrl: 'http://localhost:3000',
};
```

---

## საერთო ლაიბრერების (libs) შექმნა

რეკომენდებული ლაიბრერები, რომლებსაც გამოიყენებთ ორივე მხარეს:

```bash
nx g @nx/js:lib shared-types --directory=libs/shared-types --strict
nx g @nx/js:lib shared-dtos  --directory=libs/shared-dtos  --strict
nx g @nx/js:lib shared-utils --directory=libs/shared-utils --strict
```

მაგალითად, `libs/shared-types` შეიძლება შეიცავდეს ინტერფეისებს `User`, `Chat`, `Message` და ა.შ., რათა ერთსა და იმავე ტიპებს იყენებდეს როგორც backend, ისე frontend.

---

## WebSockets (რეალურ დროში მესიჯები)

- Backend: შექმენით `Gateway` `@nestjs/websockets`-ით (Socket.io), სადაც გექნებათ მოვლენები: `send_message`, `join_chat`, `typing_start/stop` და უპასუხებთ `message_received`, `user_joined`, და სხვ. 
- Frontend: `socket.io-client`-ით დაუკავშირდით `environment.wsUrl`-ზე და მოისმინეთ server-ის მოვლენები.

ეს უზრუნველყოფს სწრაფ რეალურ დროში მესიჯინგს, ხოლო RabbitMQ შეგიძლიათ გამოიყენოთ მძიმე ან ასინქრონული დავალებებისთვის (შეტყობინებების დამუშავება, ნოტიფიკაციები, ისტორიის ინდექსაცია და ა.შ.).

---

## RabbitMQ ინტეგრაცია (Nest Microservices)

- გამოიყენეთ `@nestjs/microservices` და `amqplib`.
- შექმენით `ClientsModule.register()` კონფიგურაციით `transport: Transport.RMQ`.
- გამოიყენეთ queue-ები ( напр. `chat_messages`) background ამოცანებისთვის: მესიჯის შენახვა, განაწილება, სხდომის მოვლენების लॉგირება და სხვ.

---

## Redis გამოყენება

- `ioredis` კლიენტით დაუკავშირდით `REDIS_URI`.
- გამოიყენეთ როგორც cache (მაგ. მომხმარებლის presence/status) ან pub/sub არხები typing-სიგნალებისთვის.

---

## Docker Compose (MongoDB, Redis, RabbitMQ)

შექმენით ფაილი `docker-compose.yml` repo-ის root-ში:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: chat-mongodb
    ports:
      - '27017:27017'
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    networks:
      - chat-network

  redis:
    image: redis:7-alpine
    container_name: chat-redis
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - chat-network

  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: chat-rabbitmq
    ports:
      - '5672:5672'
      - '15672:15672'  # management UI
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: password
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - chat-network

volumes:
  mongodb_data:
  redis_data:
  rabbitmq_data:

networks:
  chat-network:
    driver: bridge
```

გაშვება/გაჩერება:

```bash
docker compose up -d
docker compose down
```

---

## Backend/Frontend Dockerfile-ები (ნებაყოფლობითი)

Backend (`apps/chat-app/Dockerfile`):

```dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx nx build chat-app

EXPOSE 3000
CMD ["node", "dist/apps/chat-app/main.js"]
```

Frontend (`apps/frontend/Dockerfile`) — Angular შექმნის შემდეგ:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nx build frontend --configuration=production

FROM nginx:alpine
COPY --from=builder /app/dist/apps/frontend /usr/share/nginx/html
EXPOSE 80
```

შეიძლება გააკეთოთ ერთიანი `docker-compose` სერვისებიც `backend` და `frontend`-ისთვის, ან გამოიყენოთ ცალ-ცალკე deployment სტრატეგია.

---

## სასარგებლო Nx ბრძანებები

დევ გაშვება:

```bash
nx serve chat-app
nx serve frontend
nx run-many --target=serve --projects=chat-app,frontend
```

ბილდი:

```bash
nx build chat-app
nx build frontend --configuration=production
nx run-many --target=build --projects=chat-app,frontend
```

ტესტები და ლინტინგი:

```bash
nx test chat-app
nx test frontend
nx e2e chat-app-e2e

nx lint chat-app
nx lint frontend
```

დამოკიდებულებების გრაფი:

```bash
nx graph
nx graph --focus=chat-app
nx graph --focus=frontend
```

---

## შემოთავაზებული საბოლოო სტრუქტურა (Angular-ისა და libs-ის დამატების შემდეგ)

```
chat-app/
├─ apps/
│  ├─ chat-app/                 # NestJS backend
│  ├─ chat-app-e2e/             # backend e2e
│  └─ frontend/                 # Angular frontend (ახალი)
├─ libs/
│  ├─ shared-types/
│  ├─ shared-dtos/
│  └─ shared-utils/
├─ docker-compose.yml
├─ nx.json
├─ package.json
└─ README.md
```

---

## უსაფრთხოება და ხარისხი

- DTO ვალიდაცია (`class-validator`, `class-transformer`)
- JWT ავტენტიკაცია (Passport JWT)
- CORS კონფიგურაცია
- ESLint/Prettier ინტეგრაციები

---

## τιპიკური ნაბიჯები ახალი გარემოს ასაწევად

1) `npm install`
2) შექმენით/გაუშვით `docker-compose.yml`: `docker compose up -d`
3) შექმენით Angular app: `npm i -D @nx/angular@17 && nx g @nx/angular:app frontend`
4) შექმენით საერთო libs: `nx g @nx/js:lib shared-types` და სხვ.
5) დაამატეთ backend პაკეტები: `npm i @nestjs/mongoose ...` (ზემოთ ჩამონათვალი)
6) გაუშვით backend/frontend: `nx serve chat-app` და `nx serve frontend`

---

თუ გსურთ, შემდეგ ნაბიჯზე შეგვიძლია ავტომატურად გენერაცია/კონფიგურაციებიც გავუშვათ (Angular app, libs, Docker ფაილები და ა.შ.) Nx ბრძანებებით — მონორეპოს მიდგომის შესაბამისად [[memory:2769125]].


