fs        = require('fs');
path      = require('path')
mkdirp    = require('mkdirp')
extractor = require('collective-access-extractor')

connectionInfo = {
  url:      'http://archive.collectivearchivepgh.org/',
  username: 'api',
  password: 'api123'
};

retrievalOptions = {
  objects:  [1, 2, 3],
  entities: [2, 3, 4],
};

outputOptions = {
  target: './src/data/records'
};

extractor(connectionInfo, retrievalOptions, function(err, type, thing) {
  buildRecords(type, thing, outputOptions);
});

function buildRecords(type, data, options) {
  if(type == 'object') {
    buildObject(data, options);
  }
  else if(type == 'entity') {
    buildEntity(data, options);
  }
}

function buildObject(data, options) {
  json = JSON.stringify(data);
  filename = options.target + '/objects/' + data.id + '.json';

  mkdirp.sync(path.dirname(filename));
  fs.writeFileSync(filename, json);
  console.log('Wrote: ' + filename);
}

function buildEntity(data, options) {
  json = JSON.stringify(data);
  filename = options.target + '/entities/' + data.id + '.json';

  mkdirp.sync(path.dirname(filename));
  fs.writeFileSync(filename, json);
  console.log('Wrote: ' + filename);
}
