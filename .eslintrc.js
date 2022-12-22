const path = require('path');

const importResolverExtensions = [
  '.js',
  '.jsx',
  '.jx',
  '.ts',
  '.tsx',
  '.tx',
];

// http://eslint.org/docs/user-guide/configuring
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  plugins: [
    'import',
    'json',
    'unicorn',
    'unused-imports',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', path.resolve(__dirname, './')],
        ],
        extensions: importResolverExtensions,
      },
      node: {
        extensions: importResolverExtensions,
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.tx'],
    },
  },
  noInlineConfig: true,
  overrides: [
    /*
     * ----------------------
     *  json files
     * ----------------------
     */
    {
      files: ['.json', '.*.json'],
      extends: ['lvmcn/json'],
    },
    /*
     * ----------------------
     *  building tools files
     * ----------------------
     */
    {
      files: ['*.js', '.*.js'],
      excludedFiles: ['src/**'],
      extends: ['lvmcn/javascript/node'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'node/no-extraneous-require': 'off',
        'unicorn/filename-case': 'off',
      },
    },
    {
      files: ['*.ts', '.*.ts', '*.tsx', '.*.tsx'],
      excludedFiles: ['src/**'],
      extends: ['lvmcn/typescript/node'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
          modules: true,
          jsx: true,
          legacyDecorators: true,
        },
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    /*
     * ----------------------
     *  project source files
     * ----------------------
     */
    {
      files: ['src/**/*.js', 'src/**/*.jsx'],
      extends: ['lvmcn/javascript/node'],
    },
    {
      files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.tx'],
      extends: ['lvmcn/typescript/node'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
          modules: true,
          jsx: true,
          legacyDecorators: true,
        },
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    /*
     * ------------
     *  test files
     * ------------
     */
    {
      files: ['test/**.ts'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-magic-numbers': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        'etc/no-deprecated': 'off',
        'node/global-require': 'off',
        'node/no-deprecated-api': 'off',
        'node/no-missing-require': 'off',
        'unicorn/no-array-reduce': 'off',
        'unicorn/no-unsafe-regex': 'off',
        'unicorn/filename-case': 'off',
      },
    },
    /*
     * -------------
     *  rules files
     * -------------
     */
    {
      files: ['src/rules/**'],
      rules: {
        'unicorn/no-array-callback-reference': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/no-array-for-each': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'sort-keys': 0,
      },
    },
    /*
     * ------------
     *  index file
     * ------------
     */
    {
      files: ['src/index.ts', 'src/utils.ts'],
      rules: {
        'node/global-require': 'off',
        'import/no-dynamic-require': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        'unicorn/no-array-reduce': 'off',
      },
    },
  ],
};
