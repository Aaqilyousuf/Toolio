FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb ./
COPY packages ./packages
COPY apps/video-service ./apps/video-service

RUN bun install
RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app/apps/video-service

CMD ["bun", "src/index.ts"]
