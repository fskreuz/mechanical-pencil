'use strict';

const fs = require('fs');
const path = require('path');
const fsplus = require('fs-plus');

module.exports = function listing(inputDir, outputDir, options) {

  const pagesData = fsplus.listTreeSync(inputDir)
                          .filter(pagePath => path.extname(pagePath) === '.json')
                          .map(pagePath => JSON.parse(fs.readFileSync(pagePath, 'utf8')));

  const listingsPageData = pagesData.filter(pageData => pageData.type === 'listing')
  const pagesPageData    = pagesData.filter(pageDatum => pageDatum.type === 'page')
                                    .sort((a, b) => b.timestamp - a.timestamp);

  listingsPageData.forEach(listingPageData => {

     const subPagesData = pagesPageData.filter(pagePageData => pagePageData.dir.indexOf(listingPageData.dir) === 0);
     const outputPath   = path.join(outputDir, listingPageData.dir, `${listingPageData.name}.json`);
     const listingData  = Object.assign({ contents: subPagesData }, listingPageData);

     fsplus.writeFileSync(outputPath, JSON.stringify(listingData));

   });

  return Promise.resolve();
};
