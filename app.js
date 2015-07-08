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













var req = new XMLHttpRequest();
req.onload = function () {
  var data = JSON.parse(this.responseText);

  var editor = new StylesEditor({
    globals: {
      'brand-success':  '#5cb85c',
      'brand-info':     '#5bc0de',
      'brand-warning':  '#f0ad4e',
      'brand-danger':   '#d9534f'
    },

    // variables: StylesEditor.objToStates({
    //   // 'dmn-primary':             '#52b415',
    //   // 'dmn-border-color':        'desaturate(@dmn-primary, 30%)',
    //   // 'dmn-focus':               '#f9fac8',
    //   // 'dmn-success':             '@brand-success',
    //   // 'dmn-info':                '@brand-info',
    //   // 'dmn-warning':             '@brand-warning',
    //   // 'dmn-danger':              '@brand-danger',
    //   // 'dmn-gray-lighter':        '#f0f0f0',
    //   // 'dmn-gray-light':          '#c0c0c0',
    //   // 'dmn-gray':                '#a0a0a0',
    //   // 'dmn-gray-dark':           '#808080',
    //   // 'dmn-gray-darker':         '#606060',
    //   // 'dmn-table-bg':            '#fff',
    //   // 'dmn-row-even-bg':         '#efefef',
    //   // 'dmn-row-even-hover-bg':   'mix(@dmn-focus, #e0e0e0)',
    //   // 'dmn-row-odd-bg':          '#fefefe',
    //   // 'dmn-row-odd-hover-bg':    'mix(@dmn-focus, #e6e6e6)',
    //   // 'dmn-col-even-hover-bg':   '@dmn-row-even-hover-bg',
    //   // 'dmn-col-odd-hover-bg':    '@dmn-row-odd-hover-bg',
    //   // 'dmn-input-color':         'lighten(desaturate(@dmn-primary, 20%), 55%)',
    //   // 'dmn-output-color':        'lighten(desaturate(@dmn-primary, 25%), 40%)',
    //   // 'dmn-shadow-color':        'fade(@dmn-primary, 20%)'
    // }),

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
    '@import "styles";'
  ].join('\n');

  editor.update();
};

req.open('get', 'styles-variables.json', true);
req.send();
