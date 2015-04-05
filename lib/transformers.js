_ = require('underscore');

var FEATURED_ACCESS_CODE = "1";

var getType = function(data) {
  return data.type_id.display_text.en_US;
}

var entityProperty = function(data, propertyName, fieldName) {
  var key    = "ca_entities." + propertyName;
  var objects = data[key];

  return caFieldTransformer(objects, fieldName || propertyName);
};

var objectProperty = function(data, propertyName, fieldName) {
  var key    = "ca_objects." + propertyName;
  var objects = data[key];

  return caFieldTransformer(objects, fieldName || propertyName);
};

var occurrenceProperty = function(data, propertyName, fieldName) {
  var key    = "ca_occurrences." + propertyName;
  var objects = data[key];

  return caFieldTransformer(objects, fieldName || propertyName);
};

var collectionProperty = function(data, propertyName, fieldName) {
  var key    = "ca_collections." + propertyName;
  var objects = data[key];

  return caFieldTransformer(objects, fieldName || propertyName);
};

var singleEntityProperty = function(data, propertyName, fieldName) {
  var results = entityProperty(data, propertyName, fieldName);

  if(results && results.length > 0)
    return results[0];
}

var singleObjectProperty = function(data, propertyName, fieldName) {
  var results = objectProperty(data, propertyName, fieldName);

  if(results && results.length > 0)
    return results[0];
}

var singleOccurrenceProperty = function(data, propertyName, fieldName) {
  var results = occurrenceProperty(data, propertyName, fieldName);

  if(results && results.length > 0)
    return results[0];
}

var singleCollectionProperty = function(data, propertyName, fieldName) {
  var results = collectionProperty(data, propertyName, fieldName);

  if(results && results.length > 0)
    return results[0];
}

