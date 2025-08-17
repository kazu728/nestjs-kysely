import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  platform: 'node',
  external: [
    '@nestjs/common',
    '@nestjs/core',
    'kysely',
    'reflect-metadata'
  ]
})