FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN corepack enable && \
    pnpm build && \
    pnpm prune --prod

FROM base AS runner
RUN addgroup -S yisuan && adduser -S yisuan -G yisuan
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER yisuan
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
