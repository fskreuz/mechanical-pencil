'use strict';

const path = require('path');
const fs = require('fs');
const fsplus = require('fs-plus');
const handlebars = require('handlebars');
const handlebarsLayouts = require('handlebars-layouts');

const defaults = {
  extraData: {}
};

function getData(inputDir, options) {
  return fsplus
    .listTreeSync(inputDir)
    .filter(inputPath => path.extname(inputPath) === '.json')
    .reduce((data, dataPath) => {
      const dataName = path.relative(inputDir, dataPath);
      data[dataName] = Object.assign({}, JSON.parse(fs.readFileSync(dataPath, 'utf8')), options.extraData);
      return data;
    }, {});
}

function getTemplates(inputDir, options) {
  return fsplus
    .listTreeSync(inputDir)
    .filter(inputPath => path.extname(inputPath) === '.hb')
    .reduce((templates, templatePath) => {
      const templateName = path.posix.join(...path.relative(inputDir, templatePath).split(path.sep));
      templates[templateName] = fs.readFileSync(templatePath, 'utf8');
      return templates;
    }, {});
}

function compileTemplates(templates, handlebarsInstance){
  return Object.keys(templates).reduce((compiledTemplates, templateName) => {
    compiledTemplates[templateName] = handlebarsInstance.compile(templates[templateName]);
    return compiledTemplates;
  }, {});
}

function registerPartials(templates, handlebarsInstance){
  Object.keys(templates).forEach(templateName => handlebarsInstance.registerPartial(templateName, templates[templateName]));
}

function setContents(templates, data, outputDir) {
  Object.keys(data).forEach(key => {
    const fileData = data[key];
    const template = templates[fileData.template];

    // Don't proceed when there is no template field
    if(!template) return;

    const contents = template(fileData);
    const fileInfo = path.parse(key);
    const filePath = path.join(outputDir, fileInfo.dir, `${fileInfo.name}.html`);
    fsplus.writeFileSync(filePath, contents);
  });
}

function layout(inputDir, outputDir, options) {

  options = Object.assign({}, defaults, options);

  // Each change creates a new instance of handlebars and re-registers
  // everything. Not efficient, but keeps the templates updated on a per-build
  // basis. Builds happen only during dev and deploy anyways.
  const handlebarsInstance = handlebars.create();
  handlebarsInstance.registerHelper(handlebarsLayouts(handlebarsInstance));

  const templates = getTemplates(inputDir, options);
  const data = getData(inputDir, options);

  registerPartials(templates, handlebarsInstance);
  const compiledTemplates = compileTemplates(templates, handlebarsInstance);

  setContents(compiledTemplates, data, outputDir);

  return Promise.resolve();
}


module.exports = layout;

