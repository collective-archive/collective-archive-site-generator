_         = require('underscore');
fs        = require('fs');
ejs       = require('ejs');
path      = require('path')
sh        = require('exec-sync')
mkdirp    = require('mkdirp')
extractor = require('collective-access-extractor')

connectionInfo = {
  url:      'http://162.243.52.198/',
  username: 'api',
  password: 'api123'
};

retrievalOptions = {
  objects:  [3],
  entities: [1],
};

outputOptions = {
  target: './dist'
};

templates = findTemplates('./templates');

copyAssets(outputOptions);

renderIndex(outputOptions);

extractor(connectionInfo, retrievalOptions, function(err, type, thing) {
  console.log(JSON.stringify(thing));
  processData(type, thing, outputOptions);
});

function copyAssets(options) {
  sh("rm -rf " + options.target);
  sh("cp -rf static " + options.target);
}

function findTemplates(dir) {
  files = fs.readdirSync(dir);

  templates = {};

  _.map(files, function(file) {
    templates[file] = fs.readFileSync(dir + '/' + file, { encoding: 'utf8' });
  });

  return templates;
}

function processData(type, data, options) {
  if(type == 'object') {
    renderObject(data, options);
  }
  else if(type == 'entity') {
    renderEntity(data, options);
  }
}

function renderIndex(options) {
  content = renderPartial("_index.html.ejs", {});
  page    = render(content);
  filename = options.target + '/index.html', page;

  mkdirp.sync(path.dirname(filename));
  fs.writeFileSync(filename, page);
  console.log('Wrote: ' + filename);
}

function renderObject(data, options) {
  content = renderPartial("_object.html.ejs", data);
  page    = render(content);
  filename = options.target + '/objects/' + data.id + '.html', page;

  mkdirp.sync(path.dirname(filename));
  fs.writeFileSync(filename, page);
  console.log('Wrote: ' + filename);
}

function renderEntity(data, options) {
  content = renderPartial("_entity.html.ejs", data);
  page    = render(content);
  filename = options.target + '/entities/' + data.id + '.html', page;

  mkdirp.sync(path.dirname(filename));
  fs.writeFileSync(filename, page);
  console.log('Wrote: ' + filename);
}

function renderPartial(templateName, data) {
  partial = templates[templateName]
  data    = _.extend(data, { filename: './templates/' + templateName });
  return ejs.render(partial, data);
}

function render(content) {
  layout = templates["layout.html.ejs"];
  return ejs.render(layout, { content: content });
}
