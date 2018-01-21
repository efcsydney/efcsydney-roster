const Papa = require('papaparse');
const fs = require('fs');

function readAndParseFile(fileName) {
  const fileContent = fs.readFileSync(fileName, { encoding: 'utf8' });
  return Papa.parse(fileContent, { header: true }).data;
}

module.exports = {
  readAndParseFile
}