FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile --prod

FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm build

FROM base AS runner
RUN addgroup -S yisuan && adduser -S yisuan -G yisuan
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
USER yisuan
EXPOSE 3001
CMD ["node", "dist/main"]
