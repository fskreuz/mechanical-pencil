'use strict';

const fs = require('fs');
const path = require('path');
const fsplus = require('fs-plus');

module.exports = function listing(inputDir, outputDir, options) {

  const pagesData = fsplus.listTreeSync(inputDir)
                          .filter(pagePath => path.extname(pagePath) === '.json')
                          .map(pagePath => JSON.parse(fs.readFileSync(pagePath, 'utf8')));

  const pagesPageData = pagesData.filter(pageDatum => pageDatum.type === 'page')
                                 .sort((a, b) => b.timestamp - a.timestamp);

  pagesData.filter(pageData => pageData.type === 'listing')
           .forEach(pageData => {
             const outputPath = path.join(outputDir, pageData.dir, `${pageData.name}.json`);
             const listingData = Object.assign({}, { contents: pagesPageData }, pageData);
             fsplus.writeFileSync(outputPath, JSON.stringify(listingData));
           });

  return Promise.resolve();
};
