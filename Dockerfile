FROM oven/bun:latest

COPY bun.lockb ./
COPY package.json ./
COPY server/index.ts ./

RUN bun install
