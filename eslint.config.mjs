import js from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

const ignores = [
  'archive/**',
  'docs/**',
  'dist/**',
  'node_modules/**',
  'playwright-report/**',
  'test-results/**',
]

export default [
  {
    ignores,
  },
  {
    files: ['src/**/*.{js,jsx}', 'e2e/**/*.{js,jsx}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      ...jsxA11y.configs.recommended.rules,
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  ...tseslint.config(
    {
      files: ['src/**/*.{ts,tsx}', 'e2e/**/*.{ts,tsx}'],
      extends: [...tseslint.configs.recommendedTypeChecked],
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.browser,
          ...globals.node,
        },
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
      plugins: {
        'react-hooks': reactHooks,
        'jsx-a11y': jsxA11y,
      },
      rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        ...jsxA11y.configs.recommended.rules,
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        'no-console': ['warn', { allow: ['warn', 'error'] }],
      },
    },
    {
      files: ['vite.config.ts', 'playwright.config.ts'],
      extends: [...tseslint.configs.recommended],
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.node,
        },
      },
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
  ),
  eslintConfigPrettier,
]
