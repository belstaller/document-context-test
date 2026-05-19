FROM node:20-alpine AS base
WORKDIR /app

# ── Dependencies stage ────────────────────────────────────────────────────────
FROM base AS deps
COPY web/package.json web/package-lock.json* ./
RUN npm ci

# ── Build stage ───────────────────────────────────────────────────────────────
FROM deps AS builder
COPY web/ .
ARG NEXT_PUBLIC_API_URL=http://api:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# ── Production stage ──────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
