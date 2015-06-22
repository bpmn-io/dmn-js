(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DecisionTable = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
/*global module: false, deps: false*/

var State = deps('ampersand-state');
var Collection = deps('ampersand-collection');

var CellModel = State.extend({
  props: {
    value: 'string'
  },

  session: {
    focused: {
      type: 'boolean',
      default: false
    },

    editable: {
      type: 'boolean',
      default: true
    }
  },

  derived: {
    table: {
      deps: [
        'collection',
        'collection.parent',
        'collection.parent.collection',
        'collection.parent.collection.parent'
      ],
      fn: function () {
        return this.collection.parent.collection.parent;
      }
    },

    clauseDelta: {
      deps: [
        'table',
        'collection',
        'table.inputs',
        'table.outputs'
      ],
      fn: function () {
        var delta = this.collection.indexOf(this);
        var inputs = this.table.inputs.length;
        var outputs = this.table.inputs.length + this.table.outputs.length;

        if (delta < inputs) {
          return delta;
        }
        else if (delta < outputs) {
          return delta - inputs;
        }

        return 0;
      }
    },

    type: {
      deps: [
        'table',
        'collection',
        'table.inputs',
        'table.outputs'
      ],
      cache: false,
      fn: function () {
        var delta = this.collection.indexOf(this);
        var inputs = this.table.inputs.length;
        var outputs = this.table.inputs.length + this.table.outputs.length;

        if (delta < inputs) {
          return 'input';
        }
        else if (delta < outputs) {
          return 'output';
        }

        return 'annotation';
      }
    },

    clause: {
      deps: [
        'table',
        'collection',
        'collection.length',
        'type',
        'clauseDelta'
      ],
      cache: false,
      fn: function () {
        if (this.clauseDelta < 0 || this.type === 'annotation') { return; }
        var clause = this.table[this.type +'s'].at(this.clauseDelta);
        return clause;
      }
    },

    choices: {
      deps: [
        'table',
        'collection.length',
        'type',
        'clause',
        'clauseDelta'
      ],
      cache: false,
      fn: function () {
        if (!this.clause) { return; }
        return this.clause.choices;
      }
    }
  },

  initialize: function () {
    this.on('change:focused', function () {
      if (!this.focused) { return; }
      var cid = this.cid;
      var ruleCid = this.collection.parent.cid;
      var x = 0;
      var y = 0;

      this.collection.parent.collection.forEach(function (rule, r) {
        var ruleFocused = rule.cid === ruleCid;
        if (rule.focused !== ruleFocused) {
          rule.focused = ruleFocused;
        }

        if (ruleFocused) {
          y = r;
        }

        rule.cells.forEach(function (cell, c) {
          var cellFocused = cell.cid === cid;

          if (cell.focused !== cellFocused) {
            cell.focused = cellFocused;
          }

          if (cellFocused) {
            x = c;
          }
        });
      });

      this.table.set({
        x: x,
        y: y
      });
    });
  }
});

module.exports = {
  Model: CellModel,
  Collection: Collection.extend({
    model: CellModel
  })
};

},{}],2:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false */

var View = deps('ampersand-view');
var merge = deps('lodash.merge');


var ChoiceView = require('./choice-view');
var RuleCellView = View.extend(merge({}, ChoiceView.prototype, {
  template: '<td></td>',

  bindings: merge({}, ChoiceView.prototype.bindings, {
    'model.value': {
      type: 'text'
    },

    'model.editable': {
      type: 'booleanAttribute',
      name: 'contenteditable'
    },

    'model.spellchecked': {
      type: 'booleanAttribute',
      name: 'spellcheck'
    },

    'model.type': {
      type: 'class'
    }
  }),

  events: merge({}, ChoiceView.prototype.events, {
    'contextmenu':  '_handleContextMenu',
    'click':        '_handleClick'
  }),

  _handleFocus: function () {
    ChoiceView.prototype._handleFocus.apply(this, arguments);
    this.parent.parent.hideContextMenu();
  },

  _handleClick: function () {
    this.parent.parent.hideContextMenu();
  },

  _handleContextMenu: function (evt) {
    this.parent.parent.showContextMenu(this.model, evt);
  }
}));



var RuleInputCellView = RuleCellView.extend({});

var RuleOutputCellView = RuleCellView.extend({});

var RuleAnnotationCellView = RuleCellView.extend({});



module.exports = {
  Cell:       RuleCellView,
  Input:      RuleInputCellView,
  Output:     RuleOutputCellView,
  Annotation: RuleAnnotationCellView
};

},{"./choice-view":3}],3:[function(require,module,exports){
'use strict';
/* global deps: false, require: false, module: false */
var View = deps('ampersand-view');

var SuggestionsView = require('./suggestions-view');

var suggestionsView = SuggestionsView.instance();

var specialKeys = [
  8 // backspace
];

var ChoiceView = View.extend({
  collections: {
    choices: SuggestionsView.Collection
  },

  events: {
    input: '_handleInput',
    focus: '_handleFocus',
    blur:  '_handleBlur'
  },

  session: {
    valid:          {
      default: true,
      type: 'boolean'
    },

    originalValue:  'string'
  },

  derived: {
    isOriginal: {
      deps: ['model.value', 'originalValue'],
      fn: function () {
        return this.model.value === this.originalValue;
      }
    // },

    // suggestionsView: {
    //   deps: ['suggestions'],
    //   cache: false,
    //   fn: function () {
    //     return suggestionsView();
    //     // return SuggestionsView.instance();
    //   }
    }
  },

  bindings: {
    'model.value': {
      type: function (el, value) {
        if (!value || !value.trim()) { return; }
        this.el.textContent = value.trim();
      }
    },

    'model.focused': {
      type: 'booleanClass',
      name: 'focused'
    },

    isOriginal: {
      type: 'booleanClass',
      name: 'untouched'
    }
  },

  initialize: function (options) {
    options = options || {};
    if (this.el) {
      this.el.contentEditable = true;
      this.el.spellcheck = false;
      this.originalValue = this.value = this.el.textContent.trim();
    }
    else {
      this.originalValue = this.value;
    }


    this.listenToAndRun(this.model, 'change:choices', function () {
      var choices = this.model.choices;
      if (!this.choices) {
        return;
      }
      if (!choices) {
        choices = [];
      }

      this.choices.reset(choices.map(function (choice) {
        return {value: choice};
      }));
    });

    this.suggestions = new SuggestionsView.Collection({
      parent: this.choices
    });



    var self = this;

    function resetSuggestions() {
      self.suggestions.reset(self._filter(self.value));
    }
    this.listenToAndRun(this.model, 'change:value', resetSuggestions);

    this.listenToAndRun(this.choices, 'change', resetSuggestions);

    this.listenToAndRun(this.suggestions, 'reset', function () {
      if (!suggestionsView) { return; }
      suggestionsView.el.style.display = this.suggestions.length < 2 ? 'none' : 'block';
    });


    function _handleResize() {
      self._handleResize();
    }
    if (!this.el) {
      this.once('change:el', _handleResize);
    }
    window.addEventListener('resize', _handleResize);
    this._handleResize();
  },

  _filter: function (val) {
    var filtered = this.choices
          .filter(function (choice) {
            return choice.value.indexOf(val) === 0;
          })
          .map(function (choice) {
            var chars = this.el.textContent.length;
            var val = choice.escape('value');
            var htmlStr = '<span class="highlighted">' + val.slice(0, chars) + '</span>';
            htmlStr += val.slice(chars);
            return {
              value: choice.value,
              html: htmlStr
            };
          }, this);
    return filtered;
  },

  _handleFocus: function () {
    this._handleInput();
    this.model.focused = true;
  },

  _handleBlur: function () {
    // this.model.focused = false;
  },

  _handleResize: function () {
    if (!this.el || !suggestionsView) { return; }
    var node = this.el;
    var top = node.offsetTop;
    var left = node.offsetLeft;
    var helper = suggestionsView.el;

    while ((node = node.offsetParent)) {
      if (node.offsetTop) {
        top += parseInt(node.offsetTop, 10);
      }
      if (node.offsetLeft) {
        left += parseInt(node.offsetLeft, 10);
      }
    }

    top -= helper.clientHeight;
    helper.style.top = top;
    helper.style.left = left;
  },

  _handleInput: function (evt) {
    if (evt && (specialKeys.indexOf(evt.keyCode) > -1 || evt.ctrlKey)) {
      return;
    }
    var val = this.el.textContent;

    var filtered = this._filter(val);
    // this.suggestions.reset(filtered);
    suggestionsView.show(filtered);
    this._handleResize();

    if (filtered.length === 1) {
      if (evt) {
        evt.preventDefault();
      }

      var matching = filtered[0].value;
      this.model.set({
        value: matching
      }, {
        silent: true
      });
      this.el.textContent = matching;
    }
  }
});

module.exports = ChoiceView;

},{"./suggestions-view":13}],4:[function(require,module,exports){
'use strict';
/*global module: false, deps: false*/

var State = deps('ampersand-state');
var Collection = deps('ampersand-collection');

var ClauseModel = State.extend({
  props: {
    label:    'string',
    choices:  'array',
    mapping:  'string',
    datatype: 'string'
  },

  session: {
    editable: {
      type: 'boolean',
      default: true
    },
    focused: 'boolean'
  }
});

module.exports = {
  Model: ClauseModel,
  Collection: Collection.extend({
    model: ClauseModel
  })
};

},{}],5:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false */

var View = deps('ampersand-view');
var merge = deps('lodash.merge');
var ChoiceView = require('./choice-view');



var LabelView = View.extend(merge({/*}, ChoiceView.prototype, {*/
  events: {
    'input': '_handleInput',
  },

  _handleInput: function () {
    this.model.label = this.el.textContent.trim();
  },

  render: function () {
    this.el.setAttribute('contenteditable', true);
    this.el.textContent = (this.model.label || '').trim();
  }
}));




var MappingView = View.extend(merge({/*}, ChoiceView.prototype, {*/
  events: {
    'input': '_handleInput',
  },

  _handleInput: function () {
    this.model.mapping = this.el.textContent.trim();
  },

  render: function () {
    this.el.setAttribute('contenteditable', true);
    this.el.textContent = (this.model.mapping || '').trim();
  }
}));




var ValueView = View.extend(merge({/*}, ChoiceView.prototype, {*/
  events: {
    'input': '_handleInput',
    'focus': '_handleFocus'
  },

  _handleInput: function () {
    var content = this.el.textContent.trim();

    if (content[0] === '(' && content.slice(-1) === ')') {
      this.model.choices = content
        .slice(1, -1)
        .split(',')
        .map(function (str) {
          return str.trim();
        })
        .filter(function (str) {
          return !!str;
        })
        ;
      this.model.datatype = null;
    }
    else {
      this.model.choices = null;
      this.model.datatype = content;
    }
  },

  _handleFocus: function () {

  },

  render: function () {
    this.el.setAttribute('contenteditable', true);
    var str = '';
    if (this.model.choices && this.model.choices.length) {
      str = '(' + this.model.choices.join(', ') + ')';
    }
    else {
      str = this.model.datatype;
    }
    this.el.textContent = str;
  }
}));





var requiredElement = {
  type: 'element',
  required: true
};

var ClauseView = View.extend({
  session: {
    labelEl:    requiredElement,
    mappingEl:  requiredElement,
    valueEl:    requiredElement
  },

  events: {
    'click th .ctrls': '_handleControlsClick'
  },

  _handleControlsClick: function () {

  },

  initialize: function () {
    var clause = this.model;

    var subviews = {
      label:    LabelView,
      mapping:  MappingView,
      value:    ValueView
    };

    Object.keys(subviews).forEach(function (kind) {
      this.listenToAndRun(this.model, 'change:' + kind, function () {
        if (this[kind + 'View']) {
          this.stopListening(this[kind + 'View']);
        }

        this[kind + 'View'] = new subviews[kind]({
          parent: this,
          model:  clause,
          el:     this[kind + 'El']
        }).render();
      });
    }, this);
  }
});




