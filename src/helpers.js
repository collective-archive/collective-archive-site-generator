module.exports.register = function (Handlebars, options)  {
  Handlebars.registerHelper('relationshipUrl', function (relationship)  {
    var plural = function() {
      if(relationship.type === "object") { return "objects";  }
      if(relationship.type === "entity") { return "entities"; }

      return "";
    }

    return new Handlebars.SafeString("/" + plural() + "/" + relationship.id);
  });

  Handlebars.registerHelper('debug', function (object)  {
    var html = '';
    _.map(object, function(value, key){
      html += value + ': ' + key;
    });

    return new Handlebars.SafeString(html);
  });

  Handlebars.registerHelper('currentUrl', function ()  {
    return Document.URL;
  });
};
