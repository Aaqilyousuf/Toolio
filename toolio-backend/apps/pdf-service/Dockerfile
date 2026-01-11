FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb ./
COPY packages ./packages
COPY apps/pdf-service ./apps/pdf-service

RUN bun install
RUN apt-get update && apt-get install -y ghostscript

WORKDIR /app/apps/pdf-service

CMD ["bun", "src/index.ts"]
