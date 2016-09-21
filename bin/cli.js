#!/usr/bin/env node
'use strict';

const program = require('commander');
const pkg = require('../package');

program
  .version(pkg.version)
  .command('build', 'build test')
  .command('auth [client_secret.json]', 'authorize by client_secret json')
  .command('run', 'run test')
  .parse(process.argv);
