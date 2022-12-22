import { AST_TOKEN_TYPES, TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils';

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

  create(context, [options]: readonly {
    allowJSDoc: boolean;
    ignore: string[];
    ignorePatterns: string[];
  }[]) {
    const sourceCode = context.getSourceCode();
    const ignoreRegex = options.ignorePatterns.map(pattern => new RegExp(pattern, 'gmu'));

    const specialCasesRegExp = new RegExp(`^( |)(${[
      'eslint-disable',
      'eslint-enable',
      'eslint-env',
      'eslint',
      'global',
      'c8',
      'istanbul',
      ...options.ignore,
    ].join('|')})`, 'gmu');

    /**
     * Checks for eslint specific in file configuration comments.
     * It also checks for custom cases passed from `ignore` and `ignorePatterns`
     * options.
     * @param text comment text
     * @returns contains special cases
     */
    const hasSpecialCases = (text: string): boolean => {
      specialCasesRegExp.lastIndex = 0;
      if (specialCasesRegExp.test(text)) {
        return true;
      }
      for (const customRegex of ignoreRegex) {
        if (customRegex.test(text)) {
          return true;
        }
      }
      return false;
    };

    const getIndentString = (comment: TSESTree.Comment) =>
      ' '.repeat(sourceCode.text.slice(comment.range[0] - comment.loc.start.column, comment.range[0]).length);

    const isLineEndAfterComment = (comment: TSESTree.Comment) => {
      const nextCharLoc = comment.range[1];
      const nextChar = sourceCode.text.slice(nextCharLoc, nextCharLoc + 1);
      if (nextChar === '\n' || nextChar === '') {
        return true;
      }
      if (nextChar === '\r') {
        return sourceCode.text.slice(nextCharLoc + 1, nextCharLoc + 2) === '\n';
      }
      return false;
    };

    const EMPTY_COMMENT_LINE = new Set(['', '*']);
    const checkers: Record<'NORMAL' | 'JSDOC', (comment: TSESTree.Comment) => void> = {
      JSDOC: (comment) => {
        if (options.allowJSDoc) {
          return;
        }

        let commentText = comment.value.slice(1);
        if (commentText.endsWith('*')) {
          commentText = commentText.slice(0, Math.max(0, commentText.length - 1));
        }
        const commentLines = commentText.split('\n');
        if (commentLines.length >= 3 || hasSpecialCases(commentText)) {
          return;
        }

        while (commentLines.length > 1 && EMPTY_COMMENT_LINE.has(commentLines[commentLines.length - 1].trim())) {
          commentLines.pop();
        }
        while (commentLines.length > 1 && EMPTY_COMMENT_LINE.has(commentLines[0].trim())) {
          commentLines.shift();
        }

        context.report({
          fix: (fixer) => {
            const indent = getIndentString(comment);
            return fixer.replaceTextRange(
              comment.range,
              [
                '/**',
                ...commentLines
                  .map((line) => {
                    line = line.trim();
                    if (line.startsWith('* ')) {
                      line = line.slice(2);
                    } else if (line.startsWith('*')) {
                      line = line.slice(1);
                    }
                    return line ? `${indent} * ${line}` : `${indent} *`;
                  }),
                `${indent} */`,
              ].join('\n'),
            );
          },
          loc: comment.loc,
          messageId: 'useMultiLineBlock',
        });
      },

      NORMAL: (comment) => {
        const commentText = comment.value;
        const commentLines = commentText.split('\n');
        const multiLineStyle = commentLines[0].trim() === '';

        while (commentLines.length > 1 && EMPTY_COMMENT_LINE.has(commentLines[commentLines.length - 1].trim())) {
          commentLines.pop();
        }
        while (commentLines.length > 1 && EMPTY_COMMENT_LINE.has(commentLines[0].trim())) {
          commentLines.shift();
        }

        if ((multiLineStyle && commentLines.length > 1) || hasSpecialCases(commentText)) {
          return;
        }

        if (commentLines.length === 1) {
          context.report({
            fix: (fixer) => {
              if (!isLineEndAfterComment(comment)) {
                return null;
              }
              let line = commentLines[0].trim();
              if (line.startsWith('*')) {
                line = line.slice(1).trim();
              }
              return fixer.replaceTextRange(
                comment.range,
                line ? `// ${line}` : '//',
              );
            },
            loc: comment.loc,
            messageId: 'useSingleLineNotation',
          });
        } else {
          context.report({
            fix: (fixer) => {
              const indent = getIndentString(comment);
              return fixer.replaceTextRange(
                comment.range,
                [
                  '/*',
                  ...commentLines
                    .map((line) => {
                      line = line.trim();
                      if (line.startsWith('* ')) {
                        line = line.slice(2);
                      } else if (line.startsWith('*')) {
                        line = line.slice(1);
                      }
                      return line ? `${indent} * ${line}` : `${indent} *`;
                    }),
                  `${indent} */`,
                ].join('\n'),
              );
            },
            loc: comment.loc,
            messageId: 'useMultiLineBlock',
          });
        }
      },
    };

    const checkComment = (comment: TSESTree.Comment): void =>
      checkers[comment.value.startsWith('*') ? 'JSDOC' : 'NORMAL'](comment);

    return {
      Program(): void {
        sourceCode.getAllComments()
          .filter(comment => comment.type === AST_TOKEN_TYPES.Block)
          .forEach(checkComment);
      },
    };
  },
});
