import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextTs from 'eslint-config-next/typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = defineConfig([
    ...nextTs,
    eslintPluginPrettierRecommended,
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
            'prettier/prettier': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
    globalIgnores([
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
        '.next/**',
        'out/**',
        'next-env.d.ts',
    ]),
]);

export default eslintConfig;
