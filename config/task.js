const {resolve} = require('path');
const babelJs = require('./babel');
const cleanCoverage = require('./clean');

module.exports = {
  babelJs,
  cleanCoverage
}