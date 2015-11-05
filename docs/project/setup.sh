#!/bin/bash

###
# Setup script to be executed in a bpmn.io project root (some empty folder chosen by YOU)
###

base=`pwd`

echo cloning repositories

git clone git@github.com:bpmn-io/diagram-js.git
git clone git@github.com:bpmn-io/moddle.git
git clone git@github.com:bpmn-io/moddle-xml.git
git clone git@github.com:bpmn-io/dmn-js.git
git clone git@github.com:bpmn-io/dmn-moddle.git
git clone git@github.com:bpmn-io/table-js.git
git clone git@github.com:bpmn-io/dmn-js-examples.git

echo done.

echo setup diagram-js

cd $base/diagram-js
npm install
npm link


echo setup table-js

cd $base/table-js
npm install
npm link
npm link diagram-js

echo setup moddle

cd $base/moddle
npm install
npm link

echo setup moddle-xml

cd $base/moddle-xml
npm install
npm link
npm link moddle

echo setup dmn-moddle

cd $base/dmn-moddle
npm install
npm link
npm link moddle
npm link moddle-xml


echo setup dmn-js

cd $base/dmn-js
npm install
npm link
npm link table-js
npm link dmn-moddle
npm link diagram-js


echo setup dmn-js-examples/modeler

cd $base/dmn-js-examples/modeler
npm install
npm link dmn-js


cd $base

echo all done.
