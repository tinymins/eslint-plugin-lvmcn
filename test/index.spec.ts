/**
 * @test-map-files
 */

import { exists } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

import internalRules = require('../src');

const existsAsync = promisify(exists);
const ruleNames = Object.keys(internalRules.rules);
const numberOfRules = 1;

const allConfigRules = Object.values(internalRules.configs)
  .flatMap(
    (config: {
      plugins: string[];
      rules: { [key: string]: string };
    }): string[] => Object.keys(config.rules),
  );

describe('rules', (): void => {
  it.each(ruleNames)(
    'has a corresponding documentation file for rule: %s',
    async (rule: string): Promise<void> => {
      expect.assertions(1);

      const documentPath = resolve(
        __dirname,
        '../docs/rules',
        `${rule}.md`,
      );
      const isDocumented = await existsAsync(documentPath);

      expect(isDocumented).toStrictEqual(true);
    },
  );

  it('has the correct amount of rules', (): void => {
    expect.assertions(1);

    const { length } = ruleNames;

    expect(length).toStrictEqual(numberOfRules);
  });

  it('exports configurations that refer to actual rules', (): void => {
    expect.assertions(3);

    const recommendedConfigs = internalRules.configs;

    expect(recommendedConfigs).toMatchSnapshot();
    expect(Object.keys(recommendedConfigs)).toStrictEqual([
      'all',
      'recommended',
    ]);
    expect(Object.keys(recommendedConfigs.all.rules)).toHaveLength(
      ruleNames.length,
    );
  });

  it.each(allConfigRules)(
    '%s rule is included and prefixed',
    (rule: string): void => {
      expect.assertions(2);

      const ruleNamePrefix = 'lvmcn/';
      const ruleName = rule.slice(ruleNamePrefix.length);
      expect(rule.startsWith(ruleNamePrefix)).toBe(true);
      expect(ruleNames).toContain(ruleName);
    },
  );
});

describe('util', (): void => {
  beforeEach((): void => {
    jest.resetModules();
  });

  it('fails if version is not present as a string in package.json', (): void => {
    expect.assertions(1);

    jest.doMock('../package.json', (): { version: [] } => ({ version: [] }));

    expect((): void => require('../src')).toThrow(
      'Version field in package.json is not a string.',
    );
  });
});
