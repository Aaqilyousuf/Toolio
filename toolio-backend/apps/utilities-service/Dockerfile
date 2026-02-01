FROM oven/bun:latest

WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .

EXPOSE 4005

CMD ["bun", "run", "src/index.ts"]
