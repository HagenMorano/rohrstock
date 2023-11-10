FROM oven/bun:latest

COPY bun.lockb ./
COPY package.json ./
COPY index.ts ./index.ts

RUN bun install
