'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');
const moment = require('moment');
const fsplus = require('fs-plus');

const summarySeparator = '---';

function isMarkdownPath(inputPath) {
  return !!~['md'].indexOf(path.extname(inputPath).slice(1));
}

function getDates(dateString) {
  const date = moment(dateString || '1970-01-01T00:00:00Z', 'YYYY-MM-DD HH:mm');

  return {
    date: date.format('MMMM D, YYYY'),
    time: date.format('h:mm a'),
    timestamp: date.unix()
  };
}

function getSummary(markdown) {
  const indexOfHorizontalRule = markdown.indexOf(summarySeparator);
  const potentialSummary = markdown.slice(0, indexOfHorizontalRule);
  const hasSummary = !!~indexOfHorizontalRule;
  return hasSummary ? potentialSummary : '';
}

function getBody(markdown) {
  const indexOfHorizontalRule = markdown.indexOf(summarySeparator);
  const hasSeparator = !!~indexOfHorizontalRule;
  const sliceStart = hasSeparator ? indexOfHorizontalRule + summarySeparator.length : 0;
  return markdown.slice(sliceStart);
}

function getContents(content) {
  const summary = getSummary(content);
  const body = getBody(content);

  return {
    content,
    contentMarkup: marked(content),
    summary,
    summaryMarkup: marked(summary),
    body,
    bodyMarkup: marked(body)
  };
}

function getTags(tags){
  return tags ? tags.split(',').map(tag => tag.trim()) : [];
}

function constructData(inputContents, inputPath) {
  const fileMatter = matter(inputContents);
  const metadata = fileMatter.data;
  const tags = getTags(metadata.tags);
  const dates = getDates(metadata.date);
  const contents = getContents(fileMatter.content);
  const pathData = path.parse(inputPath);
  const data = Object.assign({}, metadata, dates, pathData, { path: inputPath, tags }, contents);
  return data;
}

function parse(inputDir, outputDir, options) {

  fsplus.listTreeSync(inputDir)
        .filter(isMarkdownPath)
        .map(dataPath => constructData(fs.readFileSync(dataPath, 'utf8'), path.relative(inputDir, dataPath)))
        .forEach(pageData => fsplus.writeFileSync(path.join(outputDir, pageData.dir, `${pageData.name}.json`), JSON.stringify(pageData)));

  return Promise.resolve();
}

module.exports = parse;