var caFieldTransformer = function(data, name) {
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

var getField = function(data) {
  if (data.en_US) {
      return data.en_US;
  } else if (data.none) {
      return data.none;
  } else {
      return;
  }
}

var addressTransformer = function(addressData) {
  return _.extend({}, addressData.none);
}

var relationshipTransformer = function(relationshipData) {
  var ARTIST_CODES = [
    'had as artist',
    'has as author',
    'had as photographer',
    'had as designer',
  ];

  var relationships = [];

  if(relationshipData == undefined) {
    return [];
  }

  var transformRelationshipType = function(relationshipType) {
    if(_.contains(ARTIST_CODES, relationshipType)) {
      return 'artist';
    }

    return relationshipType;
  };

  if(relationshipData.ca_objects !== undefined) {
    var objects = _.map(relationshipData.ca_objects, function(object) {
      return {
        id: object.object_id,
        type: 'object',
        label: object.label,
        relationship: transformRelationshipType(object.relationship_typename),
        fullRelationship: object.relationship_typename,
      };
    });

    relationships = relationships.concat(objects);
  }

  if(relationshipData.ca_entities !== undefined) {
    var objects = _.map(relationshipData.ca_entities, function(entity) {
      return {
        id: entity.entity_id,
        type: 'entity',
        label: entity.label,
        relationship: transformRelationshipType(entity.relationship_typename),
        fullRelationship: entity.relationship_typename,
      };
    });

    relationships = relationships.concat(objects);
  }

  if(relationshipData.ca_occurrences !== undefined) {
    var objects = _.map(relationshipData.ca_occurrences, function(entity) {
      return {
        id: entity.occurrence_id,
        type: 'occurrence',
        label: entity.label,
        relationship: transformRelationshipType(entity.relationship_typename),
        fullRelationship: entity.relationship_typename,
      };
    });

    relationships = relationships.concat(objects);
  }

  if(relationshipData.ca_collections !== undefined) {
    var objects = _.map(relationshipData.ca_collections, function(entity) {
      return {
        id: entity.collection_id,
        type: 'collection',
        label: entity.label,
        relationship: transformRelationshipType(entity.relationship_typename),
        fullRelationship: entity.relationship_typename,
      };
    });

    relationships = relationships.concat(objects);
  }

  return relationships;
}

var representationTransformer = function(data) {
  return {
    id:        data.representation_id,
    url:       data.urls.medium,
    largeUrl:  data.urls.large
  };
}

var representationsTransformer = function(data) {
  return _.map(data, function(val) {
    return representationTransformer(val);
  });
}


var stripDate = function(date) {
  return date.replace('after ', '');
}

var getEntityDates = function(data) {
  var agentDates = data['ca_entities.agent_dates'];
  var dates = {};

  _.each(agentDates, function(date) {
    var inner = date.en_US;
    dates[inner.date_type] = stripDate(inner.agent_dates);
  })

  return dates;
};

var entityTransformer = function(data) {
  var relationships = relationshipTransformer(data.related);

  relationships     = _.reject(relationships, function(r) { return r.relationship === 'copyright'; });

  var type = getType(data);

  return {
    id:            data.entity_id.value,
    idNumber:      data.idno.value,
    type:          type,
    displayName:   data.preferred_labels.en_US[0],
    dates:         getEntityDates(data),
    culture:       entityProperty(data, "culture"),
    gender:        singleEntityProperty(data, "gender"),
    description:   singleEntityProperty(data, "description"),
    website:       {
      name: singleEntityProperty(data, "external_link", "url_source"),
      url:  singleEntityProperty(data, "external_link", "url_entry"),
    },
    addresses:     _.map(data['ca_entities.address'], addressTransformer),
    relationships: relationships
  }
};

var objectTransformer = function(data) {
  var relationships = relationshipTransformer(data.related);

  var artists       = _.filter(relationships, function (relationship) { return relationship.relationship === 'artist'; });

  var copyright     = _.filter(relationships, function(relationship) { return relationship.relationship === 'copyright'; });

  var otherRelationships = _.chain(relationships)
    .filter(function(r) { return artists.indexOf(r) < 0;   })
    .filter(function(r) { return copyright.indexOf(r) < 0; })
    .value();

  return {
    id:               data.object_id.value,
    idNumber:         data.idno.value,
    type:             getType(data),
    displayName:      data.preferred_labels.en_US[0],
    creationDate:     singleObjectProperty(data, "dates", "dates_value"),
    material:         singleObjectProperty(data, "materials"),
    description:      singleObjectProperty(data, "description"),
    dimensions:       singleObjectProperty(data, "dimensions_display"),
    workType:         singleObjectProperty(data, "work_type"),
    rights:           singleObjectProperty(data, "rights"),
    artists:          artists,
    relationships:    otherRelationships,
    copyrightHolders: copyright,
    representations:  representationsTransformer(data.representations),
    isFeatured:       data.access.value === FEATURED_ACCESS_CODE
  }
};

var getOccurrenceDates = function(data) {
  var rawDates = data['ca_occurrences.dates'];
  var dates = {};

  _.each(rawDates, function(date) {
    var inner = date.none;
    dates[inner.dates_type] = stripDate(inner.dates_value);
  })

  return dates;
};

var occurrenceTransformer = function(data) {
  var type = getType(data);

  return {
    id:            data.occurrence_id.value,
    idNumber:      data.idno.value,
    type:          type,
    displayName:   data.preferred_labels.en_US[0],
    description:   singleOccurrenceProperty(data, "description"),
    dates:         getOccurrenceDates(data),
    relationships: relationshipTransformer(data.related),
  };
}

var collectionTransformer = function(data) {
  var type = getType(data);

  return {
    id:            data.collection_id.value,
    idNumber:      data.idno.value,
    type:          type,
    displayName:   data.preferred_labels.en_US[0],
    description:   singleCollectionProperty(data, "description"),
    relationships: relationshipTransformer(data.related),
    website:       {
      name: singleCollectionProperty(data, "external_link", "url_source"),
      url:  singleCollectionProperty(data, "external_link", "url_entry"),
    },
  };
}

module.exports = {
  transformEntity: entityTransformer,
  transformObject: objectTransformer,
  transformOccurrence: occurrenceTransformer,
  transformCollection: collectionTransformer,
}
