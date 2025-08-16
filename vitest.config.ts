import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/index.ts',
        'src/kysely.interfaces.ts',
        'src/decorators/index.ts',
        'src/factories/index.ts',
      ],
      reportsDirectory: './coverage',
    },
  },
})