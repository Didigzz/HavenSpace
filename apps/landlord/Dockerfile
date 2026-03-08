# Landlord Portal Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install Bun for dependency management
RUN npm install -g bun@1.1.0

# Copy package files
COPY package.json bun.lock ./
COPY packages/ui/package.json ./packages/ui/
COPY packages/shared/package.json ./packages/shared/
COPY packages/validation/package.json ./packages/validation/
COPY apps/landlord/package.json ./apps/landlord/

# Install dependencies
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install Bun
RUN npm install -g bun@1.1.0

# Copy dependency installation
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/*/node_modules ./packages/*/node_modules
COPY --from=deps /app/apps/landlord/node_modules ./apps/landlord/node_modules

# Copy source code
COPY . .

# Build the app
RUN bun run build --filter=@bhms/landlord

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built artifacts
COPY --from=builder /app/apps/landlord/.next/standalone ./
COPY --from=builder /app/apps/landlord/.next/static ./.next/static
COPY --from=builder /app/apps/landlord/public ./public

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3005

ENV PORT=3005
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3005', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]