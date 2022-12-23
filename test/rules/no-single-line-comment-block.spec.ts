import { TSESLint } from '@typescript-eslint/utils';

import rule from '../../src/rules/no-single-line-comment-block';

const ruleTester = new TSESLint.RuleTester();

const defaultOptions = rule.defaultOptions[0];

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
      code: '/*\n* \n*/',
      errors: [
        {
          column: 1,
          endColumn: 3,
          line: 1,
          endLine: 3,
          messageId: 'useSingleLineNotation',
        },
      ],
      output: '//',
    },
    {
      code: '/*\n*/',
      errors: [
        {
          column: 1,
          endColumn: 3,
          line: 1,
          endLine: 2,
          messageId: 'useSingleLineNotation',
        },
      ],
      output: '//',
    },
    {
      code: '/**\n*/',
      errors: [
        {
          column: 1,
          endColumn: 3,
          line: 1,
          endLine: 2,
          messageId: 'useMultiLineBlock',
        },
      ],
      output: '/**\n *\n */',
    },
    {
      code: '/*\n\n *\n* Only one line in this block\n * \n \n */',
      errors: [
        {
          column: 1,
          endColumn: 4,
          line: 1,
          endLine: 7,
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
      code: '/* Two lines\n * in this one line block \n*/',
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
      code: '/* Two lines\n *\n * in this one line block \n*/',
      errors: [
        {
          column: 1,
          endColumn: 3,
          line: 1,
          endLine: 4,
          messageId: 'useMultiLineBlock',
        },
      ],
      output: '/*\n * Two lines\n *\n * in this one line block\n */',
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
      code: '/** \n* Only one line in this JSDoc (single line) **/',
      errors: [
        {
          column: 1,
          endColumn: 48,
          line: 1,
          endLine: 2,
          messageId: 'useMultiLineBlock',
        },
      ],
      output: '/**\n * Only one line in this JSDoc (single line)\n */',
    },
    {
      code: '/** \n*Only one line in this JSDoc (single line) **/',
      errors: [
        {
          column: 1,
          endColumn: 47,
          line: 1,
          endLine: 2,
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
      options: [{ ...defaultOptions, ignore: ['cspell'], ignorePatterns: ['(?:RegExp)(?: |)$'] }],
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
    {
      code: 'console.log(1);/* Cannot auto fix inline one line comment */;console.log(2);',
      errors: [
        {
          column: 16,
          endColumn: 61,
          line: 1,
          endLine: 1,
          messageId: 'useSingleLineNotation',
        },
      ],
      output: null,
    },
    {
      code: '{/* Cannot auto fix inline one line empty braces comment */ }',
      options: [{ ...defaultOptions, allowInEmptyBraces: false }],
      errors: [
        {
          column: 2,
          endColumn: 60,
          line: 1,
          endLine: 1,
          messageId: 'useSingleLineNotation',
        },
      ],
      output: null,
    },
    {
      code: '{/* Can auto fix inline one line comment */\r\n}',
      errors: [
        {
          column: 2,
          endColumn: 44,
          line: 1,
          endLine: 1,
          messageId: 'useSingleLineNotation',
        },
      ],
      output: '{// Can auto fix inline one line comment\r\n}',
    },
    {
      code: '{/* Can auto fix\n inline multi line comment */}',
      options: [{ ...defaultOptions, allowInEmptyBraces: false }],
      errors: [
        {
          column: 2,
          endColumn: 30,
          line: 1,
          endLine: 2,
          messageId: 'useMultiLineBlock',
        },
      ],
      output: '{/*\n  * Can auto fix\n  * inline multi line comment\n  */}',
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
    '{ /* Only one line comment in braces */}',
    {
      code: '/** allow js doc */',
      options: [{ ...defaultOptions, allowJSDoc: true }],
    },
    {
      code: '/* cspell:ignore this */',
      options: [{ ...defaultOptions, allowJSDoc: true, ignore: ['cspell'] }],
    },
    {
      code: '/* custom RegExp */',
      options: [{ ...defaultOptions, ignorePatterns: ['(?:RegExp)(?: |)$'] }],
    },
  ],
});
