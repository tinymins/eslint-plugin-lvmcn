import { readdirSync } from 'fs';
import { join, parse } from 'path';

const PREFIX = 'lvmcn';
const rulesDirectory = join(__dirname, 'rules');
const { rules, allRules } = readdirSync(rulesDirectory).reduce(
  (
    parsed: {
      allRules: Record<string, string>;
      rules: Record<string, unknown>;
    },
    rule: string,
  ): {
    allRules: Record<string, string>;
    rules: Record<string, unknown>;
  } => {
    const { name, ext } = parse(rule);

    if (ext !== '.ts' && ext !== '.js') {
      return parsed;
    }

    return {
      ...parsed,
      allRules: {
        ...parsed.allRules,
        [`${PREFIX}/${name}`]: 'error',
      },
      rules: {
        ...parsed.rules,
        [name]: require(join(rulesDirectory, name)).default,
      },
    };
  },
  {
    allRules: {},
    rules: {},
  },
);

export = {
  configs: {
    all: {
      parser: '@typescript-eslint/parser',
      parserOptions: { sourceType: 'module' },
      plugins: [PREFIX],
      rules: allRules,
    },
    recommended: {
      parser: '@typescript-eslint/parser',
      parserOptions: { sourceType: 'module' },
      plugins: [PREFIX],
      rules: {
        [`${PREFIX}/no-single-line-comment-block`]: 'warn',
      },
    },
  },
  rules,
};
