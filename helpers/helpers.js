module.exports.register = function (Handlebars, options)  {
  Handlebars.registerHelper('relationshipUrl', function (relationship)  {
    var plural = function() {
      if(relationship.type === "object") { return "objects";  }
      if(relationship.type === "entity") { return "entities"; }

      return "";
    }

    return new Handlebars.SafeString("/" + plural() + "/" + relationship.id + ".html");
  });
};
