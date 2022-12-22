import { ESLintUtils } from '@typescript-eslint/utils';
import { parse as parsePath } from 'path';

/**
 * This is not an import statement because it will make TSC copy the
 * package.json to the dist folder.
 */
const { version } = require('../package.json');

if (typeof version !== 'string') {
  throw new TypeError('Version field in package.json is not a string.');
}

const REPO_URL = 'https://github.com/tinymins/eslint-plugin-lvmcn';

export const createRule = ESLintUtils.RuleCreator((name: string): string => {
  const ruleName = parsePath(name).name;

  return `${REPO_URL}/blob/v${version}/docs/rules/${ruleName}.md`;
});
