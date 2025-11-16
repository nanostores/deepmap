import js from '@eslint/js';
import tseslint from 'typescript-eslint';
/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { ignores: ['**/errors.ts', 'dist/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      'camelcase': 'off',
      'consistent-return': 'off',
      'symbol-description': 'off'
    }
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/unbound-method': 'off'
    }
  }
]
