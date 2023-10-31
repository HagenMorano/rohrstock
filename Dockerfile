FROM oven/bun:latest

COPY bun.lockb ./
COPY package.json ./
COPY index.tsx ./index.tsx

RUN bun install
