# Single line comments should not be in a block comment (no-single-line-comment-block)

Block comments should be used for JSDoc notation and multiline comments only.
Every comment that is just in one line should use line comment notation instead.

This rule ignores special cases for `eslint` configuration. Other cases can be
ignored using either `ignore` (for start patterns) or `ignorePatterns` (for
custom patterns).

## Rule Details

Examples of **incorrect** code for this rule:

```js
/*
 * Only one line in this block
 */

/* Only one line in this block (single line) */
```

Examples of **correct** code for this rule:

```js
/*
 * Two lines
 * in this block
 */

/**
 * One line JSDoc block
 */

/* eslint-disable someRule */

/* eslint-enable someRule */

/* eslint-disable-next-line someRule */

/* eslint-enable-next-line someRule */

/* global var1, var2 */

/* eslint-env node */

// Only one line in comment notation
```

## Options

```JSON
{
  "lvmcn/no-single-line-comment-block": [
    "error",
    {
      "allowJSDoc": false,
      "ignore": ["cspell"],
      "ignorePatterns": "(endPattern)$"
    }
  ]
}
```

### `allowJSDoc`

This boolean option allows JSDoc comment (block comment starts with \*) so that
this rule does not report their usage as being incorrect.

Example of correct code for the `{ "allowJSDoc": true }` option:

```js
/* eslint lvmcn/no-single-line-comment-block: ["error", { "allowJSDoc": true }] */

/** Document for next line code */

/** Document for next line code **/
```

By default, this option is set to `{ "allowJSDoc": false }`.

### `allowInEmptyBraces`

This boolean option allows one line block comment in empty braces so that this
rule does not report their usage as being incorrect.

Example of correct code for the `{ "allowInEmptyBraces": true }` option:

```js
/* eslint lvmcn/no-single-line-comment-block: ["error", { "allowInEmptyBraces": true }] */

const a = {
  /** Document for this empty object */
};

const B = (
  <div>
    {/** Document for next line code **/}
    <span>Next line</span>
  </div>
);
```

By default, this option is set to `{ "allowInEmptyBraces": true }`.

### `ignore`

This array option whitelists strings with which the comment **starts** so that
this rule does not report their usage as being incorrect.

Example of correct code for the `{ "ignore": ["someStartPattern"] }` option:

```js
/* eslint lvmcn/no-single-line-comment-block: ["error", { "ignore": ["someStartPattern"] }] */

/* someStartPattern will be a valid single line block. */
```

By default, this option is set to `{ "ignore": [] }`.

### `ignorePatterns`

This array option whitelists patterns with which the comment complies so that
this rule does not report their usage as being incorrect.

Please note that this option takes only the patterns to construct a full Regular
Expression. The flags used in the constructed regular expression are:

- `/g`: Global.
- `/m`: Multiline.
- `/u`: Unicode.

Example of correct code for the
`{ "ignorePatterns": ["(?:EndPattern)(?: |)$"] }` option:

```js
/* eslint lvmcn/no-single-line-comment-block: ["error", { "ignorePatterns": ["(?:EndPattern)(?: |)$"] }] */

/* will be a valid single line block with EndPattern */
```

> The resulting regular expression used for the given pattern would be
> `/(?:EndPattern)(?: |)$/gmu`.

By default, this option is set to `{ "ignorePatterns": [] }`.

## When Not To Use It

When you do not have a preference on using single line comment notation for
single line comments.

## Further Reading

See [here](https://eslint.org/docs/user-guide/configuring) for more details
about in-file configuration of Eslint
