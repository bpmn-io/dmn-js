import Modeler from 'src/Modeler';

import domify from 'domify';

import {
  query as domQuery,
  delegate as domDelegate
} from 'min-dom';


import { insertCSS } from 'test/helper';

insertCSS('diagram-js.css', require('diagram-js/assets/diagram-js.css'));

insertCSS('dmn-font', require('dmn-font/dist/css/dmn-embedded.css'));

insertCSS('dmn-js-shared.css',
  require('dmn-js-shared/assets/css/dmn-js-shared.css')
);

insertCSS('dmn-js-drd.css', require('dmn-js-drd/assets/css/dmn-js-drd.css'));

insertCSS('dmn-js-literal-expression.css',
  require('dmn-js-literal-expression/assets/css/dmn-js-literal-expression.css')
);

insertCSS('dmn-js-decision-table-controls.css',
  require('dmn-js-decision-table/assets/css/dmn-js-decision-table-controls.css')
);

insertCSS('dmn-js-testing.css', `
  .test-container .dmn-js-parent {
    height: 500px;
  }
`);

insertCSS('tabs.css', `
  .dmn-js-parent {
    border: solid 1px #ccc;
  }

  .tjs-container,
  .viewer-container {
    display: table;
    width: 100%;
    padding: 10px;
  }

  .editor-tabs .tab {
    display: block;
    white-space: nowrap;
    background: white;
    padding: 5px;
    margin: -1px 2px 2px 2px;
    border: solid 1px #CCC;
    border-radius: 0 0 2px 2px;
    padding: 8px;
    font-family: 'Arial', sans-serif;
    font-weight: bold;
    cursor: default;
    font-size: 14px;
    color: #444;
    flex: 0 0 1%;
  }

  .editor-tabs {
    display: flex;
    flex-direction: row;
    position: relative;
  }

  .editor-tabs .tab:first-child {
    margin-left: 5px;
  }

  .editor-tabs .tab.active {
    border-top-color: white;
  }

  .editor-tabs .tab.active,
  .editor-tabs .tab:hover {
    border-bottom: solid 3px #52b415;
    margin-bottom: 0;
  }
`);

const CLASS_NAMES = {
  drd: 'dmn-icon-lasso-tool',
  decisionTable: 'dmn-icon-decision-table',
  literalExpression: 'dmn-icon-literal-expression'
};

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


    var editor = new Modeler({
      container: $container,
      height: 500,
      width: '100%',
      common: {
        keyboard: {
          bindTo: document
        }
      }
    });

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

        const className = CLASS_NAMES[v.type];

        var tab = domify(`
          <div class="tab ${ v === activeView ? 'active' : ''}" data-id="${idx}">
            <span class="${ className }"></span>
            ${v.element.name || v.element.id}
          </div>
        `);

        $tabs.appendChild(tab);
      });
    });

    editor.importXML(diagramXML);

  });

});