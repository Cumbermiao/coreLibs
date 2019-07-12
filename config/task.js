const {resolve} = require('path');
const {babelJs,babelUnit} = require('./babel');
const cleanCoverage = require('./clean');

module.exports = {
  babelJs,
  babelUnit,
  cleanCoverage
}