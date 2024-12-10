# syntax = docker/dockerfile:1

# Builder stage for pruning
FROM node:20.18.0-slim as pruner
WORKDIR /app

# Install turbo for pruning
RUN npm install -g turbo

# Copy repo files needed for pruning
COPY . .

# Prune the workspace to only include server and its dependencies
RUN turbo prune server --docker

# Builder stage
FROM node:20.18.0-slim as builder
WORKDIR /app

# Install packages needed to build
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# Install pnpm
RUN npm install -g pnpm

# First copy only the pruned workspace files needed to install dependencies
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code from pruned workspace
COPY --from=pruner /app/out/full/ .

# Generate Prisma Client and build
RUN pnpm run generate
RUN pnpm run build

# Set production environment
ENV NODE_ENV="production"

# Expose the port the app runs on
EXPOSE 3100

# Start the server
CMD ["pnpm", "run", "--filter=server", "start"]
