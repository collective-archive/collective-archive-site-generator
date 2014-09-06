_ = require('underscore');

getType = function(data) {
  return data.type_id.display_text.en_US;
}

entityProperty = function(data, propertyName, fieldName) {
  var key    = "ca_entities." + propertyName;
  var objects = data[key];

  return caFieldTransformer(objects, fieldName || propertyName);
};

objectProperty = function(data, propertyName, fieldName) {
  var key    = "ca_objects." + propertyName;
  var objects = data[key];

  return caFieldTransformer(objects, fieldName || propertyName);
};

singleEntityProperty = function(data, propertyName, fieldName) {
  var results = entityProperty(data, propertyName, fieldName);

  if(results && results.length > 0)
    return results[0];
}

singleObjectProperty = function(data, propertyName, fieldName) {
  var results = objectProperty(data, propertyName, fieldName);

  if(results && results.length > 0)
    return results[0];
}

caFieldTransformer = function(data, name) {
  if(data === undefined) {
    return;
  }

  return _.map(data, function(entry) {
    var field = getField(entry);

    if (field === undefined) {
      return;
    }

    return field[name];
  });
}

getField = function(data) {
  if (data.en_US) {
      return data.en_US;
  } else if (data.none) {
      return data.none;
  } else {
      return;
  }
}

addressTransformer = function(addressData) {
  return _.extend({}, addressData.none);
}

relationshipTransformer = function(relationshipData) {
  var ARTIST_CODE = 'had as artist';
  var relationships = [];

  if(relationshipData == undefined) {
    return [];
  }

  var transformRelationshipType = function(relationshipType) {
    if(relationshipType === ARTIST_CODE) {
      return 'artist';
    }

    return relationshipType;
  };

  if(relationshipData.ca_objects !== undefined) {
    objects = _.map(relationshipData.ca_objects, function(object) {
      return {
        id: object.object_id,
        type: 'object',
        label: object.label,
        relationship: transformRelationshipType(object.relationship_typename)
      };
    });

    relationships = relationships.concat(objects);
  }

  if(relationshipData.ca_entities !== undefined) {
    objects = _.map(relationshipData.ca_entities, function(entity) {
      return {
        id: entity.entity_id,
        type: 'entity',
        label: entity.label,
        relationship: transformRelationshipType(entity.relationship_typename)
      };
    });

    relationships = relationships.concat(objects);
  }

  return relationships;
}

representationTransformer = function(data) {
  return {
    id:  data.representation_id,
    url: data.urls.medium
  };
}

representationsTransformer = function(data) {
  var results = [];

  for(var id in data) {
    results.push(representationTransformer(data[id]));
  }

  return results;
}

// TODO:
// place
// event

entityTransformer = function(data) {
  return {
    id:            data.entity_id.value,
    idNumber:      data.idno.value,
    type:          getType(data),
    displayName:   data.preferred_labels.en_US[0],
    dates:         null, //TODO: hard to do with current data format in CA
    culture:       entityProperty(data, "culture"),
    description:   singleEntityProperty(data, "description"),
    website:       singleEntityProperty(data, "external_link", "url_entry"),
    addresses:     _.map(data['ca_entities.address'], addressTransformer),
    relationships: relationshipTransformer(data.related)
  }
};

objectTransformer = function(data) {
  var relationships = relationshipTransformer(data.related);

  return {
    id:              data.object_id.value,
    idNumber:        data.idno.value,
    type:            getType(data),
    displayName:     data.preferred_labels.en_US[0],
    dates:           null,
    material:        singleObjectProperty(data, "materials"),
    description:     null,
    measurements:    null,
    workType:        null,
    rights:          null,
    relationships:   _.filter(relationships, function (relationship) { return relationship.relationship !== 'artist'; }),
    artists:         _.filter(relationships, function (relationship) { return relationship.relationship === 'artist'; }),
    representations: representationsTransformer(data.representations)
  }
};

module.exports = {
  transformEntity: entityTransformer,
  transformObject: objectTransformer
}
