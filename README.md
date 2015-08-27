# Pittsburgh Collective Archive

This project is the source code for the [Pittsburgh Collective Archive](http://collective-archive.github.io/).

At a high level, this application:

- [Extracts](https://github.com/collective-archive/collective-archive-site-generator/blob/master/lib/extract_from_archive.js) data from a Collective Access instance.
- [Transforms](https://github.com/collective-archive/collective-archive-site-generator/blob/master/lib/transformers.js) the raw Collective Access data into an intermediate JSON format.
- [Generates](https://github.com/collective-archive/collective-archive-site-generator/blob/master/Gruntfile.js#L79-L129) static HTML via Handlbars and the [Assemble](http://assemble.io/) static site generator.
- [Generates](https://github.com/collective-archive/collective-archive-site-generator/blob/master/lib/generate_search_index.js) a [lunr](http://lunrjs.com/) search index for fast, client-side full-text search.
- [Deploys](https://github.com/collective-archive/collective-archive-site-generator/blob/master/Gruntfile.js#L233-L247) the site to Github Pages. 

Handlebars templates are located [here](https://github.com/collective-archive/collective-archive-site-generator/tree/master/src/templates).

It also supports local development by running a development server with live reload.

Installation Instructions:

```
brew install node
node install -g grunt-cli bower
npm install
bower install
grunt
grunt serve
```
