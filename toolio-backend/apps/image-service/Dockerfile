FROM oven/bun:1

WORKDIR /app

# Copy root config
COPY package.json bun.lockb ./

# Copy packages
COPY packages ./packages

# Copy app
COPY apps/image-service ./apps/image-service

# Install dependencies
RUN bun install

# Install System Tools
RUN apt-get update && apt-get install -y imagemagick ghostscript ffmpeg

WORKDIR /app/apps/image-service

CMD ["bun", "src/index.ts"]
