'use strict';

const gobble = require('gobble');

const pack = require('./package');

const layout  = require('./transforms/layout');
const parse   = require('./transforms/parse');
const page    = require('./transforms/page');
const listing = require('./transforms/listing');
const front   = require('./transforms/front');

const inputNode     = gobble('contents');
const templatesNode = inputNode.include('.templates/*');
const dataNode      = inputNode.transform(parse);
const pagesNode     = dataNode.transform(page);
const listingsNode  = dataNode.transform(listing);
const frontsNode    = dataNode.transform(front);
const siteNode      = gobble([ pagesNode, listingsNode, frontsNode, templatesNode ]).transform(layout, { extraData: pack.siteData });

module.exports = siteNode;
