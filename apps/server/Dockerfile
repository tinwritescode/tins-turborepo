# syntax = docker/dockerfile:1

# Builder stage
FROM node:20.18.0-slim as builder

WORKDIR /app

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# Install pnpm and turbo
RUN npm install -g pnpm turbo

# Copy workspace configuration
COPY ../../pnpm-workspace.yaml ./
COPY ../../pnpm-lock.yaml ./
COPY ../../package.json ./
COPY ../../turbo.json ./

# Copy app source
COPY ../../apps/server ./apps/server
COPY ../../packages/database ./packages/database

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
RUN pnpm run generate

# Build application using turbo
RUN pnpm turbo run build --filter=server...

# Production stage
FROM node:20.18.0-slim

WORKDIR /app

# Install production dependencies only
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Set production environment
ENV NODE_ENV="production"

# Expose the port the app runs on
EXPOSE 3100

# Start the server
CMD [ "node", "dist/main.js" ]
