# Project Setup

This document describes the necessary steps to setup a `dmn-js` development environment.

Make sure you have [git](http://git-scm.com/), [NodeJS](nodejs.org) and [npm](https://www.npmjs.org/doc/cli/npm.html) installed before you continue.


### Get Project + Dependencies

Get the following projects from the [bpmn-io](https://github.com/bpmn-io) projects on GitHub

* [dmn-js](https://github.com/bpmn-io/dmn-js)
* [table-js](https://github.com/bpmn-io/table-js)
* [dmn-moddle](https://github.com/bpmn-io/dmn-moddle)
* [moddle](https://github.com/bpmn-io/moddle)
* [moddle-xml](https://github.com/bpmn-io/moddle-xml)
* [diagram-js](https://github.com/bpmn-io/diagram-js)

and clone them into a common directory via

```
git clone git@github.com:bpmn-io/PROJECT_NAME.git
```

### Link Projects

[Link dependent projects](http://blog.nodejs.org/2011/04/06/npm-1-0-link/) between each other to pick up changes immediately.

```
.
├─dmn-js
│   └─node_modules
│       ├─table-js <link>
│       ├─diagram-js <link>
│       ├─moddle <link>
│       └─dmn-moddle <link>
├─dmn-moddle
│   └─node_modules
│       ├─moddle <link>
│       └─moddle-xml <link>
├─table-js
│   └─node_modules
│       └─diagram-js <link>
├─moddle
└─moddle-xml
    └─node_modules
        └─moddle <link>
```

#### On Linux

Use [npm-link](https://docs.npmjs.com/cli/link) or `ln -s <target> <link>`.

#### On Windows

Use `mklink /d <link> <target>` [(docs)](http://technet.microsoft.com/en-us/library/cc753194.aspx).


### Install Dependencies

Execute `npm install` on each of the projects to grab their dependencies.


### Verify Things are O.K.

Execute `grunt` on each project. Things should be fine.
