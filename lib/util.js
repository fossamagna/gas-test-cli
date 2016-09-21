'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Read json frmat file.
 * @param  {String} file Path to json file.
 * @return {Promise} json object
 */
function readJsonFromFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(content));
      }
    });
  });
}

/**
 * Write json to file.
 * @param  {String} file Path to json file.
 * @param  {Object} obj store
 * @return {Promise}
 */
function writeJsonToFile(file, obj) {
  return writeToFile(file, JSON.stringify(obj));
}

/**
 * Write data to file.
 * @param  {String} file Path to file.
 * @param  {Object} data store
 * @return {Promise}
 */
function writeToFile(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Return defalut credentials file path.
 * @return {String} defalut credentials file path
 */
function getDefaultCredentialPath() {
  const home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  return path.join(home, '.credentials', 'gas-test-credentials.json');
}

module.exports.readJsonFromFile = readJsonFromFile;
module.exports.writeJsonToFile = writeJsonToFile;
module.exports.writeToFile = writeToFile;
module.exports.getDefaultCredentialPath = getDefaultCredentialPath;
