'use strict';

const google = require('googleapis');
const deepAssign = require('deep-assign');
const util = require('./util');

function createAuthClient(credentials) {
  var clientSecret = credentials.client_secret;
  var clientId = credentials.client_id;
  var redirectUrl = credentials.redirect_uri;
  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  oauth2Client.credentials.refresh_token = credentials.refresh_token;
  return new Promise(function(resolve, reject) {
    oauth2Client.refreshAccessToken(function(err, tokens) {
      if (err) {
        return reject(err);
      }
      oauth2Client.setCredentials(tokens);
      resolve(oauth2Client);
    });
  });
}

/**
 * Run test via Execution API.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {Object} config
 */
function run(auth, config) {
  const conf = deepAssign({
    resource: {
      function: 'run',
      devMode: true
    }
  }, config);
  conf.auth = auth;

  return new Promise((resolve, reject) => {
    const script = google.script('v1');
    script.scripts.run(conf, (err, resp) => {
      if (err) {
        return reject(err);
      }
      if (resp.error) {
        handleErrorResponse(resp, reject);
      } else {
        handleSuccessfulResponse(resp, resolve);
      }
    });
  });
}

function handleErrorResponse(resp, reject) {
  let message = '';
  const error = resp.error.details[0];
  message += `Script error message:  ${error.errorMessage}\nScript error stacktrace:`;
  if (error.scriptStackTraceElements) {
    for (let i = 0; i < error.scriptStackTraceElements.length; i++) {
      const trace = error.scriptStackTraceElements[i];
      message += `\t${trace.function}: ${trace.lineNumber}`;
    }
  }
  reject(new Error(message));
}

function handleSuccessfulResponse(resp, resolve) {
  const result = resp.response.result;
  resolve(result);
}

class GasTest {
  constructor(options) {
    this.settings = options.settings; // scriptId, ...
    this.credentials = options.credentials;
  }
  run() {
    return util.readJsonFromFile(this.credentials)
    .then(createAuthClient)
    .then(oauth2Client => {
      return run(oauth2Client, this.settings);
    });
  }
}

module.exports = GasTest;
