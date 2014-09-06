fs = require('fs');

module.exports = {
  object: JSON.parse(fs.readFileSync('spec/fixtures/object_3.json')),
  entity: JSON.parse(fs.readFileSync('spec/fixtures/entity_1.json'))
};
