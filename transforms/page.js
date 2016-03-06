'use strict';

const fs = require('fs');
const path = require('path');
const fsplus = require('fs-plus');


module.exports = function page(inputDir, outputDir, options) {

  fsplus.listTreeSync(inputDir)
        .filter(pagePath => path.extname(pagePath) === '.json')
        .map(pagePath => JSON.parse(fs.readFileSync(pagePath, 'utf8')))
        .filter(pageData => pageData.type === 'page')
        .forEach(pageData => fsplus.writeFileSync(path.join(outputDir, `${pageData.dir}`, `${pageData.name}.json`), JSON.stringify(pageData)));

  return Promise.resolve();
};