module.exports = ClauseView;

},{"./choice-view":3}],6:[function(require,module,exports){
'use strict';
/* global module: false, deps: false */

var View = deps('ampersand-view');
var Collection = deps('ampersand-collection');
var State = deps('ampersand-state');

var CommandModel = State.extend({
  props: {
    label: 'string',
    hint: 'string',
    icon: 'string',
    href: 'string',

    possible: {
      type: 'any',
      default: function () { return function () {}; },
      test: function (newValue) {
        if (typeof newValue !== 'function' && newValue !== false) {
          return 'must be either a function or false';
        }
      }
    },

    fn: {
      type: 'any',
      default: false,
      test: function (newValue) {
        if (typeof newValue !== 'function' && newValue !== false) {
          return 'must be either a function or false';
        }
      }
    }
  },

  derived: {
    disabled: {
      deps: ['possible'],
      cache: false,
      fn: function () {
        return typeof this.possible === 'function' ? !this.possible() : false;
      }
    }
  },

  subcommands: null,

  initialize: function (attributes) {
    this.subcommands = new CommandsCollection(attributes.subcommands || [], {
      parent: this
    });
  }
});

var CommandsCollection = Collection.extend({
  model: CommandModel
});

var ContextMenuItem = View.extend({
  autoRender: true,

  template: '<li>' +
              '<a>' +
                '<span class="icon"></span>' +
                '<span class="label"></span>' +
              '</a>' +
              '<ul class="dropdown-menu"></ul>' +
            '</li>',

  bindings: {
    'model.label': {
      type: 'text',
      selector: '.label'
    },

    'model.hint': {
      type: 'attribute',
      name: 'title'
    },

    'model.fn': {
      type: 'booleanClass',
      selector: 'a',
      no: 'disabled'
    },

    'model.disabled': {
      type: 'booleanClass',
      name: 'disabled'
    },

    'model.subcommands.length': {
      type: 'booleanClass',
      name: 'dropdown'
    },

    'model.href': {
      selector: 'a',
      name: 'href',
      type: 'attribute'
    },

    'model.icon': {
      type: function (el, value) {
        el.className = 'icon ' + value;
      },
      selector: '.icon'
    }
  },

  events: {
    click:      '_handleClick',
    mouseover:  '_handleMouseover',
    mouseout:   '_handleMouseout'
  },

  render: function () {
    this.renderWithTemplate();
    this.listenToAndRun(this.model, 'change:subcommands', function () {
      this.renderCollection(this.model.subcommands, ContextMenuItem, this.query('ul'));
    });
    return this;
  },

  _handleClick: function (evt) {
    if (this.model.fn) {
      this.parent.triggerCommand(this.model, evt);
    }
    else if (!this.model.href) {
      evt.preventDefault();
    }
  },

  _handleMouseover: function () {

  },



  _handleMouseout: function () {

  },



  triggerCommand: function (command, evt) {
    this.parent.triggerCommand(command, evt);
  }
});





var ContextMenuView = View.extend({
  autoRender: true,

  template: '<nav class="dmn-context-menu">' +
              '<div class="coordinates">' +
                '<label>Coords:</label>' +
                '<span class="x"></span>' +
                '<span class="y"></span>' +
              '</div>' +
              '<ul></ul>' +
            '</nav>',

  collections: {
    commands: CommandsCollection
  },

  session: {
    isOpen: 'boolean',
    scope:  'state'
  },

  bindings: {
    isOpen: {
      type: 'toggle'
    },
    'parent.model.x': {
      type: 'text',
      selector: 'div span.x'
    },
    'parent.model.y': {
      type: 'text',
      selector: 'div span.y'
    }
  },

  open: function (options) {
    var style = this.el.style;

    style.left = options.left + 'px';
    style.top = options.top + 'px';

    this.isOpen = true;

    this.scope = options.scope;
    var commands = options.commands || [
      // {
      //   label: 'Actions',
      //   subcommands: [
      //     {
      //       label: 'undo',
      //       icon: 'undo',
      //       fn: function () {}
      //     },
      //     {
      //       label: 'redo',
      //       icon: 'redo',
      //       fn: function () {}
      //     }
      //   ]
      // },
      {
        label: 'Cell',
        subcommands: [
          {
            label: 'clear',
            icon: 'clear',
            hint: 'Clear the content of the focused cell',
            possible: function () {
              console.info('clear possible?', arguments, this);
            },
            fn: function () {}
          }
        ]
      },
      {
        label: 'Rule',
        icon: '',
        subcommands: [
          {
            label: 'add',
            icon: 'plus',
            fn: function () {
              this.parent.model.addRule(this.scope);
            }
          },
          {
            label: 'copy',
            icon: 'copy',
            fn: function () {
              this.parent.model.copyRule(this.scope);
            },
            subcommands: [
              {
                label: 'above',
                icon: 'above',
                hint: 'Copy the rule above the focused one',
                fn: function () {
                  this.parent.model.copyRule(this.scope, -1);
                }
              },
              {
                label: 'below',
                icon: 'below',
                hint: 'Copy the rule below the focused one',
                fn: function () {
                  this.parent.model.copyRule(this.scope, 1);
                }
              }
            ]
          },
          {
            label: 'remove',
            icon: 'minus',
            hint: 'Remove the focused rule',
            fn: function () {
              this.parent.model.removeRule(this.scope);
            }
          },
          {
            label: 'clear',
            icon: 'clear',
            hint: 'Clear the focused rule',
            fn: function () {
              this.parent.model.clearRule(this.scope);
            }
          }
        ]
      },
      {
        label: 'Input',
        icon: 'input',
        subcommands: [
          {
            label: 'add',
            icon: 'plus',
            subcommands: [
              {
                label: 'before',
                icon: 'left',
                hint: 'Add an input clause before the focused one',
                fn: function () {
                  this.parent.model.addInput();
                }
              },
              {
                label: 'after',
                icon: 'right',
                hint: 'Add an input clause after the focused one',
                fn: function () {
                  this.parent.model.addInput();
                }
              }
            ]
          },
          {
            label: 'remove',
            icon: 'minus',
            fn: function () {
              this.parent.model.removeInput();
            }
          }
        ]
      },
      {
        label: 'Output',
        icon: 'output',
        subcommands: [
          {
            label: 'add',
            icon: 'plus',
            subcommands: [
              {
                label: 'before',
                icon: 'left',
                hint: 'Add an output clause before the focused one',
                fn: function () {
                  this.parent.model.addOutput();
                }
              },
              {
                label: 'after',
                icon: 'right',
                hint: 'Add an output clause after the focused one',
                fn: function () {
                  this.parent.model.addOutput();
                }
              }
            ]
          },
          {
            label: 'remove',
            icon: 'minus',
            fn: function () {
              this.parent.model.removeOutput();
            }
          }
        ]
      }
    ];

    this.commands.reset(commands);
  },

  triggerCommand: function (command, evt) {
    command.fn.call(this, evt);
    if (!command.keepOpen) {
      this.close();
    }
  },

  close: function () {
    this.isOpen = false;
  },

  render: function () {
    this.renderWithTemplate();
    this.cacheElements({
      commandsEl: 'ul'
    });
    this.commandsView = this.renderCollection(this.commands, ContextMenuItem, this.commandsEl);
    return this;
  }
});

module.exports = ContextMenuView;

},{}],7:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false */

var View = deps('ampersand-view');
var DecisionTable = require('./table-data');
var RuleView = require('./rule-view');



function toArray(els) {
  return Array.prototype.slice.apply(els);
}


function makeTd(type) {
  var el = document.createElement('td');
  el.className = type;
  return el;
}

function makeCtrls() {
  var el = document.createElement('span');
  el.className = 'ctrls';
  return el;
}

var ContextMenuView = require('./contextmenu-view');
var ClauseHeaderView = require('./clause-view');




var DecisionTableView = View.extend({
  autoRender: true,

  template: '<div class="dmn-table">' +
              '<div data-hook="controls"></div>' +
              '<header>' +
                '<h3 data-hook="table-name"></h3>' +
              '</header>' +
              '<table>' +
                '<thead>' +
                  '<tr>' +
                    '<th class="hit" rulespan="4"></th>' +
                    '<th class="input double-border-right" colspan="2">Input</th>' +
                    '<th class="output" colspan="2">Output</th>' +
                    '<th class="annotation" rulespan="4">Annotation</th>' +
                  '</tr>' +
                  '<tr class="labels"></tr>' +
                  '<tr class="values"></tr>' +
                  '<tr class="mappings"></tr>' +
                '</thead>' +
                '<tbody></tbody>' +
              '</table>' +
            '</div>',

  events: {
    'click thead .ctrls': '_handleClauseControlClick'
  },

  initialize: function () {
    this.model = this.model || new DecisionTable.Model();
    var contextMenu = this.contextMenu = new ContextMenuView({
      parent: this
    });
    this.registerSubview(contextMenu);
    document.body.appendChild(contextMenu.el);
  },

  hideContextMenu: function () {
    this.contextMenu.close();
  },

  showContextMenu: function (cellModel, evt) {
    this.contextMenu.open({
      top:    evt.clientY,
      left:   evt.clientX,
      scope:  cellModel
    });

    try {
      evt.preventDefault();
    } catch (e) {}
  },

  remove: function () {
    document.body.removeChild(this.contextMenu.el);
    return View.prototype.remove.apply(this, arguments);
  },

  update: function () {
    return this;
  },



  parseChoices: function (el) {
    if (!el) {
      return 'MISSING';
    }
    var content = el.textContent.trim();

    if (content[0] === '(' && content.slice(-1) === ')') {
      return content
        .slice(1, -1)
        .split(',')
        .map(function (str) {
          return str.trim();
        })
        .filter(function (str) {
          return !!str;
        })
        ;
    }

    return [];
  },

  parseRules: function (ruleEls) {
    return ruleEls.map(function (el) {
      return el.textContent.trim();
    });
  },

  parseTable: function () {
    var inputs = [];
    var outputs = [];
    var rules = [];

    this.queryAll('thead .labels .input').forEach(function (el, num) {
      var choiceEls = this.query('thead .values .input:nth-child(' + (num + 1) + ')');

      inputs.push({
        label:    el.textContent.trim(),
        choices:  this.parseChoices(choiceEls)
      });
    }, this);

    this.queryAll('thead .labels .output').forEach(function (el, num) {
      var choiceEls = this.query('thead .values .output:nth-child(' + (num + inputs.length + 1) + ')');

      outputs.push({
        label:    el.textContent.trim(),
        choices:  this.parseChoices(choiceEls)
      });
    }, this);

    this.queryAll('tbody tr').forEach(function (row) {
      var cells = [];
      var cellEls = row.querySelectorAll('td');

      for (var c = 1; c < cellEls.length; c++) {
        var choices = null;
        var value = cellEls[c].textContent.trim();
        var type = c <= inputs.length ? 'input' : (c < (cellEls.length - 1) ? 'output' : 'annotation');
        var oc = c - (inputs.length + 1);

        if (type === 'input' && inputs[c - 1]) {
          choices = inputs[c - 1].choices;
        }
        else if (type === 'output' && outputs[oc]) {
          choices = outputs[oc].choices;
        }

        cells.push({
          value:    value,
          choices:  choices
        });
      }

      rules.push({
        cells: cells
      });
    });

    this.model.name = this.query('h3').textContent.trim();
    this.model.inputs.reset(inputs);
    this.model.outputs.reset(outputs);
    this.model.rules.reset(rules);

    return this.toJSON();
  },

  toJSON: function () {
    return this.model.toJSON();
  },

  inputClauseViews: [],
  outputClauseViews: [],

  _headerClear: function (type) {
    toArray(this.labelsRowEl.querySelectorAll('.'+ type)).forEach(function (el) {
      this.labelsRowEl.removeChild(el);
    }, this);

    toArray(this.valuesRowEl.querySelectorAll('.'+ type)).forEach(function (el) {
      this.valuesRowEl.removeChild(el);
    }, this);

    toArray(this.mappingsRowEl.querySelectorAll('.'+ type)).forEach(function (el) {
      this.mappingsRowEl.removeChild(el);
    }, this);

    return this;
  },


  _handleClauseControlClick: function (evt) {
    var holder = evt.delegateTarget.parentNode;
    var type = holder.className;
    var el = document.createElement('ul');
    el.className = 'dmn-clause-group-controls';
    el.innerHTML = '<li><a><span class="icon plus"></span><span class="">add '+ type +'</span></a></li>';
    document.body.appendChild(el);
  },


  render: function () {
    if (!this.el) {
      this.renderWithTemplate();
    }
    else {
      this.parseTable();
      this.trigger('change:el');
    }

    if (!this.headerEl) {
      this.cacheElements({
        labelEl:          'header h3',
        headerEl:         'thead',
        bodyEl:           'tbody',
        inputsHeaderEl:   'thead tr:nth-child(1) th.input',
        outputsHeaderEl:  'thead tr:nth-child(1) th.output',
        labelsRowEl:      'thead tr.labels',
        valuesRowEl:      'thead tr.values',
        mappingsRowEl:    'thead tr.mappings'
      });


      this.inputsHeaderEl.appendChild(makeCtrls());
      this.outputsHeaderEl.appendChild(makeCtrls());
    }


    ['input', 'output'].forEach(function (type) {
      this.listenToAndRun(this.model[type + 's'], 'add reset remove', function () {

        var cols = this.model[type + 's'].length;
        if (cols > 1) {
          this[type + 'sHeaderEl'].setAttribute('colspan', cols);
        }
        else {
          this[type + 'sHeaderEl'].removeAttribute('colspan');
        }

        this._headerClear(type);
        this[type + 'ClauseViews'].forEach(function (view) {
          view.remove();
        }, this);

        this.model[type + 's'].forEach(function (clause) {
          var labelEl = makeTd(type);
          var valueEl = makeTd(type);
          var mappingEl = makeTd(type);

          var view = new ClauseHeaderView({
            labelEl:    labelEl,
            valueEl:    valueEl,
            mappingEl:  mappingEl,

            model:      clause,
            parent:     this
          });

          ['label', 'value', 'mapping'].forEach(function (kind) {
            if (type === 'input') {
              this[kind +'sRowEl'].insertBefore(view[kind + 'El'], this[kind +'sRowEl'].querySelector('.output'));
            }
            else {
              this[kind +'sRowEl'].appendChild(view[kind + 'El']);
            }
          }, this);

          this.registerSubview(view);

          this[type + 'ClauseViews'].push(view);
        }, this);
      });
    }, this);


    this.bodyEl.innerHTML = '';
    this.rulesView = this.renderCollection(this.model.rules, RuleView, this.bodyEl);

    return this.update();
  }
});

module.exports = DecisionTableView;

},{"./clause-view":5,"./contextmenu-view":6,"./rule-view":12,"./table-data":14}],8:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false */

deps('./classList');


var DecisionTableView = require('./decision-table-view');


module.exports = DecisionTableView;

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
window.selectAll = selectAll;
},{"./decision-table-view":7}],9:[function(require,module,exports){
'use strict';
/*global module: false, require: false, deps: false*/

var Clause = require('./clause-data');

var InputModel = Clause.Model.extend({});

module.exports = {
  Model: InputModel,
  Collection: Clause.Collection.extend({
    model: InputModel
  })
};

},{"./clause-data":4}],10:[function(require,module,exports){
'use strict';
/*global module: false, require: false, deps: false*/

var Clause = require('./clause-data');

var OutputModel = Clause.Model.extend({});

module.exports = {
  Model: OutputModel,
  Collection: Clause.Collection.extend({
    model: OutputModel
  })
};

},{"./clause-data":4}],11:[function(require,module,exports){
'use strict';
/*global module: false, require: false, deps: false*/

var State = deps('ampersand-state');
var Collection = deps('ampersand-collection');
var Cell = require('./cell-data');

var RuleModel = State.extend({
  session: {
    focused: 'boolean'
  },

  collections: {
    cells: Cell.Collection
  },

  derived: {
    delta: {
      dep: ['collection'],
      fn: function () {
        return 1 + this.collection.indexOf(this);
      }
    },

    inputCells: {
      dep: ['cells', 'collection.parent.inputs'],
      fn: function () {
        return this.cells.models.slice(0, this.collection.parent.inputs.length);
      }
    },

    outputCells: {
      dep: ['cells', 'collection.parent.inputs'],
      fn: function () {
        return this.cells.models.slice(this.collection.parent.inputs.length, -1);
      }
    },

    annotation: {
      dep: ['cells'],
      fn: function () {
        return this.cells.models[this.cells.length - 1];
      }
    }
  }
});

module.exports = {
  Model: RuleModel,

  Collection: Collection.extend({
    model: RuleModel,

    // initialize: function () {
    //   var table = this.parent;

    //   function ruleMapChoices(rule) {
    //     rule.cells.forEach(function (cell, c) {
    //       var clause;

    //       if (c < table.inputs.length) {
    //         clause = table.inputs.at(c);
    //       }
    //       else if (c < (rule.cells.length - 1)) {
    //         clause = table.outputs.at(c - (table.inputs.length - 0));
    //       }
    //     });
    //   }

    //   this.listenTo(table.inputs, 'reset', function (inputs) {
    //     // console.info('inputs reset', inputs/*, arguments[1], arguments[2]*/);
    //     this.forEach(ruleMapChoices);
    //   });

    //   this.listenTo(table.outputs, 'reset', function (outputs) {
    //     // console.info('outputs reset', outputs/*, arguments[1], arguments[2]*/);
    //     this.forEach(ruleMapChoices);
    //   });

    //   this.listenTo(table.inputs, 'add', function (input) {
    //     // console.info('inputs add', input/*, arguments[1], arguments[2]*/);
    //     this.forEach(ruleMapChoices);
    //   });

    //   this.listenTo(table.outputs, 'add', function (output) {
    //     // console.info('outputs add', output/*, arguments[1], arguments[2]*/);
    //     this.forEach(ruleMapChoices);
    //   });

    //   // this.listenTo(table.inputs, 'remove', function () {
    //   //   console.info('inputs remove', arguments[0]/*, arguments[1], arguments[2]*/);
    //   // });

    //   // this.listenTo(table.outputs, 'remove', function () {
    //   //   console.info('outputs remove', arguments[0]/*, arguments[1], arguments[2]*/);
    //   // });

    //   this.on('add', ruleMapChoices);

    //   this.on('reset', function () {
    //     this.forEach(ruleMapChoices);
    //   });
    // }
  })
};

},{"./cell-data":1}],12:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false */

