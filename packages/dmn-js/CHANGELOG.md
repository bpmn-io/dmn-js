# Changelog

All notable changes to [dmn-js](https://github.com/bpmn-io/dmn-js) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 14.1.1

* `FIX`: break additional table headers ([#737](https://github.com/bpmn-io/dmn-js/issues/737))

## 14.1.0

* `FEAT`: break long table headers in multiple lines ([#719](https://github.com/bpmn-io/dmn-js/issues/719))

## 14.0.2

* `DEPS`: update dependencies ([#725](https://github.com/bpmn-io/dmn-js/pull/725))

## 14.0.1

* `DEPS`: update to `diagram-js-direct-editing@2`

## 14.0.0
* `FIX`: add `type=button` to view drd button ([#721](https://github.com/bpmn-io/dmn-js/pull/721))
* `DEPS`: update to `diagram-js@11.3.0` ([#772](https://github.com/bpmn-io/dmn-js/pull/722))
* `DEPS`: update to `table-js@8.0.1` ([#772](https://github.com/bpmn-io/dmn-js/pull/722))

### Breaking Changes

* New popup menu UI introduced with `diagram-js@11`. See [`diagram-js` breaking changes and migration guide](https://github.com/bpmn-io/diagram-js/blob/develop/CHANGELOG.md#breaking-changes).

## 13.0.0

* `FEAT`: use ES2018 syntax ([#717](https://github.com/bpmn-io/bpmn-js/pull/717))

### Breaking Changes

* Migrated to ES2018 syntax. [Read the blog post with details and a migration guide](https://bpmn.io/blog/posts/2022-migration-to-es2018.html).

## 12.3.0

* `FEAT`: add missing translations ([#710](https://github.com/bpmn-io/dmn-js/pull/710), [#88](https://github.com/bpmn-io/dmn-js/issues/88))
* `DEPS`: update to `didi@8`
* `DEPS`: use `inherits-browser`
* `DEPS`: update DRD editor to `diagram-js@8.8.0`
* `DEPS`: update to `table-js@7.3.0`

## 12.2.1

* `FIX`: fix DRD SVG creation ([#708](https://github.com/bpmn-io/dmn-js/pull/708))

## 12.2.0

* `FEAT`: change default black to off black ([#701](https://github.com/bpmn-io/dmn-js/pull/701))
* `FIX`: do not display simple button without reason ([#668](https://github.com/bpmn-io/dmn-js/issues/668))
* `FIX`: complete direct editing when selection changes ([#700](https://github.com/bpmn-io/dmn-js/pull/700))
* `DEPS`: update to `diagram-js@8.7.0`

## 12.1.1

* `FIX`: clear active view during re-import ([#697](https://github.com/bpmn-io/dmn-js/issues/697))
* `FIX`: make sure Input Select options are always accessible ([#695](https://github.com/bpmn-io/dmn-js/pull/695))

## 12.1.0

* `FEAT`: add configuration for default colors in DRD ([#679](https://github.com/bpmn-io/dmn-js/issues/679))

## 12.0.1

* `FIX`: make simple duration edit work with empty cell ([#690](https://github.com/bpmn-io/dmn-js/issues/690))

## 12.0.0

* `FEAT`: remove Camunda Platform-specific features ([#673](https://github.com/bpmn-io/dmn-js/issues/673))
* `FEAT`: drop `camunda:inputVariable` support ([#680](https://github.com/bpmn-io/dmn-js/issues/680))
* `FEAT`: make data types configurable ([#677](https://github.com/bpmn-io/dmn-js/issues/677))
* `FEAT`: use FEEL data types ([#674](https://github.com/bpmn-io/dmn-js/issues/674))
* `FEAT`: allow to change expression language only when other option available ([#686](https://github.com/bpmn-io/dmn-js/issues/686))
* `FEAT`: drop Camunda Platform expression languages ([#675](https://github.com/bpmn-io/dmn-js/issues/675))
* `DEPS`: drop `camunda-dmn-moddle` ([#682](https://github.com/bpmn-io/dmn-js/issues/682))

### Breaking Changes

* `camunda` namespace moddle extension is no longer part of the package.
  Consider using [camunda/camunda-dmn-js](https://github.com/camunda/camunda-dmn-js) to support Camunda Platform.
* The input variable field is removed. Use [camunda/camunda-dmn-js](https://github.com/camunda/camunda-dmn-js)
  to support adding and modifying `camunda:inputVariable`.
* The only expression language selectable per default is FEEL.
  To change the list, pass respective ELs via `expressionLanguages`
  configuration.
* Types `integer`, `double`, and `long` have been replaced with `number`.
* Simple edit for `date` uses now FEEL date. For FEEL `date and time`,
  use `dateTime` type.

## 11.1.2

* `FIX`: fix a broken import ([#671](https://github.com/bpmn-io/dmn-js/pull/671))

## 11.1.1

* `FIX`: show context pad on top ([#657](https://github.com/bpmn-io/dmn-js/issues/657))
* `DEPS`: update to `diagram-js@7.8.2` ([#670](https://github.com/bpmn-io/dmn-js/pull/670))

## 11.1.0

* `FEAT`: use reduced color palette ([#663](https://github.com/bpmn-io/dmn-js/issues/663))
* `FEAT`: use CSS variables for fonts ([#662](https://github.com/bpmn-io/dmn-js/pull/662))
* `FIX`: keep selection of a replaced element ([#667](https://github.com/bpmn-io/dmn-js/pull/667))
* `FIX`: validate definitions ID ([#611](https://github.com/bpmn-io/dmn-js/issues/611))
* `DEPS`: update dev dependencies

## 11.0.2

* `FIX`: update simple mode button position in decision table view ([#543](https://github.com/bpmn-io/dmn-js/issues/543))
* `FIX`: consistently display decision entries in viewer and editor ([#651](https://github.com/bpmn-io/dmn-js/issues/651))
* `DEPS`: update to `table-js@7.2.0` ([f472b1f](https://github.com/bpmn-io/dmn-js/commit/f472b1f6882b47d59663a1668be71611703601fc))

## 11.0.1

* `FIX`: correctly use inter-package imports ([beaec56](https://github.com/bpmn-io/dmn-js/commit/beaec56e3b8a4fb35684ae528c007c1b52200600))

## 11.0.0

* `FEAT`: make `#fromXML`, `#saveXML`, `#saveSVG`, and `#open` APIs awaitable ([#514](https://github.com/bpmn-io/dmn-js/issues/514))
* `FIX`: correct event life-cycle of `#importXML` API for error case ([`49fcb1b`](https://github.com/bpmn-io/dmn-js/commit/49fcb1b986aa95bb7fce9935029f62bc7151ee90))
* `FIX`: fix typo in `import.done` event property `warnings` ([`4ef46e0`](https://github.com/bpmn-io/dmn-js/commit/4ef46e073f45e0bd2d09c4ea0d9cb21d4555318c))
* `CHORE`: deprecated `import.parse.complete` context payload ([`9739df4`](https://github.com/bpmn-io/dmn-js/commit/9739df4f737ed1d6f75aed22893fff1fcecdafd1))
* `CHORE`: bump to `dmn-moddle@10.0.0` ([`b9ddbad`](https://github.com/bpmn-io/dmn-js/commit/b9ddbadb1b2b245a9519af2befe84cf4a6110ab7))

### Breaking Changes

* The toolkit now requires the ES6 `Promise` to be present. To support IE11 you must polyfill it.

## 10.3.0

* `FEAT`: focus on row added via context menu ([#638](https://github.com/bpmn-io/dmn-js/pull/638))

## 10.2.2

* `DEPS`: update to `diagram-js-direct-editing@1.6.3`

## 10.2.1

* `FIX`: allow to add output if dmn:Input is missing ([#635](https://github.com/bpmn-io/dmn-js/pull/635))

## 10.2.0

### DRD

* `FEAT`: enable connect tool for text annotation ([#628](https://github.com/bpmn-io/dmn-js/pull/628))

## 10.1.0

### General

* `CHORE`: bump to `diagram-js@7.2`
* `CHORE`: bump to `table-js@7.1.0`
* `CHORE`: bump to `inferno@5.6`
* `CHORE`: build with `NODE_ENV=production`
* `CHORE`: add `npm start` script

### DRD

* `FEAT`: add hand tool ([`2249767f`](https://github.com/bpmn-io/dmn-js/commit/2249767f064c8bcb6263e6733be61ab58d3e755a))
* `FIX`: do not update association parent ([`96c2b113`](https://github.com/bpmn-io/dmn-js/commit/96c2b1130462ac77f8bf675ea8a0b9b212e40b78))

## 10.0.0

* `FEAT`: make first row and column of decision table sticky ([#606](https://github.com/bpmn-io/dmn-js/pull/606))
* `CHORE`: bump to `table-js@7`
* `CHORE`: bump to `diagram-js@7`

### Breaking Changes

* table element now wrapped in an additional container which might affect your styles

## 9.4.0

* `FEAT`: allow decision name to take empty space ([#579](https://github.com/bpmn-io/dmn-js/issues/579))
* `FEAT`: improve rule focus behavior on `ENTER` ([`e17931fb`](https://github.com/bpmn-io/dmn-js/commit/e17931fbc681c2921390522bbc8029e5a94f554a))

## 9.3.2

* `FIX`: use absolute position for InputSelect options ([#590](https://github.com/bpmn-io/dmn-js/pull/590))

## 9.3.1

* `CHORE`: bump to diagram-js@6.7.1

## 9.3.0

* `FEAT`: enable context-menu for index cells ([#555](https://github.com/bpmn-io/dmn-js/issues/555))
* `FEAT`: enable context-menu for annotations ([`eb280e52`](https://github.com/bpmn-io/dmn-js/commit/eb280e5232714d39a09d27766a6c145bd7ed2ca9))
* `FEAT`: place project logo in bottom-right corner ([#573](https://github.com/bpmn-io/dmn-js/issues/573))
* `FEAT`: allow placeholder for ContentEditable ([`79369fbf`](https://github.com/bpmn-io/dmn-js/commit/79369fbf2a7f5c6d5f650ddd5b12c566334de240))
* `FEAT`: display input/output placeholders for decision table head ([#552](https://github.com/bpmn-io/dmn-js/issues/552))
* `FIX`: make event listeners return values ([#568](https://github.com/bpmn-io/dmn-js/issues/568))
* `FIX`: update bounds on shape resize for drd ([`c838fcc4`](https://github.com/bpmn-io/dmn-js/commit/c838fcc429b897a37684c0a195a0275d3a8253cd))
* `FIX`: clear clipboard after pasting ([`01da4bec`](https://github.com/bpmn-io/dmn-js/commit/01da4bec0264a5d9ec49906cecf7882dc8d7fa39))

## 9.2.1

* `FIX`: display indicator within cell ([#562](https://github.com/bpmn-io/dmn-js/issues/562))

## 9.2.0

* `FEAT`: close select (i.a. decision table hit policy select) whenever there is user interaction outside of it ([#546](https://github.com/bpmn-io/dmn-js/issues/546), [#559](https://github.com/bpmn-io/dmn-js/issues/559))
* `FEAT`: center decision table resize column hitbox ([#554](https://github.com/bpmn-io/dmn-js/issues/554))
* `FIX`: remove unnecessary click event cancel action ([#558](https://github.com/bpmn-io/dmn-js/pull/558))

## 9.1.1

* `FIX`: broken style ([`7ac2031e`](https://github.com/bpmn-io/dmn-js/commit/7ac2031ecda2fba4a2e08c79c871663057bec59b))

## 9.1.0

* `FEAT`: align colors with Camunda Modeler ([#542](https://github.com/bpmn-io/dmn-js/pull/542))
* `FIX`: correct target indicator for drag and drop ([#557](https://github.com/bpmn-io/dmn-js/pull/557))
* `FIX`: correct layout in decision tables ([`a66d4140`](https://github.com/bpmn-io/dmn-js/commit/a66d414062e11b73ff6369f680653217f05c6f53))
* `FIX`: complete direct-editing after drill down ([#547](https://github.com/bpmn-io/dmn-js/issues/547))

## 9.0.1

* `FIX`: open input/output editing at correct position ([#545](https://github.com/bpmn-io/dmn-js/pull/545))

## 9.0.0

* `FEAT`: add decision table columns resizing ([#500](https://github.com/bpmn-io/dmn-js/issues/500))
* `FEAT`: move drag'n'drop handle to top left of decision table head cells ([`518bfd5`](https://github.com/bpmn-io/dmn-js/commit/518bfd5d403c708d8539f90ccea5223da88d6fa2))
* `FEAT`: move hit policy explanations to title prop ([`be21448`](https://github.com/bpmn-io/dmn-js/commit/be2144819ce3c70c0b638c123cd1be2c76fcb370))
* `FEAT`: wrap decision rule cells content ([`844a505`](https://github.com/bpmn-io/dmn-js/commit/844a505bd8ca3c0853e12052d1172eb64ebce569))
* `FEAT`: re-design decision table head ([`5734b49`](https://github.com/bpmn-io/dmn-js/commit/5734b4930dd6814800bf882a508f609633811315))
* `FEAT`: re-design literal expression layout ([#515](https://github.com/bpmn-io/dmn-js/issues/515))
* `FEAT`: pass actual event to blur and focus handlers for EditableComponent ([`93c1d92`](https://github.com/bpmn-io/dmn-js/commit/93c1d92f69b98579cf44dcf3d931cd76f64fe6c4))
* `FEAT`: display FEEL as default expression language for inputs ([#527](https://github.com/bpmn-io/dmn-js/issues/527))
* `FEAT`: center placeholder for empty input rules ([#533](https://github.com/bpmn-io/dmn-js/issues/533))
* `FEAT`: set `.empty` class on EditableComponent ([`f52cb3e`](https://github.com/bpmn-io/dmn-js/commit/f52cb3e6aa71a70fad831121137d302267508b84))
* `FIX`: correctly display decision table bottom borders ([#540](https://github.com/bpmn-io/dmn-js/issues/540))
* `FIX`: correct title for add output button ([#532](https://github.com/bpmn-io/dmn-js/pull/532))
* `FIX`: set correct active view when views change ([#528](https://github.com/bpmn-io/dmn-js/issues/528))
* `CHORE`: bump to dmn-moddle@9.1.0
* `CHORE`: bump to table-js@6.1.0

### Breaking Changes

* Dropped IE 11 support. Migrate to modern browsers or use 8.x series.
* Literal expression and decision table viewers no longer allow to change decision ID. Use [dmn-js-properties-panel](https://github.com/bpmn-io/dmn-js-properties-panel) or other custom module to allow that.

## 8.4.0-alpha.0

* `FEAT`: rework input/output editing ([#501](https://github.com/bpmn-io/dmn-js/issues/501))
* `FEAT`: allow to provide custom label component for List ([`f99bae4`](https://github.com/bpmn-io/dmn-js/commit/f99bae43faad675e02ac2a50370fdfb5e6c0caa8))
* `FEAT`: rework decision table head ([#497](https://github.com/bpmn-io/dmn-js/issues/497), [#498](https://github.com/bpmn-io/dmn-js/issues/498), [#499](https://github.com/bpmn-io/dmn-js/issues/499))
* `FEAT`: rework context menu for input/output columns ([#495](https://github.com/bpmn-io/dmn-js/issues/495))
* `FIX`: fire `views.changed` only on actual change ([#388](https://github.com/bpmn-io/dmn-js/issues/388))

## 8.3.1

* `FIX`: allow to connect text annotations in both directions ([#519](https://github.com/bpmn-io/dmn-js/pull/519))
* `FIX`: fix missing extension in camunda-bpmn-moddle import ([#517](https://github.com/bpmn-io/dmn-js/issues/517))
* `CHORE`: remove redundant waypoints update ([#522](https://github.com/bpmn-io/dmn-js/pull/522))

## 8.3.0

* `FEAT(drd)`: change layout of information requirements ([#492](https://github.com/bpmn-io/dmn-js/pull/492))
* `FEAT(drd)`: add auto-place feature ([#492](https://github.com/bpmn-io/dmn-js/pull/492))
* `FEAT(drd)`: connect from new shape to source on append ([#492](https://github.com/bpmn-io/dmn-js/pull/492))
* `CHORE(drd)`: bump to diagram-js@6.6.1

## 8.2.0

* `FEAT(drd)`: improve label editing ([#487](https://github.com/bpmn-io/dmn-js/pull/487))
* `FEAT(decision-table)`: set FEEL as default expression language ([#491](https://github.com/bpmn-io/dmn-js/pull/491))

## 8.1.0

* `FEAT(decision-table)`: add new rule on bottom rule \<enter> ([#345](https://github.com/bpmn-io/dmn-js/issues/345))
* `FEAT(drd)`: activate direct editing after text annotation create ([#185](https://github.com/bpmn-io/dmn-js/issues/185))
* `FIX`: update association's refs on element id change([#397](https://github.com/bpmn-io/dmn-js/issues/397))

## 8.0.2

* `CHORE`: use `min-dash#find` as polyfill for `Array.prototype.find`

## 8.0.1

* `CHORE`: bump to `dmn-moddle@8.0.3`

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

## 7.5.0

* `FEAT(decision-table)`: add new rule on bottom rule \<enter> ([#345](https://github.com/bpmn-io/dmn-js/issues/345))
* `FEAT(drd)`: activate direct editing after text annotation create ([#185](https://github.com/bpmn-io/dmn-js/issues/185))
* `FIX`: update association's refs on element id change([#397](https://github.com/bpmn-io/dmn-js/issues/397))

## 7.4.4

* `CHORE`: use `min-dash#find` as polyfill for `Array.prototype.find`

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
