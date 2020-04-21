#!/usr/bin/env node
'use strict';

const program = require('commander');
const auth = require('../lib/auth');
const util = require('../lib/util');

program
  .option('-s, --settings <path>', 'path to settins for test', './gas-test.json')
  .parse(process.argv);

const args = program.args;

if (!args.length) {
  console.error('client_secret file required');
  process.exit(1);
}

util.readJsonFromFile(program.settings).then(settings => {
  auth(args[0], settings).catch(err => {
    console.error(err);
  });
});
