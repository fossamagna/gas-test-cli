#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const program = require('commander');
const glob = require('glob');
const str = require('string-to-stream');
const StreamConcat = require('stream-concat');
const browserify = require('browserify');
const gasify = require('gasify');
const babelify = require('babelify');

program
  .option('-o, --output <path>', 'path to output file')
  .option('-b, --babel', 'transpile with babel')
  .parse(process.argv);

const args = program.args;
if (!args.length) {
  console.error('test files pattern is required.');
  process.exit(1);
}

glob(args[0], {}, function (er, files) {
  if (!files || !files.length) {
    console.error(`No match files with pattern ${args[0]}.`);
    process.exit(1);
  }

  let tests = '';
  files.forEach(file => {
    if (!path.isAbsolute(file) && !file.startsWith('.')) {
      file = './' + file;
    }
    tests += `\nrequire('${file}');`;
  });

  const entry = path.join(__dirname, '../lib/entry.js');
  const combinedStream = new StreamConcat([
    fs.createReadStream(entry, {encoding: 'utf-8'}),
    str(tests)
  ]);

  const output = program.output ? fs.createWriteStream(program.output) : process.stdout;

  const b = browserify();
  if (program.babel) {
    b.transform(babelify, {});
  }
  b.plugin(gasify, {})
  .add(combinedStream)
  .bundle().pipe(output);
});
