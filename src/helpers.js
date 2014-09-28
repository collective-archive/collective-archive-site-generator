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
      if(typeof(value) == "object" || typeof(value) == "array") {
        value = JSON.stringify(value);
      }

      html += key + ': ' + value + "<br />";
    });

    return new Handlebars.SafeString(html);
  });
};
