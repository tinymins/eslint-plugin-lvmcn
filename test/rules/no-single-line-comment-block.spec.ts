import { TSESLint } from '@typescript-eslint/utils';

import rule from '../../src/rules/no-single-line-comment-block';

const ruleTester = new TSESLint.RuleTester();

ruleTester.run('no-single-line-comment-block', rule, {
  invalid: [
    {
      code: '/*\n* Only one line in this block\n*/',
      errors: [
        {
          column: 1,
          endColumn: 3,
          line: 1,
          endLine: 3,
          messageId: 'useSingleLineNotation',
        },
      ],
      output: '// Only one line in this block',
    },
    {
      code: '/*\n* Only one line in this block */',
      errors: [
        {
          column: 1,
          endColumn: 33,
          line: 1,
          endLine: 2,
          messageId: 'useSingleLineNotation',
        },
      ],
      output: '// Only one line in this block',
    },
    {
      code: '/*\n Only one line in this block */',
      errors: [
        {
          column: 1,
          endColumn: 32,
          line: 1,
          endLine: 2,
          messageId: 'useSingleLineNotation',
        },
      ],
      output: '// Only one line in this block',
    },
    {
      code: '/* Only one line in this block \n*/',
      errors: [
        {
          column: 1,
          endColumn: 3,
          line: 1,
          endLine: 2,
          messageId: 'useSingleLineNotation',
        },
      ],
      output: '// Only one line in this block',
    },
    {
      code: '/* Two lines\n in this one line block \n*/',
      errors: [
        {
          column: 1,
          endColumn: 3,
          line: 1,
          endLine: 3,
          messageId: 'useMultiLineBlock',
        },
      ],
      output: '/*\n * Two lines\n * in this one line block\n */',
    },
    {
      code: '/* Only one line in this block \n**/',
      errors: [
        {
          column: 1,
          endColumn: 4,
          line: 1,
          endLine: 2,
          messageId: 'useSingleLineNotation',
        },
      ],
      output: '// Only one line in this block',
    },
    {
      code: '/* Only one line in this block (single line) */',
      errors: [
        {
          column: 1,
          endColumn: 48,
          line: 1,
          endLine: 1,
          messageId: 'useSingleLineNotation',
        },
      ],
      output: '// Only one line in this block (single line)',
    },
    {
      code: '/** Only one line in this JSDoc (single line) */',
      errors: [
        {
          column: 1,
          endColumn: 49,
          line: 1,
          endLine: 1,
          messageId: 'useMultiLineBlock',
        },
      ],
      output: '/**\n * Only one line in this JSDoc (single line)\n */',
    },
    {
      code: '/** Only one line in this JSDoc (single line) **/',
      errors: [
        {
          column: 1,
          endColumn: 50,
          line: 1,
          endLine: 1,
          messageId: 'useMultiLineBlock',
        },
      ],
      output: '/**\n * Only one line in this JSDoc (single line)\n */',
    },
    {
      code: '/* cspell:ignore this */',
      errors: [
        {
          column: 1,
          endColumn: 25,
          line: 1,
          endLine: 1,
          messageId: 'useSingleLineNotation',
        },
      ],
      output: '// cspell:ignore this',
    },
    {
      code: '/* should fail as it ends with cspell:ignore this */',
      errors: [
        {
          column: 1,
          endColumn: 53,
          line: 1,
          endLine: 1,
          messageId: 'useSingleLineNotation',
        },
      ],
      options: [{ allowJSDoc: false, ignore: ['cspell'], ignorePatterns: ['(?:RegExp)(?: |)$'] }],
      output: '// should fail as it ends with cspell:ignore this',
    },
    {
      code: '/*\n* Only one line in this block */',
      errors: [
        {
          column: 1,
          endColumn: 33,
          line: 1,
          endLine: 2,
          messageId: 'useSingleLineNotation',
        },
      ],
      output: '// Only one line in this block',
    },
  ],
  valid: [
    '/*\n* Two lines\n* in this block\n*/',
    '/**\n* One line JSDoc block\n*/',
    '/* eslint-disable no-warning-comments */',
    '/* eslint-enable no-warning-comments */',
    '/* eslint-disable-next-line no-warning-comments */',
    '/* eslint-enable-next-line no-warning-comments */',
    '/* global var1, var2 */',
    '/* eslint-env node */',
    '/* c8 ignore next */',
    '/* c8 ignore next 4 */',
    '/* istanbul ignore next */',
    '/* istanbul ignore if */',
    '/* istanbul ignore else */',
    '// Only one line in comment notation',
    {
      code: '/* cspell:ignore this */',
      options: [{ allowJSDoc: true, ignore: ['cspell'], ignorePatterns: [] }],
    },
    {
      code: '/* custom RegExp */',
      options: [{ allowJSDoc: false, ignore: [], ignorePatterns: ['(?:RegExp)(?: |)$'] }],
    },
  ],
});
