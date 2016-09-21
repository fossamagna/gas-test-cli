#!/usr/bin/env node
'use strict';

const program = require('commander');
const auth = require('../lib/auth');

program.parse(process.argv);

const args = program.args;

if (!args.length) {
  console.error('client_secret file required');
  process.exit(1);
}
auth(args[0]).catch(err => {
  console.error(err);
});
