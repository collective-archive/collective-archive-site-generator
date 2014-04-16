_         = require('underscore');
fs        = require('fs');
ejs       = require('ejs');
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
  target: '../collective-archive.github.io'
};

templates = findTemplates('./templates');

renderIndex(outputOptions);

extractor(connectionInfo, retrievalOptions, function(err, type, thing) {
  console.log(JSON.stringify(thing));
  processData(type, thing, outputOptions);
});

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
  partial = templates["_index.html.ejs"]
  content = ejs.render(partial, {});
  page    = render(content);
  filename = options.target + '/index.html', page;

  fs.writeFileSync(filename, page);
  console.log('Wrote: ' + filename);
}

function renderObject(data, options) {
  partial = templates["_object.html.ejs"]
  content = ejs.render(partial, data);
  page    = render(content);
  filename = options.target + '/objects/' + data.id + '.html', page;

  fs.writeFileSync(filename, page);
  console.log('Wrote: ' + filename);
}

function renderEntity(data, options) {
  partial = templates["_entity.html.ejs"]
  content = ejs.render(partial, data);
  page    = render(content);
  filename = options.target + '/entities/' + data.id + '.html', page;

  fs.writeFileSync(filename, page);
  console.log('Wrote: ' + filename);
}

function render(content) {
  layout = templates["layout.html.ejs"];
  return ejs.render(layout, { content: content });
}
