#!/usr/bin/env node
'use strict';

const program = require('commander');
const GasTest = require('../lib/gas-test');
const util = require('../lib/util');

program
  .option('-o, --output <path>', 'path to result file')
  .option('-s, --settings <path>', 'path to settins for test', './gas-test.json')
  .option('-c, --credentials <path>', 'path to credentials file', util.getDefaultCredentialPath())
  .parse(process.argv);

util.readJsonFromFile(program.settings).then(settings => {
  const options = {
    settings: settings,
    credentials: program.credentials
  };
  //console.log(options);
  const test = new GasTest(options);
  test.run().then(xml => {
    if (program.output) {
      util.writeToFile(program.output, xml);
    }
  }).catch(e => {
    console.error(e);
  });
});
