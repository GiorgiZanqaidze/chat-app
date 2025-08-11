# syntax=docker/dockerfile:1

FROM node:18-alpine AS builder
WORKDIR /workspace

# Install dependencies first (better layer caching)
COPY package*.json ./
COPY nx.json tsconfig.base.json jest.preset.js jest.config.ts ./
COPY apps ./apps
COPY libs ./libs

RUN npm ci

# Build the NestJS app using Nx (production config)
RUN npx nx build chat-app --configuration=production


FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies for runtime
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled backend
COPY --from=builder /workspace/dist/apps/chat-app ./dist/apps/chat-app

EXPOSE 3000

CMD ["node", "dist/apps/chat-app/main.js"]


