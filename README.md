# gas-test-cli [![NPM version][npm-image]][npm-url]  [![Build Status][travis-image]][travis-url]

> CLI for [gas-test](https://github.com/fossamagna/gas-test)

## Installation

First, install gas-test-cli using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```sh
npm install gas-test-cli --save-dev
```

## Usage

1. Get Credentials for Google Apps Script Execution API.
  ```sh
  $(npm bin)/gas-test auth <client_secret.json>
  ```
2. Create settings file.

  Note: Change to `scopes` values used by your test script.

  gas-test.json:
  ```
  {
    "scriptId": "<YOUR_SCRIPT_ID_FOR_TEST>",
    "scopes": ["https://www.googleapis.com/auth/drive"]
  }
  ```

3. Build test code.

   Options:
    - `-t`, `--typescript`: transpile with TypeScript
    - `-b`, `--babel`: transpile with babel

  ```sh
  $(npm bin)/gas-test --typescript build test/*.ts -o built.js
  ```

4. Push test code via Google Apps Script API

  ```sh
  $ clasp push
  ```
  [clasp](https://github.com/google/clasp) is useful in order to push script to project on Google.

5. Run test code using gas-test via Execution API.

  ```sh
  $(npm bin)/gas-test run -c <path to credentials> -s <path to gas-test.json> -o <path to output>
  ```

## License

Apache-2.0 © [fossamagna](https://github.com/fossamagna)

[npm-image]: https://badge.fury.io/js/gas-test-cli.svg
[npm-url]: https://npmjs.org/package/gas-test-cli
[travis-image]: https://travis-ci.org/fossamagna/gas-test-cli.svg?branch=master
[travis-url]: https://travis-ci.org/fossamagna/gas-test-cli
