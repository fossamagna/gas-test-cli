var Tests = require('gas-test');
var t = new Tests('xunit');
global.test = t.test.bind(t);
/**
 * Run all test cases.
 * This method is supposed to called via Execution API.
 *
 * @return XUnit format XML
 */
global.run = function() {
  t.runAll();
  return t.reporter.result;
};
