# Changelog

All notable changes to [dmn-js](https://github.com/bpmn-io/dmn-js) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 8.0.0

* `FEAT`: migrate to DMN 1.3 ([#452](https://github.com/bpmn-io/dmn-js/pull/452))
* `FEAT(drd)`: generate DMN standards compliant DI information
* `FEAT(drd)`: make alignment and distribution utilities available as editor actions
* `FIX(decision-table)`: correct placeholders shown in table footer
* `FIX(decision-table)`: do not show misleading `-` placeholder for output cells
* `FIX(drd)`: correctly handle source element ID change ([#467](https://github.com/bpmn-io/dmn-js/issues/467))
* `CHORE`: bump to `dmn-moddle@8.0.0`

### Breaking Changes

* Dropped DMN 1.1 support. To keep opening DMN 1.1 diagrams those must be migrated to DMN 1.3 before passing them over to the toolkit. Cf. [release blog post](https://bpmn.io/blog/posts/2020-dmn-js-8-0-0.html), [DMN compatibility example](https://github.com/bpmn-io/dmn-js-examples/tree/master/dmn-compatibility).
* Grapical information is now stored using standardized `DMNDI` and support for the DI vendor extension is removed.
* DI waypoints of new `dmn:Association` elements no longer point to middle of source and target and have same
  coordinates as connection waypoints.
* Renamed `updateProperties` command in `dmn-js-drd` to `element.updateProperties` to align with other libraries

## 7.4.3

* `FIX(decision-table)`: correct placeholders shown in table footer

## 7.4.2

* `FIX(decision-table)`: do not show misleading `-` placeholder for output cells

## 7.4.1

* `FIX(drd)`: correctly handle source element ID change ([#467](https://github.com/bpmn-io/dmn-js/issues/467))

## 7.4.0

* `CHORE(drd)`: make alignment and distribution utilities available as editor actions

## 8.0.0-alpha.0

* `FEAT`: migrate to DMN 1.3 ([#452](https://github.com/bpmn-io/dmn-js/pull/452))
* `FEAT(drd)`: bind current diagram to `dmn:Definitions#di`
* `CHORE`: bump to `dmn-moddle@8.0.0`

### Breaking Changes

* Dropped DMN 1.1 support. Migration to DMN 1.3 necessary (c.f. [@bpmn-io/dmn-migrate](https://github.com/bpmn-io/dmn-migrate)).
* `DrdFactory` uses `dmndi` namespace instead of `biodi`.
* DI waypoints of new dmn:Association no longer point to middle of source and target and have same
  coordinates as connection waypoints.

## 7.3.0

* `FEAT(drd)`: add grid snapping
* `FEAT(drd)`: add element to element snapping
* `FEAT(drd)`: add keyboard selection move
* `FEAT(drd)`: add alignment and distribution utilities
* `FEAT(decision-table)`: add i18n support ([#446](https://github.com/bpmn-io/dmn-js/pull/446))
* `CHORE`: bump to `diagram-js@6.3.0`

## 7.2.1

* `FIX(drd)`: fix serialization of `biodi:Waypoint` elements ([#437](https://github.com/bpmn-io/dmn-js/pull/437))
* `FIX(drd)`: allow connections to be moved with DMN elements ([#438](https://github.com/bpmn-io/dmn-js/pull/438))
* `FIX(drd)`: do not move `biodi:Edge` elements to text annotation targets ([#436](https://github.com/bpmn-io/dmn-js/pull/436))
* `FIX(drd)`: replace connection on reconnect ([#436](https://github.com/bpmn-io/dmn-js/pull/436))
* `FIX(drd)`: correct append behavior ([#439](https://github.com/bpmn-io/dmn-js/pull/439))
* `CHORE`: bump to `diagram-js@6.0.2`

## 7.2.0

* `FEAT(drd)`: inverse allow inverse connections
* `FEAT(decision-table)`: only allow standardized hit policy values
* `FEAT(decision-table)`: preserve aggregation when COLLECT is selected again
* `FEAT(decision-table)`: allow aggreation to be cleared from dropdown ([#370](https://github.com/bpmn-io/dmn-js/issues/370), [#389](https://github.com/bpmn-io/dmn-js/issues/389))
* `FEAT(decision-table)`: use JUEL as the default input expression language ([#405](https://github.com/bpmn-io/dmn-js/issues/405))
* `FIX(drd)`: correct connection rules
* `FIX(decision-table)`: correctly handle value erasing ([#826](https://github.com/camunda/camunda-modeler/issues/826))
* `FIX(decision-table)`: correctly display simple mode edit control when cell selection changes ([#341](https://github.com/bpmn-io/dmn-js/issues/341))
* `FIX(decision-table)`: do not close input on user selection ([#421](https://github.com/bpmn-io/dmn-js/issues/421))
* `FIX(decision-table)`: do not navigate when clearing pre-defined hints ([#431](https://github.com/bpmn-io/dmn-js/issues/431))
* `FIX(decision-table)`: prevent context menu jump in larger tables
* `FIX(decision-table)`: do not close context on user selection
* `CHORE`: bump to `diagram-js@6`
* `CHORE`: bump to `table-js@6.0.3`

## 7.1.0

* `FEAT(decision-table)`: add background color to even table rows ([#404](https://github.com/bpmn-io/dmn-js/issues/404))

## 7.0.1

* `FIX(decision-table)`: fix empty table layout on Firefox ([#380](https://github.com/bpmn-io/dmn-js/issues/380))

## 7.0.0

* `FEAT(drd)`: add connection previews
* `CHORE(project)`: upgrade to `babel@7`
* `CHORE(project)`: bump to `diagram-js@4`

## 6.3.3

* `FEAT(drd)`: consistently layout connection on reconnect start and end ([#398](https://github.com/bpmn-io/dmn-js/pull/398))
* `FIX(drd)`: prevent HTML injection in direct editing and search

## 6.3.2

* `FIX(project)`: fix npmignore

## 6.3.1

* `FIX(project)`: include core directory in npm packages

## 6.3.0

* `FEAT(decision-table)`: show input and output label first in editors ([#346](https://github.com/bpmn-io/dmn-js/issues/346))

## 6.2.3

* `CHORE`: correct `dmn-js-shared` repository meta-data

## 6.2.2

* `FIX`: properly destroy individual viewers on dmn-js destruction ([#392](https://github.com/bpmn-io/dmn-js/pull/392))

## 6.2.1

* `CHORE`: bump `tiny-svg` dependency to circumvent MS Edge bug
* `CHORE`: bump `selection-ranges` dependency

## 6.2.0

* `CHORE`: emit `attach` and `detach` events

## 6.1.0

* `CHORE`: bump to `diagram-js@3`

## 6.0.0

* `FEAT`: add ability to move canvas and selected elements with keyboard arrows
* `FEAT`: support `SHIFT` modifier to move elements / canvas with keyboard arrows at accelerated speed
* `FEAT`: use `Ctrl/Cmd` modifier key to move the canvas via keyboard arrows
* `CHORE`: bind DRD editor actions and keyboard shortcuts for explicitly added features only
* `CHORE`: update to [`diagram-js@3.0.0`](https://github.com/bpmn-io/diagram-js/blob/master/CHANGELOG.md#300)

### Breaking Changes

* `EditorActions` / `Keyboard` do not pull in features implicitly anymore. If you roll your own DRD editor, include features you would like to ship with manually to provide the respective actions / keyboard bindings ([`a68c9b68`](https://github.com/bpmn-io/dmn-js/commit/a68c9b68d3633d224fb3bb9809e7ce01d801d6fb))

## 5.2.0

* `CHORE`: bump to `diagram-js@2.6.1`

## 5.1.2

* `FIX`: update ChangeSupport id binding on <element.updateId> ([#367](https://github.com/bpmn-io/dmn-js/issues/367))

## 5.1.1

* `FIX`: correct focus handling in IE11 ([#361](https://github.com/bpmn-io/dmn-js/issues/361))

## 5.1.0

* `FEAT`: emit `saveXML` life-cycle events

## 5.0.0

_Republished `v5.0.0-1` as stable version_.

## 5.0.0-1

* `FIX`: don't distribute test assets

## 5.0.0-0

* `FEAT`: transpile to ES5 + ES modules
* `CHORE`: bump to `table-js@5`
* `CHORE`: bump to `diagram-js@2`

## 4.4.0

* `FEAT(decision-table)`: expose `data-row-id` and `data-col-id` in Viewer ([#357](https://github.com/bpmn-io/dmn-js/issues/357))

## 4.3.1

* `CHORE`: bump inferno dependency to `inferno@5.0.5`

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
