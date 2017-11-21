# BREAKING CHANGES

This file keeps track of features we've removed from dmn-js with the `next` refactoring. These features may need re-implementation in applications that use the new version of dmn-js:

* Automatic conversion from old (`xmlns="http://www.omg.org/spec/DMN/20151101/dmn11.xsd"`) to new (`xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd"`) DMN namespace

* Show table / show DRD options

* DmnJS -> drd parts extracted to dmn-js-drd
  * attach -> attachTo