'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');
const util = require('./util');

function getCredentials(file) {
  return util.readJsonFromFile(file).then(credentials => {
    return {
      client_secret: credentials.installed.client_secret,
      client_id: credentials.installed.client_id,
      redirect_uri: credentials.installed.redirect_uris[0]
    };
  });
}

function createAuthClient(credentials) {
  const OAuth2 = google.auth.OAuth2;
  return new OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uri);
}

function getCredentialsWithNewToken(oauth2Client, credentials, options) {
  return new Promise((resolve, reject) => {
    options = options || {};
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: options.scopes || ['https://www.googleapis.com/auth/drive']
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
      rl.close();
      oauth2Client.getToken(code, (err, token) => {
        if (err) {
          return reject(err);
        }
        credentials.refresh_token = token.refresh_token;
        oauth2Client.setCredentials(token);
        resolve(credentials);
      });
    });
  });
}

/**
 * Store credentials to disk be used in later program executions.
 *
 * @param {Object} credentials The credentials to store to disk.
 */
function storeCredentials(credentials) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter file path in order to save credentials: ', (storeFilePath) => {
      rl.close();
      const dirname = path.dirname(storeFilePath);
      try {
        fs.mkdirSync(dirname);
      } catch (err) {
        if (err.code != 'EEXIST') {
          return reject(err);
        }
      }
      resolve(storeFilePath);
    });
  }).then(storeFilePath => {
    return util.writeJsonToFile(storeFilePath, credentials);
  });
}

module.exports = function(file, options) {
  return getCredentials(file)
    .then(credentials => {
      const oauth2Client = createAuthClient(credentials);
      return getCredentialsWithNewToken(oauth2Client, credentials, options);
    })
    .then(storeCredentials);
};
