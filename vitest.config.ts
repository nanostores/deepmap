import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['deep-map/**/*.test.ts'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['deep-map/**/*.ts'],
      exclude: [
        'deep-map/**/*.test.ts',
        'deep-map/**/*.d.ts',
        'deep-map/errors.ts'
      ],
    },
  },
})
