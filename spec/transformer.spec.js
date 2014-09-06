transformers = require('../lib/transformers');
fixtures     = require('./fixtures/fixtures')

describe("Transformers", function() {
  beforeEach(function() {
    this.sourceEntity = fixtures.entity;
    this.sourceObject = fixtures.object;
  });

  it("can transform a single entity", function() {
    destination = transformers.transformEntity(this.sourceEntity);

    expect(destination.id).toEqual('1');
    expect(destination.idNumber).toEqual('AG14063001_ao');
    expect(destination.type).toEqual('individual');
    expect(destination.displayName).toEqual('Ryan Lammie');

    expect(destination.description).toEqual('A fine description.');
    expect(destination.website).toEqual('http://www.cmu.edu/');

    expect(destination.culture.length).toEqual(2);
    expect(destination.culture[0]).toEqual('American');
    expect(destination.culture[1]).toEqual('German');

    expect(destination.relationships.length).toEqual(3);
    expect(destination.relationships[0]).toEqual({
        id:   '3',
        type: 'object',
        label: 'OO 11 (Empiricism)',
        relationship: 'was artist'
    });
  });

  it("can transform a single object", function() {
    destination = transformers.transformObject(this.sourceObject);

    expect(destination.id).toEqual('3');
    expect(destination.idNumber).toEqual('WK14063002_ao');
    expect(destination.type).toEqual('work record');
    expect(destination.displayName).toEqual('OO 11 (Empiricism)');
    expect(destination.description).toEqual('Another fine description.');

    expect(destination.workType).toEqual('digital images');
    expect(destination.material).toEqual('rubber, acrylic, silicone, latex, found objects');
    expect(destination.dimensions).toEqual('72.9 x 57.7 cm framed');

    expect(destination.relationships.length).toEqual(0);

    expect(destination.artists[0]).toEqual({
        id:   '1',
        type: 'entity',
        label: 'Ryan Lammie',
        relationship: 'artist'
    });

    expect(destination.representations.length).toEqual(1);
    expect(destination.representations[0]).toEqual({
        id: '4',
        url: "http://archive.collectivearchivepgh.org/media/collectiveaccess/images/0/75708_ca_object_representations_media_4_medium.jpg"
    });
  });
});
