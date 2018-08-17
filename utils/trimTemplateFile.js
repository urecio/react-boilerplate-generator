const fs = require('fs');
const path = require('path');

module.exports = (generator, template) =>
  fs.readFileSync(path.join(__dirname, '..', generator, template), 'utf8').replace(/\s*$/, '');