var View = deps('ampersand-view');

var CellViews = require('./cell-view');

function elPosition(el) {
  var node = el;
  var top = node.offsetTop;
  var left = node.offsetLeft;

  while ((node = node.offsetParent)) {
    top += node.offsetTop;
    left += node.offsetLeft;
  }

  return {
    top: top,
    left: left
  };
}

var RuleView = View.extend({
  template: '<tr><td class="number">' +
              '<span class="value"></span>' +
              '<span class="ctrls"></span>' +
            '</td></tr>',

  bindings: {
    'model.delta': {
      type: 'text',
      selector: '.number .value'
    },

    'model.focused': {
      type: 'booleanClass',
      name: 'focused'
    }
  },

  derived: {
    inputs: {
      deps: [
        'parent',
        'parent.model',
        'parent.model.inputs'
      ],
      fn: function () {
        return this.parent.model.inputs;
      }
    },

    outputs: {
      deps: [
        'parent',
        'parent.model',
        'parent.model.outputs'
      ],
      fn: function () {
        return this.parent.model.outputs;
      }
    },

    annotation: {
      deps: [
        'parent',
        'parent.model',
        'parent.model.annotations'
      ],
      fn: function () {
        return this.parent.model.annotations.at(0);
      }
    },

    position: {
      deps: [
        'el',
        'parent'
      ],
      cache: false, // because of resize
      fn: function () { return elPosition(this.el); }
    }
  },

  initialize: function () {
    var root = this.model.collection.parent;
    this.listenToAndRun(root.rules, 'reset', this.render);
    this.listenToAndRun(root.inputs, 'reset', this.render);
    this.listenToAndRun(root.outputs, 'reset', this.render);
  },

  render: function () {
    this.renderWithTemplate();

    var i;
    var subview;

    for (i = 0; i < this.inputs.length; i++) {
      subview = new CellViews.Input({
        //model:  this.model.inputCells[i],
        model:  this.model.cells.at(i),
        parent: this
      });

      this.registerSubview(subview.render());
      this.el.appendChild(subview.el);
    }

    for (i = 0; i < this.outputs.length; i++) {
      subview = new CellViews.Output({
        //model:  this.model.outputCells[i],
        model:  this.model.cells.at(this.inputs.length + i),
        parent: this
      });

      this.registerSubview(subview.render());
      this.el.appendChild(subview.el);
    }
    subview = new CellViews.Annotation({
      model:  this.model.annotation,
      parent: this
    });
    this.registerSubview(subview.render());
    this.el.appendChild(subview.el);

    this.on('change:el change:parent', this.positionControls);

    // this.positionControls();

    return this;
  }
});

module.exports = RuleView;

},{"./cell-view":2}],13:[function(require,module,exports){
'use strict';
/* global module: false, deps: false */

var View = deps('ampersand-view');
var Collection = deps('ampersand-collection');
var State = deps('ampersand-state');



var SuggestionsCollection = Collection.extend({
  model: State.extend({
    props: {
      value: 'string',
      html: 'string'
    }
  })
});



var SuggestionsItemView = View.extend({
  template: '<li></li>',

  bindings: {
    'model.html': {
      type: 'innerHTML'
    }
  },

  events: {
    click: '_handleClick'
  },

  _handleClick: function () {
    if (!this.parent) { return; }
    this.parent.model.value = this.model.value;
    if (this.parent.model.value === this.model.value) {
      this.parent.model.trigger('change:value');
    }
  }
});



var SuggestionsView = View.extend({
  session: {
    visible: 'boolean'
  },

  bindings: {
    visible: {
      type: 'toggle'
    }
  },

  template: '<ul class="dmn-suggestions-helper"></ul>',

  collections: {
    suggestions: SuggestionsCollection
  },

  show: function (suggestions) {
    if (suggestions) {
      if (suggestions.isCollection && suggestions.isCollection()) {
        instance.suggestions = suggestions;
      }
      else {
        instance.suggestions.reset(suggestions);
      }
      instance.visible = suggestions.length > 1;
    }
    return this;
  },

  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.suggestions, SuggestionsItemView, this.el);
    return this;
  }
});



var instance;
SuggestionsView.instance = function (suggestions) {
  if (!instance) {
    instance = new SuggestionsView({});
    instance.render();
  }

  if (!document.body.contains(instance.el)) {
    document.body.appendChild(instance.el);
  }

  instance.show(suggestions);

  return instance;
};


SuggestionsView.Collection = SuggestionsCollection;

