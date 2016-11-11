# dmn-js - DMN for the web

[![Build Status](https://travis-ci.org/bpmn-io/dmn-js.svg?branch=master)](https://travis-ci.org/bpmn-io/dmn-js)

[dmn-js](https://github.com/bpmn-io/dmn-js) is a DMN modeling and rendering toolkit.


> the project is still in an early stage. Documentation may be missing and examples may be broken.


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

As long as the project is in alpha stage, you must make sure you setup the whole development environment, including a number of [project dependencies](https://github.com/bpmn-io) according to [our development setup](https://github.com/bpmn-io/dmn-js/blob/master/docs/project/SETUP.md).


## License

Use under the terms of the [dmn-js license](http://bpmn.io/license).
