#!/usr/bin/env node
'use strict';

const program = require('commander');
const colors = require('colors');
const GasTest = require('../lib/gas-test');
const util = require('../lib/util');

program
  .option('-o, --output <path>', 'path to result file')
  .option('-s, --settings <path>', 'path to settins for test', './gas-test.json')
  .option('-c, --credentials <path>', 'path to credentials file', util.getDefaultCredentialPath())
  .option('-r, --reporter <type>', 'type of reporter', 'json')
  .option('-n, --suppress_console', 'no output to console')
  .parse(process.argv);

util.readJsonFromFile(program.settings).then(settings => {
  const options = {
    settings: settings,
    credentials: program.credentials
  };
  const test = new GasTest(options);
  test.run([program.reporter]).then(value => {
    return Promise.all([writeToConsole(value), writeToFile(value)]);
  }).catch(e => {
    if (e) {
      console.error(e);
    }
    process.exit(1);
  });
});

function writeToFile(value) {
  if (program.output) {
    if (program.reporter === 'json') {
      value = JSON.stringify(value);
    }
    return util.writeToFile(program.output, value);
  }
}

function writeToConsole(json) {
  if (program.suppress_console) {
    return;
  }

  const writeError = error => {
    if (error.message) {
      console.log(`    ${colors.red(error.message)}`);
    }
    console.log(`    ${colors.green('+ expected')} ${colors.red('- actual')}`);
    const expected = colors.green(`+${error.expected}`);
    const actual = colors.red(`+${error.actual}`);
    console.log(`    ${expected}`);
    console.log(`    ${actual}`);
  };

  return new Promise((resolve, reject) => {
    const results = json.results || [];
    const stats = json.stats;
    let title;
    results.map(result => {
      if (title != result.title) {
        title = result.title;
        console.log('  %s', result.title);
      }
      console.log('    %s %s', result.failure ? colors.red('✖') : colors.green('✓'), colors.gray(result.name));
      if (result.error) {
        writeError(result.error);
      }
    });
    const passing = colors.green(`${stats.passes} passing`);
    const duration = colors.gray(`(${stats.duration}ms)`);
    console.log('');
    console.log(`  ${passing} ${duration}`);
    if (stats.failures) {
      const failing = colors.red(`${stats.failures} failing`);
      console.log(`  ${failing}`);
    }
    stats.failures === 0 ? resolve(0) : reject();
  });
}
