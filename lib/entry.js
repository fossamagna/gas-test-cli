var Tests = require('gas-test');
var t = new Tests('json');
global.suite = t.suite.bind(t);
global.test = t.test.bind(t);
/**
 * Run all test cases.
 * This method is supposed to called via Execution API.
 *
 * @return Test results
 */
global.run = function(reporter) {
  t.reporter(reporter || 'json');
  t.runAll();
  return t.reporter().result;
};