module.exports = SuggestionsView;

},{}],14:[function(require,module,exports){
'use strict';
/*global module: false, deps: false, require: false*/

var State = deps('ampersand-state');
var Input = require('./input-data');
var Output = require('./output-data');

var Rule = require('./rule-data');

var DecisionTableModel = State.extend({
  collections: {
    inputs:   Input.Collection,
    outputs:  Output.Collection,
    rules:    Rule.Collection
  },

  props: {
    name: 'string'
  },

  session: {
    x: {
      type: 'number',
      default: 0
    },

    y: {
      type: 'number',
      default: 0
    }
  },


  _clipboard: null,







  addRule: function (scopeCell) {
    var cells = [];
    var c;

    for (c = 0; c < this.inputs.length; c++) {
      cells.push({
        value: '',
        choices: this.inputs.at(c).choices,
        focused: c === 0
      });
    }

    for (c = 0; c < this.outputs.length; c++) {
      cells.push({
        value: '',
        choices: this.outputs.at(c).choices
      });
    }

    cells.push({
      value: ''
    });

    // var rule =
    this.rules.add({
      cells: cells
    });

    // rule.cells.forEach(function (cell, c) {
    //   var clause;
    //   if (c < this.inputs.length) {
    //     clause = this.inputs.at(c);
    //     cell.listenTo(clause, 'change:choices', function () {
    //       cell.choices = clause.choices;
    //     });
    //   }
    //   else if (c < (rule.cells.length - 1)) {
    //     clause = this.outputs.at(c - (this.inputs.length - 0));
    //     cell.listenTo(clause, 'change:choices', function () {
    //       cell.choices = clause.choices;
    //     });
    //   }
    // }, this);
  },

  removeRule: function (scopeCell) {
    this.rules.remove(scopeCell.collection.parent);
    this.rules.trigger('reset');
  },


  copyRule: function (scopeCell, upDown) {
    var ruleDelta = this.rules.indexOf(scopeCell.collection.parent);
    var rule = this.rules.at(ruleDelta);
    if (!rule) { return; }
    if (!upDown) { return; }
  },


  pasteRule: function (delta) {
    if (!this._clipboard) { return; }
    this.rules.add(this._clipboard.toJSON(), {
      at: delta
    });
  },


  _rulesCells: function (added, delta) {
    this.rules.forEach(function (rule) {
      rule.cells.add({
        choices: added.choices
      }, {
        at: delta,
        silent: true
      });
    });
    this.rules.trigger('reset');
  },

  addInput: function () {
    var delta = this.inputs.length;
    this._rulesCells(this.inputs.add({
      label:    null,
      choices:  null,
      mapping:  null,
      datatype: 'string'
    }), delta);
  },

  removeInput: function () {},



  addOutput: function () {
    var delta = this.inputs.length + this.inputs.length - 1;
    this._rulesCells(this.outputs.add({
      label:    null,
      choices:  null,
      mapping:  null,
      datatype: 'string'
    }), delta);
  },

  removeOutput: function () {}
});

window.DecisionTableModel = DecisionTableModel;

module.exports = {
  Model: DecisionTableModel
};

},{"./input-data":9,"./output-data":10,"./rule-data":11}]},{},[8])(8)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2NlbGwtZGF0YS5qcyIsInNjcmlwdHMvY2VsbC12aWV3LmpzIiwic2NyaXB0cy9jaG9pY2Utdmlldy5qcyIsInNjcmlwdHMvY2xhdXNlLWRhdGEuanMiLCJzY3JpcHRzL2NsYXVzZS12aWV3LmpzIiwic2NyaXB0cy9jb250ZXh0bWVudS12aWV3LmpzIiwic2NyaXB0cy9kZWNpc2lvbi10YWJsZS12aWV3LmpzIiwic2NyaXB0cy9pbmRleC5qcyIsInNjcmlwdHMvaW5wdXQtZGF0YS5qcyIsInNjcmlwdHMvb3V0cHV0LWRhdGEuanMiLCJzY3JpcHRzL3J1bGUtZGF0YS5qcyIsInNjcmlwdHMvcnVsZS12aWV3LmpzIiwic2NyaXB0cy9zdWdnZXN0aW9ucy12aWV3LmpzIiwic2NyaXB0cy90YWJsZS1kYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlKi9cblxudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG52YXIgQ29sbGVjdGlvbiA9IGRlcHMoJ2FtcGVyc2FuZC1jb2xsZWN0aW9uJyk7XG5cbnZhciBDZWxsTW9kZWwgPSBTdGF0ZS5leHRlbmQoe1xuICBwcm9wczoge1xuICAgIHZhbHVlOiAnc3RyaW5nJ1xuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICBmb2N1c2VkOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG5cbiAgICBlZGl0YWJsZToge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH1cbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgdGFibGU6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ2NvbGxlY3Rpb24nLFxuICAgICAgICAnY29sbGVjdGlvbi5wYXJlbnQnLFxuICAgICAgICAnY29sbGVjdGlvbi5wYXJlbnQuY29sbGVjdGlvbicsXG4gICAgICAgICdjb2xsZWN0aW9uLnBhcmVudC5jb2xsZWN0aW9uLnBhcmVudCdcbiAgICAgIF0sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xhdXNlRGVsdGE6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24nLFxuICAgICAgICAndGFibGUuaW5wdXRzJyxcbiAgICAgICAgJ3RhYmxlLm91dHB1dHMnXG4gICAgICBdLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlbHRhID0gdGhpcy5jb2xsZWN0aW9uLmluZGV4T2YodGhpcyk7XG4gICAgICAgIHZhciBpbnB1dHMgPSB0aGlzLnRhYmxlLmlucHV0cy5sZW5ndGg7XG4gICAgICAgIHZhciBvdXRwdXRzID0gdGhpcy50YWJsZS5pbnB1dHMubGVuZ3RoICsgdGhpcy50YWJsZS5vdXRwdXRzLmxlbmd0aDtcblxuICAgICAgICBpZiAoZGVsdGEgPCBpbnB1dHMpIHtcbiAgICAgICAgICByZXR1cm4gZGVsdGE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVsdGEgPCBvdXRwdXRzKSB7XG4gICAgICAgICAgcmV0dXJuIGRlbHRhIC0gaW5wdXRzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHR5cGU6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24nLFxuICAgICAgICAndGFibGUuaW5wdXRzJyxcbiAgICAgICAgJ3RhYmxlLm91dHB1dHMnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlbHRhID0gdGhpcy5jb2xsZWN0aW9uLmluZGV4T2YodGhpcyk7XG4gICAgICAgIHZhciBpbnB1dHMgPSB0aGlzLnRhYmxlLmlucHV0cy5sZW5ndGg7XG4gICAgICAgIHZhciBvdXRwdXRzID0gdGhpcy50YWJsZS5pbnB1dHMubGVuZ3RoICsgdGhpcy50YWJsZS5vdXRwdXRzLmxlbmd0aDtcblxuICAgICAgICBpZiAoZGVsdGEgPCBpbnB1dHMpIHtcbiAgICAgICAgICByZXR1cm4gJ2lucHV0JztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZWx0YSA8IG91dHB1dHMpIHtcbiAgICAgICAgICByZXR1cm4gJ291dHB1dCc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJ2Fubm90YXRpb24nO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGF1c2U6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24nLFxuICAgICAgICAnY29sbGVjdGlvbi5sZW5ndGgnLFxuICAgICAgICAndHlwZScsXG4gICAgICAgICdjbGF1c2VEZWx0YSdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jbGF1c2VEZWx0YSA8IDAgfHwgdGhpcy50eXBlID09PSAnYW5ub3RhdGlvbicpIHsgcmV0dXJuOyB9XG4gICAgICAgIHZhciBjbGF1c2UgPSB0aGlzLnRhYmxlW3RoaXMudHlwZSArJ3MnXS5hdCh0aGlzLmNsYXVzZURlbHRhKTtcbiAgICAgICAgcmV0dXJuIGNsYXVzZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2hvaWNlczoge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAnY29sbGVjdGlvbi5sZW5ndGgnLFxuICAgICAgICAndHlwZScsXG4gICAgICAgICdjbGF1c2UnLFxuICAgICAgICAnY2xhdXNlRGVsdGEnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNsYXVzZSkgeyByZXR1cm47IH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlLmNob2ljZXM7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm9uKCdjaGFuZ2U6Zm9jdXNlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5mb2N1c2VkKSB7IHJldHVybjsgfVxuICAgICAgdmFyIGNpZCA9IHRoaXMuY2lkO1xuICAgICAgdmFyIHJ1bGVDaWQgPSB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LmNpZDtcbiAgICAgIHZhciB4ID0gMDtcbiAgICAgIHZhciB5ID0gMDtcblxuICAgICAgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5jb2xsZWN0aW9uLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUsIHIpIHtcbiAgICAgICAgdmFyIHJ1bGVGb2N1c2VkID0gcnVsZS5jaWQgPT09IHJ1bGVDaWQ7XG4gICAgICAgIGlmIChydWxlLmZvY3VzZWQgIT09IHJ1bGVGb2N1c2VkKSB7XG4gICAgICAgICAgcnVsZS5mb2N1c2VkID0gcnVsZUZvY3VzZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocnVsZUZvY3VzZWQpIHtcbiAgICAgICAgICB5ID0gcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJ1bGUuY2VsbHMuZm9yRWFjaChmdW5jdGlvbiAoY2VsbCwgYykge1xuICAgICAgICAgIHZhciBjZWxsRm9jdXNlZCA9IGNlbGwuY2lkID09PSBjaWQ7XG5cbiAgICAgICAgICBpZiAoY2VsbC5mb2N1c2VkICE9PSBjZWxsRm9jdXNlZCkge1xuICAgICAgICAgICAgY2VsbC5mb2N1c2VkID0gY2VsbEZvY3VzZWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNlbGxGb2N1c2VkKSB7XG4gICAgICAgICAgICB4ID0gYztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMudGFibGUuc2V0KHtcbiAgICAgICAgeDogeCxcbiAgICAgICAgeTogeVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IENlbGxNb2RlbCxcbiAgQ29sbGVjdGlvbjogQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBDZWxsTW9kZWxcbiAgfSlcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBtZXJnZSA9IGRlcHMoJ2xvZGFzaC5tZXJnZScpO1xuXG5cbnZhciBDaG9pY2VWaWV3ID0gcmVxdWlyZSgnLi9jaG9pY2UtdmlldycpO1xudmFyIFJ1bGVDZWxsVmlldyA9IFZpZXcuZXh0ZW5kKG1lcmdlKHt9LCBDaG9pY2VWaWV3LnByb3RvdHlwZSwge1xuICB0ZW1wbGF0ZTogJzx0ZD48L3RkPicsXG5cbiAgYmluZGluZ3M6IG1lcmdlKHt9LCBDaG9pY2VWaWV3LnByb3RvdHlwZS5iaW5kaW5ncywge1xuICAgICdtb2RlbC52YWx1ZSc6IHtcbiAgICAgIHR5cGU6ICd0ZXh0J1xuICAgIH0sXG5cbiAgICAnbW9kZWwuZWRpdGFibGUnOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkF0dHJpYnV0ZScsXG4gICAgICBuYW1lOiAnY29udGVudGVkaXRhYmxlJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwuc3BlbGxjaGVja2VkJzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ3NwZWxsY2hlY2snXG4gICAgfSxcblxuICAgICdtb2RlbC50eXBlJzoge1xuICAgICAgdHlwZTogJ2NsYXNzJ1xuICAgIH1cbiAgfSksXG5cbiAgZXZlbnRzOiBtZXJnZSh7fSwgQ2hvaWNlVmlldy5wcm90b3R5cGUuZXZlbnRzLCB7XG4gICAgJ2NvbnRleHRtZW51JzogICdfaGFuZGxlQ29udGV4dE1lbnUnLFxuICAgICdjbGljayc6ICAgICAgICAnX2hhbmRsZUNsaWNrJ1xuICB9KSxcblxuICBfaGFuZGxlRm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICBDaG9pY2VWaWV3LnByb3RvdHlwZS5faGFuZGxlRm9jdXMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnBhcmVudC5wYXJlbnQuaGlkZUNvbnRleHRNZW51KCk7XG4gIH0sXG5cbiAgX2hhbmRsZUNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wYXJlbnQucGFyZW50LmhpZGVDb250ZXh0TWVudSgpO1xuICB9LFxuXG4gIF9oYW5kbGVDb250ZXh0TWVudTogZnVuY3Rpb24gKGV2dCkge1xuICAgIHRoaXMucGFyZW50LnBhcmVudC5zaG93Q29udGV4dE1lbnUodGhpcy5tb2RlbCwgZXZ0KTtcbiAgfVxufSkpO1xuXG5cblxudmFyIFJ1bGVJbnB1dENlbGxWaWV3ID0gUnVsZUNlbGxWaWV3LmV4dGVuZCh7fSk7XG5cbnZhciBSdWxlT3V0cHV0Q2VsbFZpZXcgPSBSdWxlQ2VsbFZpZXcuZXh0ZW5kKHt9KTtcblxudmFyIFJ1bGVBbm5vdGF0aW9uQ2VsbFZpZXcgPSBSdWxlQ2VsbFZpZXcuZXh0ZW5kKHt9KTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDZWxsOiAgICAgICBSdWxlQ2VsbFZpZXcsXG4gIElucHV0OiAgICAgIFJ1bGVJbnB1dENlbGxWaWV3LFxuICBPdXRwdXQ6ICAgICBSdWxlT3V0cHV0Q2VsbFZpZXcsXG4gIEFubm90YXRpb246IFJ1bGVBbm5vdGF0aW9uQ2VsbFZpZXdcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgZGVwczogZmFsc2UsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlICovXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG5cbnZhciBTdWdnZXN0aW9uc1ZpZXcgPSByZXF1aXJlKCcuL3N1Z2dlc3Rpb25zLXZpZXcnKTtcblxudmFyIHN1Z2dlc3Rpb25zVmlldyA9IFN1Z2dlc3Rpb25zVmlldy5pbnN0YW5jZSgpO1xuXG52YXIgc3BlY2lhbEtleXMgPSBbXG4gIDggLy8gYmFja3NwYWNlXG5dO1xuXG52YXIgQ2hvaWNlVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgY29sbGVjdGlvbnM6IHtcbiAgICBjaG9pY2VzOiBTdWdnZXN0aW9uc1ZpZXcuQ29sbGVjdGlvblxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgIGlucHV0OiAnX2hhbmRsZUlucHV0JyxcbiAgICBmb2N1czogJ19oYW5kbGVGb2N1cycsXG4gICAgYmx1cjogICdfaGFuZGxlQmx1cidcbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgdmFsaWQ6ICAgICAgICAgIHtcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICB9LFxuXG4gICAgb3JpZ2luYWxWYWx1ZTogICdzdHJpbmcnXG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIGlzT3JpZ2luYWw6IHtcbiAgICAgIGRlcHM6IFsnbW9kZWwudmFsdWUnLCAnb3JpZ2luYWxWYWx1ZSddLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwudmFsdWUgPT09IHRoaXMub3JpZ2luYWxWYWx1ZTtcbiAgICAgIH1cbiAgICAvLyB9LFxuXG4gICAgLy8gc3VnZ2VzdGlvbnNWaWV3OiB7XG4gICAgLy8gICBkZXBzOiBbJ3N1Z2dlc3Rpb25zJ10sXG4gICAgLy8gICBjYWNoZTogZmFsc2UsXG4gICAgLy8gICBmbjogZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICByZXR1cm4gc3VnZ2VzdGlvbnNWaWV3KCk7XG4gICAgLy8gICAgIC8vIHJldHVybiBTdWdnZXN0aW9uc1ZpZXcuaW5zdGFuY2UoKTtcbiAgICAvLyAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwudmFsdWUnOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbHVlKSB7XG4gICAgICAgIGlmICghdmFsdWUgfHwgIXZhbHVlLnRyaW0oKSkgeyByZXR1cm47IH1cbiAgICAgICAgdGhpcy5lbC50ZXh0Q29udGVudCA9IHZhbHVlLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ21vZGVsLmZvY3VzZWQnOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkNsYXNzJyxcbiAgICAgIG5hbWU6ICdmb2N1c2VkJ1xuICAgIH0sXG5cbiAgICBpc09yaWdpbmFsOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkNsYXNzJyxcbiAgICAgIG5hbWU6ICd1bnRvdWNoZWQnXG4gICAgfVxuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKHRoaXMuZWwpIHtcbiAgICAgIHRoaXMuZWwuY29udGVudEVkaXRhYmxlID0gdHJ1ZTtcbiAgICAgIHRoaXMuZWwuc3BlbGxjaGVjayA9IGZhbHNlO1xuICAgICAgdGhpcy5vcmlnaW5hbFZhbHVlID0gdGhpcy52YWx1ZSA9IHRoaXMuZWwudGV4dENvbnRlbnQudHJpbSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMub3JpZ2luYWxWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgfVxuXG5cbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWwsICdjaGFuZ2U6Y2hvaWNlcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjaG9pY2VzID0gdGhpcy5tb2RlbC5jaG9pY2VzO1xuICAgICAgaWYgKCF0aGlzLmNob2ljZXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFjaG9pY2VzKSB7XG4gICAgICAgIGNob2ljZXMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jaG9pY2VzLnJlc2V0KGNob2ljZXMubWFwKGZ1bmN0aW9uIChjaG9pY2UpIHtcbiAgICAgICAgcmV0dXJuIHt2YWx1ZTogY2hvaWNlfTtcbiAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3VnZ2VzdGlvbnMgPSBuZXcgU3VnZ2VzdGlvbnNWaWV3LkNvbGxlY3Rpb24oe1xuICAgICAgcGFyZW50OiB0aGlzLmNob2ljZXNcbiAgICB9KTtcblxuXG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiByZXNldFN1Z2dlc3Rpb25zKCkge1xuICAgICAgc2VsZi5zdWdnZXN0aW9ucy5yZXNldChzZWxmLl9maWx0ZXIoc2VsZi52YWx1ZSkpO1xuICAgIH1cbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWwsICdjaGFuZ2U6dmFsdWUnLCByZXNldFN1Z2dlc3Rpb25zKTtcblxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5jaG9pY2VzLCAnY2hhbmdlJywgcmVzZXRTdWdnZXN0aW9ucyk7XG5cbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMuc3VnZ2VzdGlvbnMsICdyZXNldCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghc3VnZ2VzdGlvbnNWaWV3KSB7IHJldHVybjsgfVxuICAgICAgc3VnZ2VzdGlvbnNWaWV3LmVsLnN0eWxlLmRpc3BsYXkgPSB0aGlzLnN1Z2dlc3Rpb25zLmxlbmd0aCA8IDIgPyAnbm9uZScgOiAnYmxvY2snO1xuICAgIH0pO1xuXG5cbiAgICBmdW5jdGlvbiBfaGFuZGxlUmVzaXplKCkge1xuICAgICAgc2VsZi5faGFuZGxlUmVzaXplKCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5lbCkge1xuICAgICAgdGhpcy5vbmNlKCdjaGFuZ2U6ZWwnLCBfaGFuZGxlUmVzaXplKTtcbiAgICB9XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIF9oYW5kbGVSZXNpemUpO1xuICAgIHRoaXMuX2hhbmRsZVJlc2l6ZSgpO1xuICB9LFxuXG4gIF9maWx0ZXI6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICB2YXIgZmlsdGVyZWQgPSB0aGlzLmNob2ljZXNcbiAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChjaG9pY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBjaG9pY2UudmFsdWUuaW5kZXhPZih2YWwpID09PSAwO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm1hcChmdW5jdGlvbiAoY2hvaWNlKSB7XG4gICAgICAgICAgICB2YXIgY2hhcnMgPSB0aGlzLmVsLnRleHRDb250ZW50Lmxlbmd0aDtcbiAgICAgICAgICAgIHZhciB2YWwgPSBjaG9pY2UuZXNjYXBlKCd2YWx1ZScpO1xuICAgICAgICAgICAgdmFyIGh0bWxTdHIgPSAnPHNwYW4gY2xhc3M9XCJoaWdobGlnaHRlZFwiPicgKyB2YWwuc2xpY2UoMCwgY2hhcnMpICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgaHRtbFN0ciArPSB2YWwuc2xpY2UoY2hhcnMpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdmFsdWU6IGNob2ljZS52YWx1ZSxcbiAgICAgICAgICAgICAgaHRtbDogaHRtbFN0clxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gZmlsdGVyZWQ7XG4gIH0sXG5cbiAgX2hhbmRsZUZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5faGFuZGxlSW5wdXQoKTtcbiAgICB0aGlzLm1vZGVsLmZvY3VzZWQgPSB0cnVlO1xuICB9LFxuXG4gIF9oYW5kbGVCbHVyOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gdGhpcy5tb2RlbC5mb2N1c2VkID0gZmFsc2U7XG4gIH0sXG5cbiAgX2hhbmRsZVJlc2l6ZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5lbCB8fCAhc3VnZ2VzdGlvbnNWaWV3KSB7IHJldHVybjsgfVxuICAgIHZhciBub2RlID0gdGhpcy5lbDtcbiAgICB2YXIgdG9wID0gbm9kZS5vZmZzZXRUb3A7XG4gICAgdmFyIGxlZnQgPSBub2RlLm9mZnNldExlZnQ7XG4gICAgdmFyIGhlbHBlciA9IHN1Z2dlc3Rpb25zVmlldy5lbDtcblxuICAgIHdoaWxlICgobm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50KSkge1xuICAgICAgaWYgKG5vZGUub2Zmc2V0VG9wKSB7XG4gICAgICAgIHRvcCArPSBwYXJzZUludChub2RlLm9mZnNldFRvcCwgMTApO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUub2Zmc2V0TGVmdCkge1xuICAgICAgICBsZWZ0ICs9IHBhcnNlSW50KG5vZGUub2Zmc2V0TGVmdCwgMTApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRvcCAtPSBoZWxwZXIuY2xpZW50SGVpZ2h0O1xuICAgIGhlbHBlci5zdHlsZS50b3AgPSB0b3A7XG4gICAgaGVscGVyLnN0eWxlLmxlZnQgPSBsZWZ0O1xuICB9LFxuXG4gIF9oYW5kbGVJbnB1dDogZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChldnQgJiYgKHNwZWNpYWxLZXlzLmluZGV4T2YoZXZ0LmtleUNvZGUpID4gLTEgfHwgZXZ0LmN0cmxLZXkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB2YWwgPSB0aGlzLmVsLnRleHRDb250ZW50O1xuXG4gICAgdmFyIGZpbHRlcmVkID0gdGhpcy5fZmlsdGVyKHZhbCk7XG4gICAgLy8gdGhpcy5zdWdnZXN0aW9ucy5yZXNldChmaWx0ZXJlZCk7XG4gICAgc3VnZ2VzdGlvbnNWaWV3LnNob3coZmlsdGVyZWQpO1xuICAgIHRoaXMuX2hhbmRsZVJlc2l6ZSgpO1xuXG4gICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKGV2dCkge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG1hdGNoaW5nID0gZmlsdGVyZWRbMF0udmFsdWU7XG4gICAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICAgIHZhbHVlOiBtYXRjaGluZ1xuICAgICAgfSwge1xuICAgICAgICBzaWxlbnQ6IHRydWVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5lbC50ZXh0Q29udGVudCA9IG1hdGNoaW5nO1xuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hvaWNlVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlKi9cblxudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG52YXIgQ29sbGVjdGlvbiA9IGRlcHMoJ2FtcGVyc2FuZC1jb2xsZWN0aW9uJyk7XG5cbnZhciBDbGF1c2VNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIHByb3BzOiB7XG4gICAgbGFiZWw6ICAgICdzdHJpbmcnLFxuICAgIGNob2ljZXM6ICAnYXJyYXknLFxuICAgIG1hcHBpbmc6ICAnc3RyaW5nJyxcbiAgICBkYXRhdHlwZTogJ3N0cmluZydcbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgZWRpdGFibGU6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuICAgIGZvY3VzZWQ6ICdib29sZWFuJ1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1vZGVsOiBDbGF1c2VNb2RlbCxcbiAgQ29sbGVjdGlvbjogQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBDbGF1c2VNb2RlbFxuICB9KVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCByZXF1aXJlOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIG1lcmdlID0gZGVwcygnbG9kYXNoLm1lcmdlJyk7XG52YXIgQ2hvaWNlVmlldyA9IHJlcXVpcmUoJy4vY2hvaWNlLXZpZXcnKTtcblxuXG5cbnZhciBMYWJlbFZpZXcgPSBWaWV3LmV4dGVuZChtZXJnZSh7Lyp9LCBDaG9pY2VWaWV3LnByb3RvdHlwZSwgeyovXG4gIGV2ZW50czoge1xuICAgICdpbnB1dCc6ICdfaGFuZGxlSW5wdXQnLFxuICB9LFxuXG4gIF9oYW5kbGVJbnB1dDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwubGFiZWwgPSB0aGlzLmVsLnRleHRDb250ZW50LnRyaW0oKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgdHJ1ZSk7XG4gICAgdGhpcy5lbC50ZXh0Q29udGVudCA9ICh0aGlzLm1vZGVsLmxhYmVsIHx8ICcnKS50cmltKCk7XG4gIH1cbn0pKTtcblxuXG5cblxudmFyIE1hcHBpbmdWaWV3ID0gVmlldy5leHRlbmQobWVyZ2Uoey8qfSwgQ2hvaWNlVmlldy5wcm90b3R5cGUsIHsqL1xuICBldmVudHM6IHtcbiAgICAnaW5wdXQnOiAnX2hhbmRsZUlucHV0JyxcbiAgfSxcblxuICBfaGFuZGxlSW5wdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vZGVsLm1hcHBpbmcgPSB0aGlzLmVsLnRleHRDb250ZW50LnRyaW0oKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgdHJ1ZSk7XG4gICAgdGhpcy5lbC50ZXh0Q29udGVudCA9ICh0aGlzLm1vZGVsLm1hcHBpbmcgfHwgJycpLnRyaW0oKTtcbiAgfVxufSkpO1xuXG5cblxuXG52YXIgVmFsdWVWaWV3ID0gVmlldy5leHRlbmQobWVyZ2Uoey8qfSwgQ2hvaWNlVmlldy5wcm90b3R5cGUsIHsqL1xuICBldmVudHM6IHtcbiAgICAnaW5wdXQnOiAnX2hhbmRsZUlucHV0JyxcbiAgICAnZm9jdXMnOiAnX2hhbmRsZUZvY3VzJ1xuICB9LFxuXG4gIF9oYW5kbGVJbnB1dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZW50ID0gdGhpcy5lbC50ZXh0Q29udGVudC50cmltKCk7XG5cbiAgICBpZiAoY29udGVudFswXSA9PT0gJygnICYmIGNvbnRlbnQuc2xpY2UoLTEpID09PSAnKScpIHtcbiAgICAgIHRoaXMubW9kZWwuY2hvaWNlcyA9IGNvbnRlbnRcbiAgICAgICAgLnNsaWNlKDEsIC0xKVxuICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICByZXR1cm4gc3RyLnRyaW0oKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgcmV0dXJuICEhc3RyO1xuICAgICAgICB9KVxuICAgICAgICA7XG4gICAgICB0aGlzLm1vZGVsLmRhdGF0eXBlID0gbnVsbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLm1vZGVsLmNob2ljZXMgPSBudWxsO1xuICAgICAgdGhpcy5tb2RlbC5kYXRhdHlwZSA9IGNvbnRlbnQ7XG4gICAgfVxuICB9LFxuXG4gIF9oYW5kbGVGb2N1czogZnVuY3Rpb24gKCkge1xuXG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsIHRydWUpO1xuICAgIHZhciBzdHIgPSAnJztcbiAgICBpZiAodGhpcy5tb2RlbC5jaG9pY2VzICYmIHRoaXMubW9kZWwuY2hvaWNlcy5sZW5ndGgpIHtcbiAgICAgIHN0ciA9ICcoJyArIHRoaXMubW9kZWwuY2hvaWNlcy5qb2luKCcsICcpICsgJyknO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHN0ciA9IHRoaXMubW9kZWwuZGF0YXR5cGU7XG4gICAgfVxuICAgIHRoaXMuZWwudGV4dENvbnRlbnQgPSBzdHI7XG4gIH1cbn0pKTtcblxuXG5cblxuXG52YXIgcmVxdWlyZWRFbGVtZW50ID0ge1xuICB0eXBlOiAnZWxlbWVudCcsXG4gIHJlcXVpcmVkOiB0cnVlXG59O1xuXG52YXIgQ2xhdXNlVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgc2Vzc2lvbjoge1xuICAgIGxhYmVsRWw6ICAgIHJlcXVpcmVkRWxlbWVudCxcbiAgICBtYXBwaW5nRWw6ICByZXF1aXJlZEVsZW1lbnQsXG4gICAgdmFsdWVFbDogICAgcmVxdWlyZWRFbGVtZW50XG4gIH0sXG5cbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIHRoIC5jdHJscyc6ICdfaGFuZGxlQ29udHJvbHNDbGljaydcbiAgfSxcblxuICBfaGFuZGxlQ29udHJvbHNDbGljazogZnVuY3Rpb24gKCkge1xuXG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjbGF1c2UgPSB0aGlzLm1vZGVsO1xuXG4gICAgdmFyIHN1YnZpZXdzID0ge1xuICAgICAgbGFiZWw6ICAgIExhYmVsVmlldyxcbiAgICAgIG1hcHBpbmc6ICBNYXBwaW5nVmlldyxcbiAgICAgIHZhbHVlOiAgICBWYWx1ZVZpZXdcbiAgICB9O1xuXG4gICAgT2JqZWN0LmtleXMoc3Vidmlld3MpLmZvckVhY2goZnVuY3Rpb24gKGtpbmQpIHtcbiAgICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbCwgJ2NoYW5nZTonICsga2luZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpc1traW5kICsgJ1ZpZXcnXSkge1xuICAgICAgICAgIHRoaXMuc3RvcExpc3RlbmluZyh0aGlzW2tpbmQgKyAnVmlldyddKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXNba2luZCArICdWaWV3J10gPSBuZXcgc3Vidmlld3Nba2luZF0oe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICBtb2RlbDogIGNsYXVzZSxcbiAgICAgICAgICBlbDogICAgIHRoaXNba2luZCArICdFbCddXG4gICAgICAgIH0pLnJlbmRlcigpO1xuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG4gIH1cbn0pO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENsYXVzZVZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG5cbnZhciBDb21tYW5kTW9kZWwgPSBTdGF0ZS5leHRlbmQoe1xuICBwcm9wczoge1xuICAgIGxhYmVsOiAnc3RyaW5nJyxcbiAgICBoaW50OiAnc3RyaW5nJyxcbiAgICBpY29uOiAnc3RyaW5nJyxcbiAgICBocmVmOiAnc3RyaW5nJyxcblxuICAgIHBvc3NpYmxlOiB7XG4gICAgICB0eXBlOiAnYW55JyxcbiAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHt9OyB9LFxuICAgICAgdGVzdDogZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgIT09ICdmdW5jdGlvbicgJiYgbmV3VmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuICdtdXN0IGJlIGVpdGhlciBhIGZ1bmN0aW9uIG9yIGZhbHNlJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBmbjoge1xuICAgICAgdHlwZTogJ2FueScsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIHRlc3Q6IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIG5ld1ZhbHVlICE9PSAnZnVuY3Rpb24nICYmIG5ld1ZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiAnbXVzdCBiZSBlaXRoZXIgYSBmdW5jdGlvbiBvciBmYWxzZSc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIGRpc2FibGVkOiB7XG4gICAgICBkZXBzOiBbJ3Bvc3NpYmxlJ10sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHRoaXMucG9zc2libGUgPT09ICdmdW5jdGlvbicgPyAhdGhpcy5wb3NzaWJsZSgpIDogZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHN1YmNvbW1hbmRzOiBudWxsLFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5zdWJjb21tYW5kcyA9IG5ldyBDb21tYW5kc0NvbGxlY3Rpb24oYXR0cmlidXRlcy5zdWJjb21tYW5kcyB8fCBbXSwge1xuICAgICAgcGFyZW50OiB0aGlzXG4gICAgfSk7XG4gIH1cbn0pO1xuXG52YXIgQ29tbWFuZHNDb2xsZWN0aW9uID0gQ29sbGVjdGlvbi5leHRlbmQoe1xuICBtb2RlbDogQ29tbWFuZE1vZGVsXG59KTtcblxudmFyIENvbnRleHRNZW51SXRlbSA9IFZpZXcuZXh0ZW5kKHtcbiAgYXV0b1JlbmRlcjogdHJ1ZSxcblxuICB0ZW1wbGF0ZTogJzxsaT4nICtcbiAgICAgICAgICAgICAgJzxhPicgK1xuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImljb25cIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibGFiZWxcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICc8L2E+JyArXG4gICAgICAgICAgICAgICc8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+PC91bD4nICtcbiAgICAgICAgICAgICc8L2xpPicsXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwubGFiZWwnOiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBzZWxlY3RvcjogJy5sYWJlbCdcbiAgICB9LFxuXG4gICAgJ21vZGVsLmhpbnQnOiB7XG4gICAgICB0eXBlOiAnYXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICd0aXRsZSdcbiAgICB9LFxuXG4gICAgJ21vZGVsLmZuJzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5DbGFzcycsXG4gICAgICBzZWxlY3RvcjogJ2EnLFxuICAgICAgbm86ICdkaXNhYmxlZCdcbiAgICB9LFxuXG4gICAgJ21vZGVsLmRpc2FibGVkJzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5DbGFzcycsXG4gICAgICBuYW1lOiAnZGlzYWJsZWQnXG4gICAgfSxcblxuICAgICdtb2RlbC5zdWJjb21tYW5kcy5sZW5ndGgnOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkNsYXNzJyxcbiAgICAgIG5hbWU6ICdkcm9wZG93bidcbiAgICB9LFxuXG4gICAgJ21vZGVsLmhyZWYnOiB7XG4gICAgICBzZWxlY3RvcjogJ2EnLFxuICAgICAgbmFtZTogJ2hyZWYnLFxuICAgICAgdHlwZTogJ2F0dHJpYnV0ZSdcbiAgICB9LFxuXG4gICAgJ21vZGVsLmljb24nOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbHVlKSB7XG4gICAgICAgIGVsLmNsYXNzTmFtZSA9ICdpY29uICcgKyB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBzZWxlY3RvcjogJy5pY29uJ1xuICAgIH1cbiAgfSxcblxuICBldmVudHM6IHtcbiAgICBjbGljazogICAgICAnX2hhbmRsZUNsaWNrJyxcbiAgICBtb3VzZW92ZXI6ICAnX2hhbmRsZU1vdXNlb3ZlcicsXG4gICAgbW91c2VvdXQ6ICAgJ19oYW5kbGVNb3VzZW91dCdcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbCwgJ2NoYW5nZTpzdWJjb21tYW5kcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLm1vZGVsLnN1YmNvbW1hbmRzLCBDb250ZXh0TWVudUl0ZW0sIHRoaXMucXVlcnkoJ3VsJykpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmICh0aGlzLm1vZGVsLmZuKSB7XG4gICAgICB0aGlzLnBhcmVudC50cmlnZ2VyQ29tbWFuZCh0aGlzLm1vZGVsLCBldnQpO1xuICAgIH1cbiAgICBlbHNlIGlmICghdGhpcy5tb2RlbC5ocmVmKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH0sXG5cbiAgX2hhbmRsZU1vdXNlb3ZlcjogZnVuY3Rpb24gKCkge1xuXG4gIH0sXG5cblxuXG4gIF9oYW5kbGVNb3VzZW91dDogZnVuY3Rpb24gKCkge1xuXG4gIH0sXG5cblxuXG4gIHRyaWdnZXJDb21tYW5kOiBmdW5jdGlvbiAoY29tbWFuZCwgZXZ0KSB7XG4gICAgdGhpcy5wYXJlbnQudHJpZ2dlckNvbW1hbmQoY29tbWFuZCwgZXZ0KTtcbiAgfVxufSk7XG5cblxuXG5cblxudmFyIENvbnRleHRNZW51VmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgYXV0b1JlbmRlcjogdHJ1ZSxcblxuICB0ZW1wbGF0ZTogJzxuYXYgY2xhc3M9XCJkbW4tY29udGV4dC1tZW51XCI+JyArXG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY29vcmRpbmF0ZXNcIj4nICtcbiAgICAgICAgICAgICAgICAnPGxhYmVsPkNvb3Jkczo8L2xhYmVsPicgK1xuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInhcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwieVwiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAnPHVsPjwvdWw+JyArXG4gICAgICAgICAgICAnPC9uYXY+JyxcblxuICBjb2xsZWN0aW9uczoge1xuICAgIGNvbW1hbmRzOiBDb21tYW5kc0NvbGxlY3Rpb25cbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgaXNPcGVuOiAnYm9vbGVhbicsXG4gICAgc2NvcGU6ICAnc3RhdGUnXG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICBpc09wZW46IHtcbiAgICAgIHR5cGU6ICd0b2dnbGUnXG4gICAgfSxcbiAgICAncGFyZW50Lm1vZGVsLngnOiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBzZWxlY3RvcjogJ2RpdiBzcGFuLngnXG4gICAgfSxcbiAgICAncGFyZW50Lm1vZGVsLnknOiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBzZWxlY3RvcjogJ2RpdiBzcGFuLnknXG4gICAgfVxuICB9LFxuXG4gIG9wZW46IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIHN0eWxlID0gdGhpcy5lbC5zdHlsZTtcblxuICAgIHN0eWxlLmxlZnQgPSBvcHRpb25zLmxlZnQgKyAncHgnO1xuICAgIHN0eWxlLnRvcCA9IG9wdGlvbnMudG9wICsgJ3B4JztcblxuICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcblxuICAgIHRoaXMuc2NvcGUgPSBvcHRpb25zLnNjb3BlO1xuICAgIHZhciBjb21tYW5kcyA9IG9wdGlvbnMuY29tbWFuZHMgfHwgW1xuICAgICAgLy8ge1xuICAgICAgLy8gICBsYWJlbDogJ0FjdGlvbnMnLFxuICAgICAgLy8gICBzdWJjb21tYW5kczogW1xuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIGxhYmVsOiAndW5kbycsXG4gICAgICAvLyAgICAgICBpY29uOiAndW5kbycsXG4gICAgICAvLyAgICAgICBmbjogZnVuY3Rpb24gKCkge31cbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIGxhYmVsOiAncmVkbycsXG4gICAgICAvLyAgICAgICBpY29uOiAncmVkbycsXG4gICAgICAvLyAgICAgICBmbjogZnVuY3Rpb24gKCkge31cbiAgICAgIC8vICAgICB9XG4gICAgICAvLyAgIF1cbiAgICAgIC8vIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnQ2VsbCcsXG4gICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdjbGVhcicsXG4gICAgICAgICAgICBpY29uOiAnY2xlYXInLFxuICAgICAgICAgICAgaGludDogJ0NsZWFyIHRoZSBjb250ZW50IG9mIHRoZSBmb2N1c2VkIGNlbGwnLFxuICAgICAgICAgICAgcG9zc2libGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5pbmZvKCdjbGVhciBwb3NzaWJsZT8nLCBhcmd1bWVudHMsIHRoaXMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdSdWxlJyxcbiAgICAgICAgaWNvbjogJycsXG4gICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuYWRkUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnY29weScsXG4gICAgICAgICAgICBpY29uOiAnY29weScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5jb3B5UnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdhYm92ZScsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2Fib3ZlJyxcbiAgICAgICAgICAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBhYm92ZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5jb3B5UnVsZSh0aGlzLnNjb3BlLCAtMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdiZWxvdycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2JlbG93JyxcbiAgICAgICAgICAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBiZWxvdyB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5jb3B5UnVsZSh0aGlzLnNjb3BlLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAncmVtb3ZlJyxcbiAgICAgICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgICAgICBoaW50OiAnUmVtb3ZlIHRoZSBmb2N1c2VkIHJ1bGUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwucmVtb3ZlUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnY2xlYXInLFxuICAgICAgICAgICAgaWNvbjogJ2NsZWFyJyxcbiAgICAgICAgICAgIGhpbnQ6ICdDbGVhciB0aGUgZm9jdXNlZCBydWxlJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmNsZWFyUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnSW5wdXQnLFxuICAgICAgICBpY29uOiAnaW5wdXQnLFxuICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYWRkJyxcbiAgICAgICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ2JlZm9yZScsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2xlZnQnLFxuICAgICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYW4gaW5wdXQgY2xhdXNlIGJlZm9yZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5hZGRJbnB1dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnYWZ0ZXInLFxuICAgICAgICAgICAgICAgIGljb246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgaGludDogJ0FkZCBhbiBpbnB1dCBjbGF1c2UgYWZ0ZXIgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuYWRkSW5wdXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAncmVtb3ZlJyxcbiAgICAgICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5yZW1vdmVJbnB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdPdXRwdXQnLFxuICAgICAgICBpY29uOiAnb3V0cHV0JyxcbiAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2FkZCcsXG4gICAgICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdiZWZvcmUnLFxuICAgICAgICAgICAgICAgIGljb246ICdsZWZ0JyxcbiAgICAgICAgICAgICAgICBoaW50OiAnQWRkIGFuIG91dHB1dCBjbGF1c2UgYmVmb3JlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmFkZE91dHB1dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnYWZ0ZXInLFxuICAgICAgICAgICAgICAgIGljb246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgaGludDogJ0FkZCBhbiBvdXRwdXQgY2xhdXNlIGFmdGVyIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmFkZE91dHB1dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdyZW1vdmUnLFxuICAgICAgICAgICAgaWNvbjogJ21pbnVzJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLnJlbW92ZU91dHB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF07XG5cbiAgICB0aGlzLmNvbW1hbmRzLnJlc2V0KGNvbW1hbmRzKTtcbiAgfSxcblxuICB0cmlnZ2VyQ29tbWFuZDogZnVuY3Rpb24gKGNvbW1hbmQsIGV2dCkge1xuICAgIGNvbW1hbmQuZm4uY2FsbCh0aGlzLCBldnQpO1xuICAgIGlmICghY29tbWFuZC5rZWVwT3Blbikge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfSxcblxuICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICB0aGlzLmNhY2hlRWxlbWVudHMoe1xuICAgICAgY29tbWFuZHNFbDogJ3VsJ1xuICAgIH0pO1xuICAgIHRoaXMuY29tbWFuZHNWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuY29tbWFuZHMsIENvbnRleHRNZW51SXRlbSwgdGhpcy5jb21tYW5kc0VsKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGV4dE1lbnVWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgRGVjaXNpb25UYWJsZSA9IHJlcXVpcmUoJy4vdGFibGUtZGF0YScpO1xudmFyIFJ1bGVWaWV3ID0gcmVxdWlyZSgnLi9ydWxlLXZpZXcnKTtcblxuXG5cbmZ1bmN0aW9uIHRvQXJyYXkoZWxzKSB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoZWxzKTtcbn1cblxuXG5mdW5jdGlvbiBtYWtlVGQodHlwZSkge1xuICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICBlbC5jbGFzc05hbWUgPSB0eXBlO1xuICByZXR1cm4gZWw7XG59XG5cbmZ1bmN0aW9uIG1ha2VDdHJscygpIHtcbiAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBlbC5jbGFzc05hbWUgPSAnY3RybHMnO1xuICByZXR1cm4gZWw7XG59XG5cbnZhciBDb250ZXh0TWVudVZpZXcgPSByZXF1aXJlKCcuL2NvbnRleHRtZW51LXZpZXcnKTtcbnZhciBDbGF1c2VIZWFkZXJWaWV3ID0gcmVxdWlyZSgnLi9jbGF1c2UtdmlldycpO1xuXG5cblxuXG52YXIgRGVjaXNpb25UYWJsZVZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIGF1dG9SZW5kZXI6IHRydWUsXG5cbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiZG1uLXRhYmxlXCI+JyArXG4gICAgICAgICAgICAgICc8ZGl2IGRhdGEtaG9vaz1cImNvbnRyb2xzXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICc8aGVhZGVyPicgK1xuICAgICAgICAgICAgICAgICc8aDMgZGF0YS1ob29rPVwidGFibGUtbmFtZVwiPjwvaDM+JyArXG4gICAgICAgICAgICAgICc8L2hlYWRlcj4nICtcbiAgICAgICAgICAgICAgJzx0YWJsZT4nICtcbiAgICAgICAgICAgICAgICAnPHRoZWFkPicgK1xuICAgICAgICAgICAgICAgICAgJzx0cj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0aCBjbGFzcz1cImhpdFwiIHJ1bGVzcGFuPVwiNFwiPjwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJpbnB1dCBkb3VibGUtYm9yZGVyLXJpZ2h0XCIgY29sc3Bhbj1cIjJcIj5JbnB1dDwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJvdXRwdXRcIiBjb2xzcGFuPVwiMlwiPk91dHB1dDwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJhbm5vdGF0aW9uXCIgcnVsZXNwYW49XCI0XCI+QW5ub3RhdGlvbjwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAnPC90cj4nICtcbiAgICAgICAgICAgICAgICAgICc8dHIgY2xhc3M9XCJsYWJlbHNcIj48L3RyPicgK1xuICAgICAgICAgICAgICAgICAgJzx0ciBjbGFzcz1cInZhbHVlc1wiPjwvdHI+JyArXG4gICAgICAgICAgICAgICAgICAnPHRyIGNsYXNzPVwibWFwcGluZ3NcIj48L3RyPicgK1xuICAgICAgICAgICAgICAgICc8L3RoZWFkPicgK1xuICAgICAgICAgICAgICAgICc8dGJvZHk+PC90Ym9keT4nICtcbiAgICAgICAgICAgICAgJzwvdGFibGU+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyxcblxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgdGhlYWQgLmN0cmxzJzogJ19oYW5kbGVDbGF1c2VDb250cm9sQ2xpY2snXG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwgPSB0aGlzLm1vZGVsIHx8IG5ldyBEZWNpc2lvblRhYmxlLk1vZGVsKCk7XG4gICAgdmFyIGNvbnRleHRNZW51ID0gdGhpcy5jb250ZXh0TWVudSA9IG5ldyBDb250ZXh0TWVudVZpZXcoe1xuICAgICAgcGFyZW50OiB0aGlzXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcoY29udGV4dE1lbnUpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGV4dE1lbnUuZWwpO1xuICB9LFxuXG4gIGhpZGVDb250ZXh0TWVudTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY29udGV4dE1lbnUuY2xvc2UoKTtcbiAgfSxcblxuICBzaG93Q29udGV4dE1lbnU6IGZ1bmN0aW9uIChjZWxsTW9kZWwsIGV2dCkge1xuICAgIHRoaXMuY29udGV4dE1lbnUub3Blbih7XG4gICAgICB0b3A6ICAgIGV2dC5jbGllbnRZLFxuICAgICAgbGVmdDogICBldnQuY2xpZW50WCxcbiAgICAgIHNjb3BlOiAgY2VsbE1vZGVsXG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfSxcblxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuY29udGV4dE1lbnUuZWwpO1xuICAgIHJldHVybiBWaWV3LnByb3RvdHlwZS5yZW1vdmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG5cbiAgcGFyc2VDaG9pY2VzOiBmdW5jdGlvbiAoZWwpIHtcbiAgICBpZiAoIWVsKSB7XG4gICAgICByZXR1cm4gJ01JU1NJTkcnO1xuICAgIH1cbiAgICB2YXIgY29udGVudCA9IGVsLnRleHRDb250ZW50LnRyaW0oKTtcblxuICAgIGlmIChjb250ZW50WzBdID09PSAnKCcgJiYgY29udGVudC5zbGljZSgtMSkgPT09ICcpJykge1xuICAgICAgcmV0dXJuIGNvbnRlbnRcbiAgICAgICAgLnNsaWNlKDEsIC0xKVxuICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICByZXR1cm4gc3RyLnRyaW0oKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgcmV0dXJuICEhc3RyO1xuICAgICAgICB9KVxuICAgICAgICA7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9LFxuXG4gIHBhcnNlUnVsZXM6IGZ1bmN0aW9uIChydWxlRWxzKSB7XG4gICAgcmV0dXJuIHJ1bGVFbHMubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgcmV0dXJuIGVsLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICB9KTtcbiAgfSxcblxuICBwYXJzZVRhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlucHV0cyA9IFtdO1xuICAgIHZhciBvdXRwdXRzID0gW107XG4gICAgdmFyIHJ1bGVzID0gW107XG5cbiAgICB0aGlzLnF1ZXJ5QWxsKCd0aGVhZCAubGFiZWxzIC5pbnB1dCcpLmZvckVhY2goZnVuY3Rpb24gKGVsLCBudW0pIHtcbiAgICAgIHZhciBjaG9pY2VFbHMgPSB0aGlzLnF1ZXJ5KCd0aGVhZCAudmFsdWVzIC5pbnB1dDpudGgtY2hpbGQoJyArIChudW0gKyAxKSArICcpJyk7XG5cbiAgICAgIGlucHV0cy5wdXNoKHtcbiAgICAgICAgbGFiZWw6ICAgIGVsLnRleHRDb250ZW50LnRyaW0oKSxcbiAgICAgICAgY2hvaWNlczogIHRoaXMucGFyc2VDaG9pY2VzKGNob2ljZUVscylcbiAgICAgIH0pO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdGhpcy5xdWVyeUFsbCgndGhlYWQgLmxhYmVscyAub3V0cHV0JykuZm9yRWFjaChmdW5jdGlvbiAoZWwsIG51bSkge1xuICAgICAgdmFyIGNob2ljZUVscyA9IHRoaXMucXVlcnkoJ3RoZWFkIC52YWx1ZXMgLm91dHB1dDpudGgtY2hpbGQoJyArIChudW0gKyBpbnB1dHMubGVuZ3RoICsgMSkgKyAnKScpO1xuXG4gICAgICBvdXRwdXRzLnB1c2goe1xuICAgICAgICBsYWJlbDogICAgZWwudGV4dENvbnRlbnQudHJpbSgpLFxuICAgICAgICBjaG9pY2VzOiAgdGhpcy5wYXJzZUNob2ljZXMoY2hvaWNlRWxzKVxuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0aGlzLnF1ZXJ5QWxsKCd0Ym9keSB0cicpLmZvckVhY2goZnVuY3Rpb24gKHJvdykge1xuICAgICAgdmFyIGNlbGxzID0gW107XG4gICAgICB2YXIgY2VsbEVscyA9IHJvdy5xdWVyeVNlbGVjdG9yQWxsKCd0ZCcpO1xuXG4gICAgICBmb3IgKHZhciBjID0gMTsgYyA8IGNlbGxFbHMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgdmFyIGNob2ljZXMgPSBudWxsO1xuICAgICAgICB2YXIgdmFsdWUgPSBjZWxsRWxzW2NdLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgdmFyIHR5cGUgPSBjIDw9IGlucHV0cy5sZW5ndGggPyAnaW5wdXQnIDogKGMgPCAoY2VsbEVscy5sZW5ndGggLSAxKSA/ICdvdXRwdXQnIDogJ2Fubm90YXRpb24nKTtcbiAgICAgICAgdmFyIG9jID0gYyAtIChpbnB1dHMubGVuZ3RoICsgMSk7XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICdpbnB1dCcgJiYgaW5wdXRzW2MgLSAxXSkge1xuICAgICAgICAgIGNob2ljZXMgPSBpbnB1dHNbYyAtIDFdLmNob2ljZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ291dHB1dCcgJiYgb3V0cHV0c1tvY10pIHtcbiAgICAgICAgICBjaG9pY2VzID0gb3V0cHV0c1tvY10uY2hvaWNlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbGxzLnB1c2goe1xuICAgICAgICAgIHZhbHVlOiAgICB2YWx1ZSxcbiAgICAgICAgICBjaG9pY2VzOiAgY2hvaWNlc1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcnVsZXMucHVzaCh7XG4gICAgICAgIGNlbGxzOiBjZWxsc1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm1vZGVsLm5hbWUgPSB0aGlzLnF1ZXJ5KCdoMycpLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICB0aGlzLm1vZGVsLmlucHV0cy5yZXNldChpbnB1dHMpO1xuICAgIHRoaXMubW9kZWwub3V0cHV0cy5yZXNldChvdXRwdXRzKTtcbiAgICB0aGlzLm1vZGVsLnJ1bGVzLnJlc2V0KHJ1bGVzKTtcblxuICAgIHJldHVybiB0aGlzLnRvSlNPTigpO1xuICB9LFxuXG4gIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsLnRvSlNPTigpO1xuICB9LFxuXG4gIGlucHV0Q2xhdXNlVmlld3M6IFtdLFxuICBvdXRwdXRDbGF1c2VWaWV3czogW10sXG5cbiAgX2hlYWRlckNsZWFyOiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHRvQXJyYXkodGhpcy5sYWJlbHNSb3dFbC5xdWVyeVNlbGVjdG9yQWxsKCcuJysgdHlwZSkpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICB0aGlzLmxhYmVsc1Jvd0VsLnJlbW92ZUNoaWxkKGVsKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRvQXJyYXkodGhpcy52YWx1ZXNSb3dFbC5xdWVyeVNlbGVjdG9yQWxsKCcuJysgdHlwZSkpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICB0aGlzLnZhbHVlc1Jvd0VsLnJlbW92ZUNoaWxkKGVsKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRvQXJyYXkodGhpcy5tYXBwaW5nc1Jvd0VsLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nKyB0eXBlKSkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHRoaXMubWFwcGluZ3NSb3dFbC5yZW1vdmVDaGlsZChlbCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIF9oYW5kbGVDbGF1c2VDb250cm9sQ2xpY2s6IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgaG9sZGVyID0gZXZ0LmRlbGVnYXRlVGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgdmFyIHR5cGUgPSBob2xkZXIuY2xhc3NOYW1lO1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgZWwuY2xhc3NOYW1lID0gJ2Rtbi1jbGF1c2UtZ3JvdXAtY29udHJvbHMnO1xuICAgIGVsLmlubmVySFRNTCA9ICc8bGk+PGE+PHNwYW4gY2xhc3M9XCJpY29uIHBsdXNcIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJcIj5hZGQgJysgdHlwZSArJzwvc3Bhbj48L2E+PC9saT4nO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuICB9LFxuXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmVsKSB7XG4gICAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMucGFyc2VUYWJsZSgpO1xuICAgICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2U6ZWwnKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGVhZGVyRWwpIHtcbiAgICAgIHRoaXMuY2FjaGVFbGVtZW50cyh7XG4gICAgICAgIGxhYmVsRWw6ICAgICAgICAgICdoZWFkZXIgaDMnLFxuICAgICAgICBoZWFkZXJFbDogICAgICAgICAndGhlYWQnLFxuICAgICAgICBib2R5RWw6ICAgICAgICAgICAndGJvZHknLFxuICAgICAgICBpbnB1dHNIZWFkZXJFbDogICAndGhlYWQgdHI6bnRoLWNoaWxkKDEpIHRoLmlucHV0JyxcbiAgICAgICAgb3V0cHV0c0hlYWRlckVsOiAgJ3RoZWFkIHRyOm50aC1jaGlsZCgxKSB0aC5vdXRwdXQnLFxuICAgICAgICBsYWJlbHNSb3dFbDogICAgICAndGhlYWQgdHIubGFiZWxzJyxcbiAgICAgICAgdmFsdWVzUm93RWw6ICAgICAgJ3RoZWFkIHRyLnZhbHVlcycsXG4gICAgICAgIG1hcHBpbmdzUm93RWw6ICAgICd0aGVhZCB0ci5tYXBwaW5ncydcbiAgICAgIH0pO1xuXG5cbiAgICAgIHRoaXMuaW5wdXRzSGVhZGVyRWwuYXBwZW5kQ2hpbGQobWFrZUN0cmxzKCkpO1xuICAgICAgdGhpcy5vdXRwdXRzSGVhZGVyRWwuYXBwZW5kQ2hpbGQobWFrZUN0cmxzKCkpO1xuICAgIH1cblxuXG4gICAgWydpbnB1dCcsICdvdXRwdXQnXS5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWxbdHlwZSArICdzJ10sICdhZGQgcmVzZXQgcmVtb3ZlJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBjb2xzID0gdGhpcy5tb2RlbFt0eXBlICsgJ3MnXS5sZW5ndGg7XG4gICAgICAgIGlmIChjb2xzID4gMSkge1xuICAgICAgICAgIHRoaXNbdHlwZSArICdzSGVhZGVyRWwnXS5zZXRBdHRyaWJ1dGUoJ2NvbHNwYW4nLCBjb2xzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzW3R5cGUgKyAnc0hlYWRlckVsJ10ucmVtb3ZlQXR0cmlidXRlKCdjb2xzcGFuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oZWFkZXJDbGVhcih0eXBlKTtcbiAgICAgICAgdGhpc1t0eXBlICsgJ0NsYXVzZVZpZXdzJ10uZm9yRWFjaChmdW5jdGlvbiAodmlldykge1xuICAgICAgICAgIHZpZXcucmVtb3ZlKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubW9kZWxbdHlwZSArICdzJ10uZm9yRWFjaChmdW5jdGlvbiAoY2xhdXNlKSB7XG4gICAgICAgICAgdmFyIGxhYmVsRWwgPSBtYWtlVGQodHlwZSk7XG4gICAgICAgICAgdmFyIHZhbHVlRWwgPSBtYWtlVGQodHlwZSk7XG4gICAgICAgICAgdmFyIG1hcHBpbmdFbCA9IG1ha2VUZCh0eXBlKTtcblxuICAgICAgICAgIHZhciB2aWV3ID0gbmV3IENsYXVzZUhlYWRlclZpZXcoe1xuICAgICAgICAgICAgbGFiZWxFbDogICAgbGFiZWxFbCxcbiAgICAgICAgICAgIHZhbHVlRWw6ICAgIHZhbHVlRWwsXG4gICAgICAgICAgICBtYXBwaW5nRWw6ICBtYXBwaW5nRWwsXG5cbiAgICAgICAgICAgIG1vZGVsOiAgICAgIGNsYXVzZSxcbiAgICAgICAgICAgIHBhcmVudDogICAgIHRoaXNcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIFsnbGFiZWwnLCAndmFsdWUnLCAnbWFwcGluZyddLmZvckVhY2goZnVuY3Rpb24gKGtpbmQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnaW5wdXQnKSB7XG4gICAgICAgICAgICAgIHRoaXNba2luZCArJ3NSb3dFbCddLmluc2VydEJlZm9yZSh2aWV3W2tpbmQgKyAnRWwnXSwgdGhpc1traW5kICsnc1Jvd0VsJ10ucXVlcnlTZWxlY3RvcignLm91dHB1dCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzW2tpbmQgKydzUm93RWwnXS5hcHBlbmRDaGlsZCh2aWV3W2tpbmQgKyAnRWwnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcblxuICAgICAgICAgIHRoaXNbdHlwZSArICdDbGF1c2VWaWV3cyddLnB1c2godmlldyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cblxuICAgIHRoaXMuYm9keUVsLmlubmVySFRNTCA9ICcnO1xuICAgIHRoaXMucnVsZXNWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMubW9kZWwucnVsZXMsIFJ1bGVWaWV3LCB0aGlzLmJvZHlFbCk7XG5cbiAgICByZXR1cm4gdGhpcy51cGRhdGUoKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVjaXNpb25UYWJsZVZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlICovXG5cbmRlcHMoJy4vY2xhc3NMaXN0Jyk7XG5cblxudmFyIERlY2lzaW9uVGFibGVWaWV3ID0gcmVxdWlyZSgnLi9kZWNpc2lvbi10YWJsZS12aWV3Jyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBEZWNpc2lvblRhYmxlVmlldztcblxuZnVuY3Rpb24gbm9kZUxpc3RhcnJheShlbHMpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZWxzKSkge1xuICAgIHJldHVybiBlbHM7XG4gIH1cbiAgdmFyIGFyciA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVscy5sZW5ndGg7IGkrKykge1xuICAgIGFyci5wdXNoKGVsc1tpXSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gc2VsZWN0QWxsKHNlbGVjdG9yLCBjdHgpIHtcbiAgY3R4ID0gY3R4IHx8IGRvY3VtZW50O1xuICByZXR1cm4gbm9kZUxpc3RhcnJheShjdHgucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxud2luZG93LnNlbGVjdEFsbCA9IHNlbGVjdEFsbDsiLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6IGZhbHNlLCByZXF1aXJlOiBmYWxzZSwgZGVwczogZmFsc2UqL1xuXG52YXIgQ2xhdXNlID0gcmVxdWlyZSgnLi9jbGF1c2UtZGF0YScpO1xuXG52YXIgSW5wdXRNb2RlbCA9IENsYXVzZS5Nb2RlbC5leHRlbmQoe30pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IElucHV0TW9kZWwsXG4gIENvbGxlY3Rpb246IENsYXVzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IElucHV0TW9kZWxcbiAgfSlcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6IGZhbHNlLCByZXF1aXJlOiBmYWxzZSwgZGVwczogZmFsc2UqL1xuXG52YXIgQ2xhdXNlID0gcmVxdWlyZSgnLi9jbGF1c2UtZGF0YScpO1xuXG52YXIgT3V0cHV0TW9kZWwgPSBDbGF1c2UuTW9kZWwuZXh0ZW5kKHt9KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1vZGVsOiBPdXRwdXRNb2RlbCxcbiAgQ29sbGVjdGlvbjogQ2xhdXNlLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICBtb2RlbDogT3V0cHV0TW9kZWxcbiAgfSlcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6IGZhbHNlLCByZXF1aXJlOiBmYWxzZSwgZGVwczogZmFsc2UqL1xuXG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcbnZhciBDZWxsID0gcmVxdWlyZSgnLi9jZWxsLWRhdGEnKTtcblxudmFyIFJ1bGVNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIHNlc3Npb246IHtcbiAgICBmb2N1c2VkOiAnYm9vbGVhbidcbiAgfSxcblxuICBjb2xsZWN0aW9uczoge1xuICAgIGNlbGxzOiBDZWxsLkNvbGxlY3Rpb25cbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgZGVsdGE6IHtcbiAgICAgIGRlcDogWydjb2xsZWN0aW9uJ10sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gMSArIHRoaXMuY29sbGVjdGlvbi5pbmRleE9mKHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBpbnB1dENlbGxzOiB7XG4gICAgICBkZXA6IFsnY2VsbHMnLCAnY29sbGVjdGlvbi5wYXJlbnQuaW5wdXRzJ10sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxscy5tb2RlbHMuc2xpY2UoMCwgdGhpcy5jb2xsZWN0aW9uLnBhcmVudC5pbnB1dHMubGVuZ3RoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgb3V0cHV0Q2VsbHM6IHtcbiAgICAgIGRlcDogWydjZWxscycsICdjb2xsZWN0aW9uLnBhcmVudC5pbnB1dHMnXSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNlbGxzLm1vZGVscy5zbGljZSh0aGlzLmNvbGxlY3Rpb24ucGFyZW50LmlucHV0cy5sZW5ndGgsIC0xKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYW5ub3RhdGlvbjoge1xuICAgICAgZGVwOiBbJ2NlbGxzJ10sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxscy5tb2RlbHNbdGhpcy5jZWxscy5sZW5ndGggLSAxXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IFJ1bGVNb2RlbCxcblxuICBDb2xsZWN0aW9uOiBDb2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IFJ1bGVNb2RlbCxcblxuICAgIC8vIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgIHZhciB0YWJsZSA9IHRoaXMucGFyZW50O1xuXG4gICAgLy8gICBmdW5jdGlvbiBydWxlTWFwQ2hvaWNlcyhydWxlKSB7XG4gICAgLy8gICAgIHJ1bGUuY2VsbHMuZm9yRWFjaChmdW5jdGlvbiAoY2VsbCwgYykge1xuICAgIC8vICAgICAgIHZhciBjbGF1c2U7XG5cbiAgICAvLyAgICAgICBpZiAoYyA8IHRhYmxlLmlucHV0cy5sZW5ndGgpIHtcbiAgICAvLyAgICAgICAgIGNsYXVzZSA9IHRhYmxlLmlucHV0cy5hdChjKTtcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgICAgZWxzZSBpZiAoYyA8IChydWxlLmNlbGxzLmxlbmd0aCAtIDEpKSB7XG4gICAgLy8gICAgICAgICBjbGF1c2UgPSB0YWJsZS5vdXRwdXRzLmF0KGMgLSAodGFibGUuaW5wdXRzLmxlbmd0aCAtIDApKTtcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgIH0pO1xuICAgIC8vICAgfVxuXG4gICAgLy8gICB0aGlzLmxpc3RlblRvKHRhYmxlLmlucHV0cywgJ3Jlc2V0JywgZnVuY3Rpb24gKGlucHV0cykge1xuICAgIC8vICAgICAvLyBjb25zb2xlLmluZm8oJ2lucHV0cyByZXNldCcsIGlucHV0cy8qLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSovKTtcbiAgICAvLyAgICAgdGhpcy5mb3JFYWNoKHJ1bGVNYXBDaG9pY2VzKTtcbiAgICAvLyAgIH0pO1xuXG4gICAgLy8gICB0aGlzLmxpc3RlblRvKHRhYmxlLm91dHB1dHMsICdyZXNldCcsIGZ1bmN0aW9uIChvdXRwdXRzKSB7XG4gICAgLy8gICAgIC8vIGNvbnNvbGUuaW5mbygnb3V0cHV0cyByZXNldCcsIG91dHB1dHMvKiwgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0qLyk7XG4gICAgLy8gICAgIHRoaXMuZm9yRWFjaChydWxlTWFwQ2hvaWNlcyk7XG4gICAgLy8gICB9KTtcblxuICAgIC8vICAgdGhpcy5saXN0ZW5Ubyh0YWJsZS5pbnB1dHMsICdhZGQnLCBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAvLyAgICAgLy8gY29uc29sZS5pbmZvKCdpbnB1dHMgYWRkJywgaW5wdXQvKiwgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0qLyk7XG4gICAgLy8gICAgIHRoaXMuZm9yRWFjaChydWxlTWFwQ2hvaWNlcyk7XG4gICAgLy8gICB9KTtcblxuICAgIC8vICAgdGhpcy5saXN0ZW5Ubyh0YWJsZS5vdXRwdXRzLCAnYWRkJywgZnVuY3Rpb24gKG91dHB1dCkge1xuICAgIC8vICAgICAvLyBjb25zb2xlLmluZm8oJ291dHB1dHMgYWRkJywgb3V0cHV0LyosIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKi8pO1xuICAgIC8vICAgICB0aGlzLmZvckVhY2gocnVsZU1hcENob2ljZXMpO1xuICAgIC8vICAgfSk7XG5cbiAgICAvLyAgIC8vIHRoaXMubGlzdGVuVG8odGFibGUuaW5wdXRzLCAncmVtb3ZlJywgZnVuY3Rpb24gKCkge1xuICAgIC8vICAgLy8gICBjb25zb2xlLmluZm8oJ2lucHV0cyByZW1vdmUnLCBhcmd1bWVudHNbMF0vKiwgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0qLyk7XG4gICAgLy8gICAvLyB9KTtcblxuICAgIC8vICAgLy8gdGhpcy5saXN0ZW5Ubyh0YWJsZS5vdXRwdXRzLCAncmVtb3ZlJywgZnVuY3Rpb24gKCkge1xuICAgIC8vICAgLy8gICBjb25zb2xlLmluZm8oJ291dHB1dHMgcmVtb3ZlJywgYXJndW1lbnRzWzBdLyosIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKi8pO1xuICAgIC8vICAgLy8gfSk7XG5cbiAgICAvLyAgIHRoaXMub24oJ2FkZCcsIHJ1bGVNYXBDaG9pY2VzKTtcblxuICAgIC8vICAgdGhpcy5vbigncmVzZXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gICAgIHRoaXMuZm9yRWFjaChydWxlTWFwQ2hvaWNlcyk7XG4gICAgLy8gICB9KTtcbiAgICAvLyB9XG4gIH0pXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG5cbnZhciBDZWxsVmlld3MgPSByZXF1aXJlKCcuL2NlbGwtdmlldycpO1xuXG5mdW5jdGlvbiBlbFBvc2l0aW9uKGVsKSB7XG4gIHZhciBub2RlID0gZWw7XG4gIHZhciB0b3AgPSBub2RlLm9mZnNldFRvcDtcbiAgdmFyIGxlZnQgPSBub2RlLm9mZnNldExlZnQ7XG5cbiAgd2hpbGUgKChub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQpKSB7XG4gICAgdG9wICs9IG5vZGUub2Zmc2V0VG9wO1xuICAgIGxlZnQgKz0gbm9kZS5vZmZzZXRMZWZ0O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IHRvcCxcbiAgICBsZWZ0OiBsZWZ0XG4gIH07XG59XG5cbnZhciBSdWxlVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6ICc8dHI+PHRkIGNsYXNzPVwibnVtYmVyXCI+JyArXG4gICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInZhbHVlXCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjdHJsc1wiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICc8L3RkPjwvdHI+JyxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5kZWx0YSc6IHtcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIHNlbGVjdG9yOiAnLm51bWJlciAudmFsdWUnXG4gICAgfSxcblxuICAgICdtb2RlbC5mb2N1c2VkJzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5DbGFzcycsXG4gICAgICBuYW1lOiAnZm9jdXNlZCdcbiAgICB9XG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIGlucHV0czoge1xuICAgICAgZGVwczogW1xuICAgICAgICAncGFyZW50JyxcbiAgICAgICAgJ3BhcmVudC5tb2RlbCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwuaW5wdXRzJ1xuICAgICAgXSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5tb2RlbC5pbnB1dHM7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG91dHB1dHM6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3BhcmVudCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwnLFxuICAgICAgICAncGFyZW50Lm1vZGVsLm91dHB1dHMnXG4gICAgICBdLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lm1vZGVsLm91dHB1dHM7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFubm90YXRpb246IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3BhcmVudCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwnLFxuICAgICAgICAncGFyZW50Lm1vZGVsLmFubm90YXRpb25zJ1xuICAgICAgXSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5tb2RlbC5hbm5vdGF0aW9ucy5hdCgwKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcG9zaXRpb246IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ2VsJyxcbiAgICAgICAgJ3BhcmVudCdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsIC8vIGJlY2F1c2Ugb2YgcmVzaXplXG4gICAgICBmbjogZnVuY3Rpb24gKCkgeyByZXR1cm4gZWxQb3NpdGlvbih0aGlzLmVsKTsgfVxuICAgIH1cbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJvb3QgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4ocm9vdC5ydWxlcywgJ3Jlc2V0JywgdGhpcy5yZW5kZXIpO1xuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4ocm9vdC5pbnB1dHMsICdyZXNldCcsIHRoaXMucmVuZGVyKTtcbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHJvb3Qub3V0cHV0cywgJ3Jlc2V0JywgdGhpcy5yZW5kZXIpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyV2l0aFRlbXBsYXRlKCk7XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgc3VidmlldztcblxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgc3VidmlldyA9IG5ldyBDZWxsVmlld3MuSW5wdXQoe1xuICAgICAgICAvL21vZGVsOiAgdGhpcy5tb2RlbC5pbnB1dENlbGxzW2ldLFxuICAgICAgICBtb2RlbDogIHRoaXMubW9kZWwuY2VsbHMuYXQoaSksXG4gICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHN1YnZpZXcucmVuZGVyKCkpO1xuICAgICAgdGhpcy5lbC5hcHBlbmRDaGlsZChzdWJ2aWV3LmVsKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5vdXRwdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdWJ2aWV3ID0gbmV3IENlbGxWaWV3cy5PdXRwdXQoe1xuICAgICAgICAvL21vZGVsOiAgdGhpcy5tb2RlbC5vdXRwdXRDZWxsc1tpXSxcbiAgICAgICAgbW9kZWw6ICB0aGlzLm1vZGVsLmNlbGxzLmF0KHRoaXMuaW5wdXRzLmxlbmd0aCArIGkpLFxuICAgICAgICBwYXJlbnQ6IHRoaXNcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnJlZ2lzdGVyU3VidmlldyhzdWJ2aWV3LnJlbmRlcigpKTtcbiAgICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQoc3Vidmlldy5lbCk7XG4gICAgfVxuICAgIHN1YnZpZXcgPSBuZXcgQ2VsbFZpZXdzLkFubm90YXRpb24oe1xuICAgICAgbW9kZWw6ICB0aGlzLm1vZGVsLmFubm90YXRpb24sXG4gICAgICBwYXJlbnQ6IHRoaXNcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyU3VidmlldyhzdWJ2aWV3LnJlbmRlcigpKTtcbiAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHN1YnZpZXcuZWwpO1xuXG4gICAgdGhpcy5vbignY2hhbmdlOmVsIGNoYW5nZTpwYXJlbnQnLCB0aGlzLnBvc2l0aW9uQ29udHJvbHMpO1xuXG4gICAgLy8gdGhpcy5wb3NpdGlvbkNvbnRyb2xzKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUnVsZVZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG5cblxuXG52YXIgU3VnZ2VzdGlvbnNDb2xsZWN0aW9uID0gQ29sbGVjdGlvbi5leHRlbmQoe1xuICBtb2RlbDogU3RhdGUuZXh0ZW5kKHtcbiAgICBwcm9wczoge1xuICAgICAgdmFsdWU6ICdzdHJpbmcnLFxuICAgICAgaHRtbDogJ3N0cmluZydcbiAgICB9XG4gIH0pXG59KTtcblxuXG5cbnZhciBTdWdnZXN0aW9uc0l0ZW1WaWV3ID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogJzxsaT48L2xpPicsXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuaHRtbCc6IHtcbiAgICAgIHR5cGU6ICdpbm5lckhUTUwnXG4gICAgfVxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgIGNsaWNrOiAnX2hhbmRsZUNsaWNrJ1xuICB9LFxuXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5wYXJlbnQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5wYXJlbnQubW9kZWwudmFsdWUgPSB0aGlzLm1vZGVsLnZhbHVlO1xuICAgIGlmICh0aGlzLnBhcmVudC5tb2RlbC52YWx1ZSA9PT0gdGhpcy5tb2RlbC52YWx1ZSkge1xuICAgICAgdGhpcy5wYXJlbnQubW9kZWwudHJpZ2dlcignY2hhbmdlOnZhbHVlJyk7XG4gICAgfVxuICB9XG59KTtcblxuXG5cbnZhciBTdWdnZXN0aW9uc1ZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIHNlc3Npb246IHtcbiAgICB2aXNpYmxlOiAnYm9vbGVhbidcbiAgfSxcblxuICBiaW5kaW5nczoge1xuICAgIHZpc2libGU6IHtcbiAgICAgIHR5cGU6ICd0b2dnbGUnXG4gICAgfVxuICB9LFxuXG4gIHRlbXBsYXRlOiAnPHVsIGNsYXNzPVwiZG1uLXN1Z2dlc3Rpb25zLWhlbHBlclwiPjwvdWw+JyxcblxuICBjb2xsZWN0aW9uczoge1xuICAgIHN1Z2dlc3Rpb25zOiBTdWdnZXN0aW9uc0NvbGxlY3Rpb25cbiAgfSxcblxuICBzaG93OiBmdW5jdGlvbiAoc3VnZ2VzdGlvbnMpIHtcbiAgICBpZiAoc3VnZ2VzdGlvbnMpIHtcbiAgICAgIGlmIChzdWdnZXN0aW9ucy5pc0NvbGxlY3Rpb24gJiYgc3VnZ2VzdGlvbnMuaXNDb2xsZWN0aW9uKCkpIHtcbiAgICAgICAgaW5zdGFuY2Uuc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9ucztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpbnN0YW5jZS5zdWdnZXN0aW9ucy5yZXNldChzdWdnZXN0aW9ucyk7XG4gICAgICB9XG4gICAgICBpbnN0YW5jZS52aXNpYmxlID0gc3VnZ2VzdGlvbnMubGVuZ3RoID4gMTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5zdWdnZXN0aW9ucywgU3VnZ2VzdGlvbnNJdGVtVmlldywgdGhpcy5lbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5cblxudmFyIGluc3RhbmNlO1xuU3VnZ2VzdGlvbnNWaWV3Lmluc3RhbmNlID0gZnVuY3Rpb24gKHN1Z2dlc3Rpb25zKSB7XG4gIGlmICghaW5zdGFuY2UpIHtcbiAgICBpbnN0YW5jZSA9IG5ldyBTdWdnZXN0aW9uc1ZpZXcoe30pO1xuICAgIGluc3RhbmNlLnJlbmRlcigpO1xuICB9XG5cbiAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGluc3RhbmNlLmVsKSkge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5zdGFuY2UuZWwpO1xuICB9XG5cbiAgaW5zdGFuY2Uuc2hvdyhzdWdnZXN0aW9ucyk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufTtcblxuXG5TdWdnZXN0aW9uc1ZpZXcuQ29sbGVjdGlvbiA9IFN1Z2dlc3Rpb25zQ29sbGVjdGlvbjtcblxubW9kdWxlLmV4cG9ydHMgPSBTdWdnZXN0aW9uc1ZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSwgcmVxdWlyZTogZmFsc2UqL1xuXG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXQtZGF0YScpO1xudmFyIE91dHB1dCA9IHJlcXVpcmUoJy4vb3V0cHV0LWRhdGEnKTtcblxudmFyIFJ1bGUgPSByZXF1aXJlKCcuL3J1bGUtZGF0YScpO1xuXG52YXIgRGVjaXNpb25UYWJsZU1vZGVsID0gU3RhdGUuZXh0ZW5kKHtcbiAgY29sbGVjdGlvbnM6IHtcbiAgICBpbnB1dHM6ICAgSW5wdXQuQ29sbGVjdGlvbixcbiAgICBvdXRwdXRzOiAgT3V0cHV0LkNvbGxlY3Rpb24sXG4gICAgcnVsZXM6ICAgIFJ1bGUuQ29sbGVjdGlvblxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgbmFtZTogJ3N0cmluZydcbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgeDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAwXG4gICAgfSxcblxuICAgIHk6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogMFxuICAgIH1cbiAgfSxcblxuXG4gIF9jbGlwYm9hcmQ6IG51bGwsXG5cblxuXG5cblxuXG5cbiAgYWRkUnVsZTogZnVuY3Rpb24gKHNjb3BlQ2VsbCkge1xuICAgIHZhciBjZWxscyA9IFtdO1xuICAgIHZhciBjO1xuXG4gICAgZm9yIChjID0gMDsgYyA8IHRoaXMuaW5wdXRzLmxlbmd0aDsgYysrKSB7XG4gICAgICBjZWxscy5wdXNoKHtcbiAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICBjaG9pY2VzOiB0aGlzLmlucHV0cy5hdChjKS5jaG9pY2VzLFxuICAgICAgICBmb2N1c2VkOiBjID09PSAwXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmb3IgKGMgPSAwOyBjIDwgdGhpcy5vdXRwdXRzLmxlbmd0aDsgYysrKSB7XG4gICAgICBjZWxscy5wdXNoKHtcbiAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICBjaG9pY2VzOiB0aGlzLm91dHB1dHMuYXQoYykuY2hvaWNlc1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2VsbHMucHVzaCh7XG4gICAgICB2YWx1ZTogJydcbiAgICB9KTtcblxuICAgIC8vIHZhciBydWxlID1cbiAgICB0aGlzLnJ1bGVzLmFkZCh7XG4gICAgICBjZWxsczogY2VsbHNcbiAgICB9KTtcblxuICAgIC8vIHJ1bGUuY2VsbHMuZm9yRWFjaChmdW5jdGlvbiAoY2VsbCwgYykge1xuICAgIC8vICAgdmFyIGNsYXVzZTtcbiAgICAvLyAgIGlmIChjIDwgdGhpcy5pbnB1dHMubGVuZ3RoKSB7XG4gICAgLy8gICAgIGNsYXVzZSA9IHRoaXMuaW5wdXRzLmF0KGMpO1xuICAgIC8vICAgICBjZWxsLmxpc3RlblRvKGNsYXVzZSwgJ2NoYW5nZTpjaG9pY2VzJywgZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICAgIGNlbGwuY2hvaWNlcyA9IGNsYXVzZS5jaG9pY2VzO1xuICAgIC8vICAgICB9KTtcbiAgICAvLyAgIH1cbiAgICAvLyAgIGVsc2UgaWYgKGMgPCAocnVsZS5jZWxscy5sZW5ndGggLSAxKSkge1xuICAgIC8vICAgICBjbGF1c2UgPSB0aGlzLm91dHB1dHMuYXQoYyAtICh0aGlzLmlucHV0cy5sZW5ndGggLSAwKSk7XG4gICAgLy8gICAgIGNlbGwubGlzdGVuVG8oY2xhdXNlLCAnY2hhbmdlOmNob2ljZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gICAgICAgY2VsbC5jaG9pY2VzID0gY2xhdXNlLmNob2ljZXM7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vICAgfVxuICAgIC8vIH0sIHRoaXMpO1xuICB9LFxuXG4gIHJlbW92ZVJ1bGU6IGZ1bmN0aW9uIChzY29wZUNlbGwpIHtcbiAgICB0aGlzLnJ1bGVzLnJlbW92ZShzY29wZUNlbGwuY29sbGVjdGlvbi5wYXJlbnQpO1xuICAgIHRoaXMucnVsZXMudHJpZ2dlcigncmVzZXQnKTtcbiAgfSxcblxuXG4gIGNvcHlSdWxlOiBmdW5jdGlvbiAoc2NvcGVDZWxsLCB1cERvd24pIHtcbiAgICB2YXIgcnVsZURlbHRhID0gdGhpcy5ydWxlcy5pbmRleE9mKHNjb3BlQ2VsbC5jb2xsZWN0aW9uLnBhcmVudCk7XG4gICAgdmFyIHJ1bGUgPSB0aGlzLnJ1bGVzLmF0KHJ1bGVEZWx0YSk7XG4gICAgaWYgKCFydWxlKSB7IHJldHVybjsgfVxuICAgIGlmICghdXBEb3duKSB7IHJldHVybjsgfVxuICB9LFxuXG5cbiAgcGFzdGVSdWxlOiBmdW5jdGlvbiAoZGVsdGEpIHtcbiAgICBpZiAoIXRoaXMuX2NsaXBib2FyZCkgeyByZXR1cm47IH1cbiAgICB0aGlzLnJ1bGVzLmFkZCh0aGlzLl9jbGlwYm9hcmQudG9KU09OKCksIHtcbiAgICAgIGF0OiBkZWx0YVxuICAgIH0pO1xuICB9LFxuXG5cbiAgX3J1bGVzQ2VsbHM6IGZ1bmN0aW9uIChhZGRlZCwgZGVsdGEpIHtcbiAgICB0aGlzLnJ1bGVzLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgIHJ1bGUuY2VsbHMuYWRkKHtcbiAgICAgICAgY2hvaWNlczogYWRkZWQuY2hvaWNlc1xuICAgICAgfSwge1xuICAgICAgICBhdDogZGVsdGEsXG4gICAgICAgIHNpbGVudDogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5ydWxlcy50cmlnZ2VyKCdyZXNldCcpO1xuICB9LFxuXG4gIGFkZElucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlbHRhID0gdGhpcy5pbnB1dHMubGVuZ3RoO1xuICAgIHRoaXMuX3J1bGVzQ2VsbHModGhpcy5pbnB1dHMuYWRkKHtcbiAgICAgIGxhYmVsOiAgICBudWxsLFxuICAgICAgY2hvaWNlczogIG51bGwsXG4gICAgICBtYXBwaW5nOiAgbnVsbCxcbiAgICAgIGRhdGF0eXBlOiAnc3RyaW5nJ1xuICAgIH0pLCBkZWx0YSk7XG4gIH0sXG5cbiAgcmVtb3ZlSW5wdXQ6IGZ1bmN0aW9uICgpIHt9LFxuXG5cblxuICBhZGRPdXRwdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGVsdGEgPSB0aGlzLmlucHV0cy5sZW5ndGggKyB0aGlzLmlucHV0cy5sZW5ndGggLSAxO1xuICAgIHRoaXMuX3J1bGVzQ2VsbHModGhpcy5vdXRwdXRzLmFkZCh7XG4gICAgICBsYWJlbDogICAgbnVsbCxcbiAgICAgIGNob2ljZXM6ICBudWxsLFxuICAgICAgbWFwcGluZzogIG51bGwsXG4gICAgICBkYXRhdHlwZTogJ3N0cmluZydcbiAgICB9KSwgZGVsdGEpO1xuICB9LFxuXG4gIHJlbW92ZU91dHB1dDogZnVuY3Rpb24gKCkge31cbn0pO1xuXG53aW5kb3cuRGVjaXNpb25UYWJsZU1vZGVsID0gRGVjaXNpb25UYWJsZU1vZGVsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IERlY2lzaW9uVGFibGVNb2RlbFxufTtcbiJdfQ==
