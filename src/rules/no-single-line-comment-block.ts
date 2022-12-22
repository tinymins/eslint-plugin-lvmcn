import { AST_TOKEN_TYPES, TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils';

type Options = readonly {
  allowJSDoc: boolean;
  ignore: string[];
  ignorePatterns: string[];
}[];

/**
 * Checks for eslint specific in file configuration comments.
 * It also checks for custom cases passed from `ignore` and `ignorePatterns`
 * options.
 * @param lines code lines
 * @param ignore ignore
 * @param ignoreRegex ignore regex
 * @returns contains special cases
 */
const hasSpecialCases = (
  lines: string[],
  ignore: string[],
  ignoreRegex: RegExp[],
): boolean => {
  const specialCases = [
    'eslint-disable',
    'eslint-enable',
    'eslint-env',
    'eslint',
    'global',
    'c8',
    'istanbul',
  ];

  const specialCasesRegExp = new RegExp(
    `^( |)(${[...specialCases, ...ignore].join('|')})`,
    'gmu',
  );

  for (const element of lines) {
    if (specialCasesRegExp.test(element) === true) {
      return true;
    }

    for (const customRegex of ignoreRegex) {
      if (customRegex.test(element) === true) {
        return true;
      }
    }
  }

  return false;
};

const standardizeMultiLineComments = (comments: string[]) => {
  const numberOfLines = comments.length - 1;
  return comments.map((s, i) => {
    s = s.replace(/^\s*\*?/u, '').trim();
    if (i === numberOfLines) {
      s = s.replace(/\*$/u, '').trim();
    }
    return s;
  });
};

export default createRule({
  name: __filename,
  meta: {
    docs: {
      description: 'Single line comments should not be in a block comment.',
      recommended: false,
    },
    fixable: 'code',
    messages: {
      useMultiLineBlock: 'Use multi-line block instead.',
      useSingleLineNotation: 'Use line comment notation instead.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowJSDoc: {
            type: 'boolean',
          },
          ignore: {
            additionalItems: false,
            items: { type: 'string' },
            type: 'array',
          },
          ignorePatterns: {
            additionalItems: false,
            items: { type: 'string' },
            type: 'array',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  defaultOptions: [{ allowJSDoc: false, ignore: [], ignorePatterns: [] }],

  create(
    context,
    [{ allowJSDoc, ignore, ignorePatterns }]: Options,
  ): {
      Program: () => void;
    } {
    const sourceCode = context.getSourceCode();
    const ignoreRegex = ignorePatterns.map(
      (pattern: string): RegExp => new RegExp(pattern, 'gmu'),
    );

    /**
     * Gets the initial offset (whitespace) from the beginning of a line to a given comment token.
     * @param {Token} comment The token to check.
     * @returns {string} The offset from the beginning of a line to the token.
     */
    const getInitialOffset = (comment: TSESTree.Comment) => sourceCode.text.slice(comment.range[0] - comment.loc.start.column, comment.range[0]);

    const checkComment = (comment: TSESTree.Comment): void => {
      const blockCommentLines = comment.value.split('\n');
      const numberOfLines = blockCommentLines.length;
      const isJSDoc = blockCommentLines[0].startsWith('*');

      if (isJSDoc) {
        if (!allowJSDoc && numberOfLines < 3 && !hasSpecialCases(blockCommentLines, ignore, ignoreRegex)) {
          context.report({
            fix: (fixer) => {
              const indent = getInitialOffset(comment);
              return fixer.replaceTextRange(
                comment.range,
                [
                  '/**',
                  ...standardizeMultiLineComments(blockCommentLines.map(s => s.replace(/^\s*\*?/u, '').trim()))
                    .map(s => s.trim())
                    .filter(s => s)
                    .map(s => `${indent} * ${s}`),
                  ' */',
                ].join('\n'),
              );
            },
            loc: comment.loc,
            messageId: 'useMultiLineBlock',
          });
        }
      } else if (numberOfLines <= 3 && !hasSpecialCases(blockCommentLines, ignore, ignoreRegex)) {
        const usefulCommentLines = blockCommentLines.map(s => s.replace(/^\s*\*?/u, '').trim()).filter(s => s);
        if (usefulCommentLines.length > 1) {
          context.report({
            fix: (fixer) => {
              const indent = getInitialOffset(comment);
              return fixer.replaceTextRange(
                comment.range,
                [
                  '/*',
                  ...standardizeMultiLineComments(blockCommentLines)
                    .map(s => s.trim())
                    .filter(s => s)
                    .map(s => `${indent} * ${s}`),
                  ' */',
                ].join('\n'),
              );
            },
            loc: comment.loc,
            messageId: 'useMultiLineBlock',
          });
        } else {
          context.report({
            fix: fixer => fixer.replaceTextRange(
              comment.range,
              `// ${usefulCommentLines.join('')}`,
            ),
            loc: comment.loc,
            messageId: 'useSingleLineNotation',
          });
        }
      }
    };

    return {
      Program(): void {
        sourceCode.getAllComments()
          .filter(comment => comment.type === AST_TOKEN_TYPES.Block)
          .forEach(checkComment);
      },
    };
  },
});
