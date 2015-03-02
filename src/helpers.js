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

  Handlebars.registerHelper ('truncate', function (str, len) {
    if (str.length > len && str.length > 0) {
      var new_str = str + " ";
      new_str = str.substr (0, len);
      new_str = str.substr (0, new_str.lastIndexOf(" "));
      new_str = (new_str.length > 0) ? new_str : str.substr (0, len);

      return new Handlebars.SafeString ( new_str +'...' ); 
    }
    return str;
  });

  Handlebars.registerHelper('activeIfZero', function (index) {
    if (index == 0) {
      return new Handlebars.SafeString('active');
    }
    return "";
  });

  Handlebars.registerHelper('moreThanOne', function (length, options) {
    if (length > 1) {
      return options.fn(this);
    }

    return "";
  });

  Handlebars.registerHelper('dateWithLabel', function (entity, options) {
    if(!entity || !entity.dates) {
      return "";
    }

    var context = {};

    if(entity.type === 'personal') {
      context = {
        label: 'Born',
        date:  entity.dates.life
      };
    }
    else {
      context = {
        label: 'Established',
        date:  entity.dates.activity
      };
    }

    return options.fn(context);
  });
};
