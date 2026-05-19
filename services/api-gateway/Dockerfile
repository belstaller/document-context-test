FROM node:20-alpine AS base
WORKDIR /app

# ── Dependencies stage ────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json* ./
COPY services/api-gateway/package.json ./services/api-gateway/
RUN npm ci --workspace=services/api-gateway

# ── Build stage ───────────────────────────────────────────────────────────────
FROM deps AS builder
COPY tsconfig.json ./
COPY src/ ./src/
COPY services/api-gateway/ ./services/api-gateway/
RUN npm run build --workspace=services/api-gateway

# ── Production stage ──────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production

COPY --from=builder /app/services/api-gateway/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4000

CMD ["node", "dist/interfaces/http/main.js"]
