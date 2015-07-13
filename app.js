'use strict';
/* global StylesEditor: false, selectAll: false, DecisionTable: false, DecisionTableModel: false */

function nodeListarray(els) {
  if (Array.isArray(els)) {
    return els;
  }
  var arr = [];
  for (var i = 0; i < els.length; i++) {
    arr.push(els[i]);
  }
  return arr;
}

function selectAll(selector, ctx) {
  ctx = ctx || document;
  return nodeListarray(ctx.querySelectorAll(selector));
}


















var dmnTables = {};
selectAll('.dmn-table').forEach(function (dt) {
  var tableView = new DecisionTable({
    contextMenu:            window.dmnContextMenu,
    clauseValuesEditor:     window.dmnClauseValuesEditor,
    clauseExpressionEditor: window.dmnClauseExpressionEditor,

    el: dt
  });
  dmnTables[tableView.cid] = tableView;
});

var fromScratchContainer = document.querySelector('#from-scratch');

var tableView = new DecisionTable({
  contextMenu:            window.dmnContextMenu,
  clauseValuesEditor:     window.dmnClauseValuesEditor,
  clauseExpressionEditor: window.dmnClauseExpressionEditor,

  model: new DecisionTableModel({
    // name: 'Brand new table',
    inputs: [],
    outputs: [],
    rules: []
  })
});

dmnTables[tableView.cid] = tableView;
fromScratchContainer.appendChild(tableView.el);









var editor;

function addEditor() {
  if (location.hash !== '#editor' || editor) {
    return;
  }
  var req = new XMLHttpRequest();
  req.onload = function () {
    var data = JSON.parse(this.responseText);

    editor = new StylesEditor({
      globals: {
        'brand-success':  '#5cb85c',
        'brand-info':     '#5bc0de',
        'brand-warning':  '#f0ad4e',
        'brand-danger':   '#d9534f'
      },

      variables: StylesEditor.objToStates(data),

      imports: [
        {
          directive: 'reference',
          name: 'dmn-variables'
        },
        {
          directive: 'reference',
          name: 'dmn-mixins'
        },
        {
          directive: 'reference',
          name: 'mixins/vendor-prefixes'
        },
        {
          directive: '',
          name: 'dmn-font'
        },
        {
          directive: '',
          name: 'dmn-table'
        },
        {
          directive: '',
          name: 'dmn-choice'
        },
        {
          directive: '',
          name: 'dmn-controls'
        },
        {
          directive: '',
          name: 'dmn-contextmenu'
        }
      ]
    });

    document.body.appendChild(editor.el);
    // editor.open = true;

    editor.inputEl.value = [
      '@import "dmn-js";'
    ].join('\n');

    editor.update();
  };

  req.open('get', 'styles-variables.json', true);
  req.send();
}

window.addEventListener('hashchange', addEditor);
addEditor();
