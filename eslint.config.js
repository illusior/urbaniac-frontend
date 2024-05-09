// @ts-check

import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';

export default [
  stylistic.configs.customize({
    quotes: 'single',
    semi: true,
  }),
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
      ignores: [
        'dist/',
      ],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaFeatures: { modules: true },
          ecmaVersion: 'latest',
          project: './tsconfig.json',
        },
      },
      plugins: {
        '@typescript-eslint': ts,
        ts,
      },
      rules: {
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn', {
            argsIgnorePattern: '_',
            varsIgnorePattern: '_',
          },
        ],
        'linebreak-style': ['warn', 'unix'],
        'object-curly-newline': [
          'warn', {
            minProperties: 2,
            multiline: true,
          },
        ],
        'object-curly-spacing': ['warn', 'always'],
        'object-property-newline': 'warn',
        'sort-imports': [
          'warn', {
            allowSeparatedGroups: false,
            ignoreCase: false,
            ignoreDeclarationSort: false,
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          },
        ],
        'sort-keys': [
          'warn',
          'asc', {
            caseSensitive: true,
            minKeys: 2,
            natural: false,
          },
        ],
      },
    },
  ),
];
