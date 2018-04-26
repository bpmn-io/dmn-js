# Changelog

All notable changes to [dmn-js](https://github.com/bpmn-io/dmn-js) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 4.3.0

* `FEAT(drd)`: add ability to intercept drill-down via event listener ([#353](https://github.com/bpmn-io/dmn-js/issues/353))
* `CHORE`: bump to `diagram-js@1.4.0`
* `FIX(decision-table)`: correct context menu positioning in scrolling tables

## 4.2.1

* `FIX(decision-table)`: close input editor on `ENTER`

## 4.2.0

* `CHORE`: bump to `diagram-js@1.3.0`
* `FIX(drd)`: label editing now correctly activates on element creation ([#339](https://github.com/bpmn-io/dmn-js/issues/339))
* `FIX(decision-table)`: be able to edit inputs without text ([#347](https://github.com/bpmn-io/dmn-js/issues/347))

## 4.1.0

* `FEAT`: improve copy/paste interaction with native browser behavior
* `FEAT`: improve selection with copy-paste
* `FEAT`: add ability to navigate decision properties in decision table via keyboard
* `FIX`: fix copy/paste not being possible in decision table cells and editors
* `FIX`: escape element ids in CSS selectors

## 4.0.0

### Breaking Changes

* `FIX`: deconflict styles by putting shared declarations into `dmn-js-shared.css`

## 3.0.1

#### dmn-js-decision-table

* `FIX`: don't close editor on allowed value add

## 3.0.0

### Breaking Changes

We've migrated all remaining parts of [dmn-js](https://github.com/bpmn-io/dmn-js) as well as it's foundations to ES modules:

* `CHORE`: migrate `dmn-js-drd` to ES modules
* `CHORE`: migrate to `diagram-js@1.0.0`
* `CHORE`: migrate to `inferno@5.0.0`
* `CHORE`: migrate to `table-js@5.0.0`

### Other Improvements

* `FEAT`: add keyboard controls to decision table input selects
* `FEAT`: add generic keyboard controls to context-menu like components
* `FEAT`: add ability to open decision table without input
* `FEAT`: add ability to add input if there are no inputs
* `CHORE`: improve size of pre-built bundles
* `CHORE`: cleanup styles
* `FIX`: improve css by converting HEX to RGBA values

## ...

Check `git log` for earlier history.