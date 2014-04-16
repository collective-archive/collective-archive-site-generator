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

templates = findTemplates('./templates');

extractor(connectionInfo, retrievalOptions, function(err, type, thing) {
  processData(type, thing, { output: './output' });
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

function renderObject(data) {
  console.log('object');
}

function renderEntity(data) {
  console.log('entity');
}

