import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
    ...compat.extends('next/typescript', 'plugin:prettier/recommended'),
    ...compat.plugins('prettier'),
    {
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                tsconfigRootDir: __dirname,
            },
        },
    },
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'prettier/prettier': 'warn',
        },
    },
    {
        ignores: [
            '**/.temp',
            '**/.*',
            '**/.git',
            '**/.hg',
            '**/.pnp.*',
            '**/.svn',
            '**/tsconfig.tsbuildinfo',
            '**/README.md',
            '**/payload-types.ts',
            '**/dist/',
            '**/.yarn/',
            '**/build/',
            '**/node_modules/',
            '**/temp/',
        ],
    },
];
