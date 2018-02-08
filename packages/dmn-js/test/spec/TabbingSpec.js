import Modeler from 'lib/Modeler';

import domify from 'domify';

import domQuery from 'min-dom/lib/query';
import domDelegate from 'min-dom/lib/delegate';


import { insertCSS } from 'test/helper';

insertCSS('diagram-js.css', require('diagram-js/assets/diagram-js.css'));

insertCSS('dmn-font',
  require('dmn-js-decision-table/node_modules/dmn-font/dist/css/dmn-embedded.css'));

insertCSS('dmn-js-drd.css', require('dmn-js-drd/assets/css/dmn-js-drd.css'));

insertCSS('dmn-js-literal-expression.css',
  require('dmn-js-literal-expression/assets/css/dmn-js-literal-expression.css'));

insertCSS('dmn-js-decision-table-controls.css',
  require('dmn-js-decision-table/assets/css/dmn-js-decision-table-controls.css'));

insertCSS('dmn-js-testing.css', `
  .test-container .dmn-js-parent {
    height: 500px;
  }
`);

insertCSS('tabs.css', `
  .editor-tabs .tab {
    display: inline-block;
    whitespace: no-wrap;
    padding: 5px;
    margin: 5px 10px 0 5px;
    background-color: #FAFAFA;
    border: solid 1px #CCC;
    border-radius: 2px;
    padding: 8px;
    font-family: 'Arial', sans-serif;
    font-weight: bold;
    cursor: default;
    font-size: 14px;
    color: #444;
  }

  .editor-tabs .tab:first-child {
    margin-left: 0;
  }

  .editor-tabs .tab.active,
  .editor-tabs .tab:hover {
    background-color: #52b415;
    border-color: #52b415;
    color: #fff;
  }
`);

var diagramXML = require('./diagram.dmn');
// var performanceXML = require('./performance.dmn');


describe('tabs', function() {

  it('should show tabs', function() {

    var $parent = domify(`
      <div class="test-container">
        <div class="editor-parent">
          <div class="editor-container"></div>
          <div class="editor-tabs"></div>
        </div>
      </div>
    `);

    document.body.appendChild($parent);

    var $container = domQuery('.editor-container', $parent);
    var $tabs = domQuery('.editor-tabs', $parent);


    var editor = new Modeler({ container: $container });

    domDelegate.bind($tabs, '.tab', 'click', function(e) {
      var target = e.delegateTarget;

      var viewIdx = parseInt(target.getAttribute('data-id'), 10);

      var view = editor.getViews()[viewIdx];

      editor.open(view);
    });


    editor.on('views.changed', function(event) {

      var { views, activeView } = event;

      // clear tabs
      $tabs.textContent = '';

      views.forEach(function(v, idx) {

        var tab = domify(`
          <div class="tab ${ v === activeView ? 'active' : ''}" data-id="${idx}">
          </div>
        `);

        tab.textContent = v.element.name || v.element.id;

        $tabs.appendChild(tab);
      });
    });

    editor.importXML(diagramXML);

  });

});