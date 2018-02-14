# dmn-js - DMN for the web

[![Build Status](https://travis-ci.org/bpmn-io/dmn-js.svg?branch=master)](https://travis-ci.org/bpmn-io/dmn-js)

[dmn-js](https://github.com/bpmn-io/dmn-js) is a DMN modeling and rendering toolkit.


__NOTE__: Please do NOT consider dmn-js v1.x.x as stable. The project is still in an early stage of development. Breaking changes may be introduced at any time. We're planning to release a stable dmn-js v2.0.0 soon. In the meantime please refer to dmn-js v0.11.0 as the last stable version.


## Usage

```javascript
var DmnViewer = require('dmn-js');

var xml; // my DMN xml
var viewer = new DmnViewer({ container: 'body' });

viewer.importXML(xml, function(err) {

  if (err) {
    console.log('error rendering', err);
  } else {
    console.log('rendered');
  }
});
```


## Resources

*   [Issues](https://github.com/bpmn-io/dmn-js/issues)


## Tools

dmn-js builds on top of a few additional powerful tools

* [dmn-moddle](https://github.com/bpmn-io/dmn-moddle): Read / write support for DMN XML in the browsers
* [table-js](https://github.com/bpmn-io/table-js): Table rendering and editing toolkit


## Building the Project

```
# build everything
npm run all

# dev in a sub-project
npm run dev -- dmn-js
```


## License

Use under the terms of the [bpmn.io license](http://bpmn.io/license).
