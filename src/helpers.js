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

  Handlebars.registerHelper('take', function (to, context, options){
    var item = "";
    for (var i = 0, j = to; i < j; i++) {
        item = item + options.fn(context[i]);
    }
    return item;
  });

  Handlebars.registerHelper('chunk', function (context, chunks, options){
    var ret = '';

    var lists = _.chain(context)
      .groupBy(function(element, index){ return Math.floor(index/chunks); })
      .toArray()
      .value();

    for (var i = 0; i < lists.length; i++) {
      ret += options.fn(lists[i]);
    }

    return ret;
  });
};
