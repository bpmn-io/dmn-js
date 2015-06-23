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
    suggestionsView.show(filtered, this);
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

},{"./suggestions-view":14}],4:[function(require,module,exports){
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
var ScopeControlsView = require('./scopecontrols-view');



var LabelView = View.extend(merge({
  events: {
    'input .value': '_handleInput',
  },

  _handleInput: function () {
    this.model.label = this.valueEl.textContent.trim();
  },

  render: function () {
    var valueEl = this.valueEl = document.createElement('span');
    valueEl.className = 'value';
    valueEl.setAttribute('contenteditable', true);
    valueEl.textContent = (this.model.label || '').trim();
    this.el.innerHTML = '';
    this.el.appendChild(valueEl);


    var clause = this.model;
    var table = clause.collection.parent;
    var addMethod = clause.clauseType === 'input' ? 'addInput' : 'addOutput';

    var ctrls = new ScopeControlsView({
      parent: this,
      scope: this.model,
      commands: [
        {
          label: clause.clauseType === 'input' ? 'Input' : 'Output',
          icon: clause.clauseType,
          subcommands: [
            {
              label: 'add',
              icon: 'plus',
              hint: 'Add a ' + clause.clauseType + ' clause',
              fn: function () {
                table[addMethod]({});
              },
              subcommands: [
                {
                  label: 'before',
                  icon: 'left',
                  hint: 'Add a ' + clause.clauseType + ' before this one',
                  fn: function () {
                    table[addMethod]({});
                  }
                },
                {
                  label: 'after',
                  icon: 'right',
                  hint: 'Add a ' + clause.clauseType + ' after this one',
                  fn: function () {
                    table[addMethod]({});
                  }
                }
              ]
            },
            {
              label: 'remove',
              icon: 'minus',
              hint: 'Remove the ' + clause.clauseType + ' clause',
              possible: function () {
                return clause.collection.length > 1;
              },
              fn: function () {
                var delta = clause.collection.indexOf(clause);
                clause.collection.remove(clause);

                if (clause.clauseType === 'output') {
                  delta += table.inputs.length;
                }

                table.rules.forEach(function (rule) {
                  var cell = rule.cells.at(delta);
                  rule.cells.remove(cell);
                });
                table.rules.trigger('reset');
              }
            }
          ]
        }
      ]
    });
    this.registerSubview(ctrls);
    this.el.appendChild(ctrls.el);
  }
}));




var MappingView = View.extend(merge({
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




var ValueView = View.extend(merge({
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

},{"./scopecontrols-view":13}],6:[function(require,module,exports){
'use strict';
/* global module: false, deps: false */

var View = deps('ampersand-view');
var Collection = deps('ampersand-collection');
var State = deps('ampersand-state');

var defaultCommands = [
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
          // console.info('clear possible?', arguments, this);
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
      type: function (el, value) {
        if (!value) {
          el.removeAttribute('href');
        }
        else {
          el.setAttribute('href', value);
        }
      }
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
    var commands = options.commands || defaultCommands;

    this.commands.reset(commands);
    return this;
  },

  triggerCommand: function (command, evt) {
    command.fn.call(this, evt);
    if (!command.keepOpen) {
      this.close();
    }
    return this;
  },

  close: function () {
    this.isOpen = false;
    return this;
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











var instance;
ContextMenuView.instance = function () {
  if (!instance) {
    instance = new ContextMenuView();
  }

  if (!document.body.contains(instance.el)) {
    document.body.appendChild(instance.el);
  }

  return instance;
};

ContextMenuView.Collection = CommandsCollection;

module.exports = ContextMenuView;

},{}],7:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false */

var View = deps('ampersand-view');
var DecisionTable = require('./table-data');
var RuleView = require('./rule-view');




var ClauseHeaderView = require('./clause-view');

var ContextMenuView = require('./contextmenu-view');
var contextMenu = ContextMenuView.instance();
var utils = require('./utils');


// var ScopeControlsView = require('./scopecontrols-view');

function toArray(els) {
  return Array.prototype.slice.apply(els);
}


function makeTd(type) {
  var el = document.createElement('td');
  el.className = type;
  return el;
}


function makeAddButton(clauseType, table) {
  var el = document.createElement('span');
  el.className = 'icon-dmn icon-plus';
  el.addEventListener('click', function () {
    table[clauseType === 'input' ? 'addInput' : 'addOutput']();
  });
  return el;
}




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
    'click .add-rule a': '_handleAddRuleClick'
  },

  _handleAddRuleClick: function () {
    this.model.addRule();
  },

  initialize: function () {
    this.model = this.model || new DecisionTable.Model();
  },

  hideContextMenu: function () {
    contextMenu.close();
  },

  showContextMenu: function (cellModel, evt) {
    var options = utils.elOffset(evt.currentTarget);
    options.scope = cellModel;
    options.left += evt.currentTarget.clientWidth;
    var table = this.model;

    options.commands = [
      {
        label: 'Rule',
        icon: '',
        subcommands: [
          {
            label: 'add',
            icon: 'plus',
            fn: function () {
              table.addRule(this.scope);
            },
            subcommands: [
              {
                label: 'above',
                icon: 'above',
                hint: 'Add a rule above the focused one',
                fn: function () {
                  table.addRule(this.scope, -1);
                }
              },
              {
                label: 'below',
                icon: 'below',
                hint: 'Add a rule below the focused one',
                fn: function () {
                  table.addRule(this.scope, 1);
                }
              }
            ]
          },
          // {
          //   label: 'copy',
          //   icon: 'copy',
          //   fn: function () {
          //     table.copyRule(this.scope);
          //   },
          //   subcommands: [
          //     {
          //       label: 'above',
          //       icon: 'above',
          //       hint: 'Copy the rule above the focused one',
          //       fn: function () {
          //         table.copyRule(this.scope, -1);
          //       }
          //     },
          //     {
          //       label: 'below',
          //       icon: 'below',
          //       hint: 'Copy the rule below the focused one',
          //       fn: function () {
          //         table.copyRule(this.scope, 1);
          //       }
          //     }
          //   ]
          // },
          {
            label: 'remove',
            icon: 'minus',
            hint: 'Remove the focused rule',
            fn: function () {
              table.removeRule(this.scope);
            }
          },
          {
            label: 'clear',
            icon: 'clear',
            hint: 'Clear the focused rule',
            fn: function () {
              table.clearRule(this.scope);
            }
          }
        ]
      }
    ];

    var type = cellModel.type;
    var addMethod = type === 'input' ? 'addInput' : 'addOutput';

    options.commands.unshift({
      label: type === 'input' ? 'Input' : 'Output',
      icon: type,
      subcommands: [
        {
          label: 'add',
          icon: 'plus',
          fn: function () {
            table[addMethod]();
          },
          subcommands: [
            {
              label: 'before',
              icon: 'left',
              hint: 'Add an ' + type + ' clause before the focused one',
              fn: function () {
                table[addMethod]();
              }
            },
            {
              label: 'after',
              icon: 'right',
              hint: 'Add an ' + type + ' clause after the focused one',
              fn: function () {
                table[addMethod]();
              }
            }
          ]
        },
        {
          label: 'remove',
          icon: 'minus',
          hint: 'Remove the ' + type + ' clause',
          fn: function () {
            var clause = cellModel.clause;
            var delta = clause.collection.indexOf(clause);
            clause.collection.remove(clause);

            if (clause.clauseType === 'output') {
              delta += table.inputs.length;
            }

            table.rules.forEach(function (rule) {
              var cell = rule.cells.at(delta);
              rule.cells.remove(cell);
            });
            table.rules.trigger('reset');
          }
        }
      ]
    });

    contextMenu.open(options);

    try {
      evt.preventDefault();
    } catch (e) {}
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


  render: function () {
    if (!this.el) {
      this.renderWithTemplate();
    }
    else {
      this.parseTable();
      this.trigger('change:el');
    }

    var table = this.model;

    if (!this.headerEl) {
      this.cacheElements({
        tableEl:          'table',
        labelEl:          'header h3',
        headerEl:         'thead',
        bodyEl:           'tbody',
        inputsHeaderEl:   'thead tr:nth-child(1) th.input',
        outputsHeaderEl:  'thead tr:nth-child(1) th.output',
        labelsRowEl:      'thead tr.labels',
        valuesRowEl:      'thead tr.values',
        mappingsRowEl:    'thead tr.mappings'
      });


      this.inputsHeaderEl.appendChild(makeAddButton('input', table));

      this.outputsHeaderEl.appendChild(makeAddButton('output', table));

      /*
      var inputsHeaderView = new ScopeControlsView({
        parent: this,
        scope: this.model,
        commands: [
          {
            label: 'Add input',
            icon: 'plus',
            hint: 'Add an input clause after on the right',
            fn: function () {
              table.addInput();
            }
          }
        ]
      });
      this.registerSubview(inputsHeaderView);
      this.inputsHeaderEl.appendChild(inputsHeaderView.el);

      var outputsHeaderView = new ScopeControlsView({
        parent: this,
        scope: this.model,
        commands: [
          {
            label: 'Add output',
            icon: 'plus',
            hint: 'Add an output clause on the right',
            fn: function () {
              table.addOutput();
            }
          }
        ]
      });
      this.registerSubview(outputsHeaderView);
      this.outputsHeaderEl.appendChild(outputsHeaderView.el);
      */
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


    if (!this.footEl) {
      var footEl = this.footEl = document.createElement('tfoot');
      footEl.className = 'rules-controls';
      footEl.innerHTML = '<tr><td class="add-rule"><a title="Add a rule" class="icon-dmn icon-plus"></a></td></tr>';
      this.tableEl.appendChild(footEl);

    }


    return this;
  }
});

module.exports = DecisionTableView;

},{"./clause-view":5,"./contextmenu-view":6,"./rule-view":12,"./table-data":15,"./utils":16}],8:[function(require,module,exports){
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

var InputModel = Clause.Model.extend({
  clauseType: 'input'
});

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

var OutputModel = Clause.Model.extend({
  clauseType: 'output'
});

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
  })
};

},{"./cell-data":1}],12:[function(require,module,exports){
'use strict';
/* global require: false, module: false, deps: false */

var View = deps('ampersand-view');
var CellViews = require('./cell-view');
var ScopeControlsView = require('./scopecontrols-view');
var utils = require('./utils');


var RuleView = View.extend({
  template: '<tr><td class="number">' +
              '<span class="value"></span>' +
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
      deps: [],
      cache: false, // because of resize
      fn: function () { return utils.elOffset(this.el); }
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

    this.cacheElements({
      numberEl: '.number'
    });

    var rule = this.model;
    var table = rule.collection.parent;

    var ctrls = new ScopeControlsView({
      parent: this,
      scope: this.model,
      commands: [
        {
          label: 'Rule',
          subcommands: [
            {
              label: 'add',
              icon: 'plus',
              fn: function () {
                table.addRule(rule);
              },
              subcommands: [
                {
                  label: 'above',
                  icon: 'above',
                  hint: 'Add a rule above the focused one',
                  fn: function () {
                    table.addRule(rule, -1);
                  }
                },
                {
                  label: 'below',
                  icon: 'below',
                  hint: 'Add a rule below the focused one',
                  fn: function () {
                    table.addRule(rule, 1);
                  }
                }
              ]
            },
            // {
            //   label: 'copy',
            //   icon: 'copy',
            //   fn: function () {
            //     table.copyRule(rule);
            //   },
            //   subcommands: [
            //     {
            //       label: 'above',
            //       icon: 'above',
            //       hint: 'Copy the rule above the focused one',
            //       fn: function () {
            //         table.copyRule(rule, -1);
            //       }
            //     },
            //     {
            //       label: 'below',
            //       icon: 'below',
            //       hint: 'Copy the rule below the focused one',
            //       fn: function () {
            //         table.copyRule(rule, 1);
            //       }
            //     }
            //   ]
            // },
            {
              label: 'remove',
              icon: 'minus',
              hint: 'Remove this rule',
              fn: function () {
                rule.collection.remove(rule);
              }
            },
            {
              label: 'clear',
              icon: 'clear',
              hint: 'Clear the focused rule',
              fn: function () {
                table.clearRule(rule);
              }
            }
          ]
        }
      ]
    });
    this.registerSubview(ctrls);
    this.numberEl.appendChild(ctrls.el);

    var i;
    var subview;

    for (i = 0; i < this.inputs.length; i++) {
      subview = new CellViews.Input({
        model:  this.model.cells.at(i),
        parent: this
      });

      this.registerSubview(subview.render());
      this.el.appendChild(subview.el);
    }

    for (i = 0; i < this.outputs.length; i++) {
      subview = new CellViews.Output({
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

    return this;
  }
});

module.exports = RuleView;

},{"./cell-view":2,"./scopecontrols-view":13,"./utils":16}],13:[function(require,module,exports){
'use strict';
/*global deps:false, require:false, module:false*/
var View = deps('ampersand-view');

var ContextMenuView = require('./contextmenu-view');
var contextMenu = ContextMenuView.instance();
var utils = require('./utils');



var ScopeControlsView = View.extend({
  autoRender: true,

  template: '<span class="ctrls"></span>',

  derived: {
    offset: {
      cache: false,
      fn: function () {
        return utils.elOffset(this.el);
      }
    }
  },

  session: {
    scope: 'state',

    commands: {
      type: 'array',
      default: function () { return []; }
    }
  },

  events: {
    click: '_handleClick'
  },

  _handleClick: function () {
    var options = this.offset;
    options.left += this.el.clientWidth;
    options.commands = this.commands || [];
    contextMenu.open(options);
  }
});

module.exports = ScopeControlsView;

},{"./contextmenu-view":6,"./utils":16}],14:[function(require,module,exports){
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
    if (!this.parent || !this.parent.parent) { return; }
    this.parent.parent.model.value = this.model.value;
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

  show: function (suggestions, parent) {
    if (suggestions) {
      if (suggestions.isCollection && suggestions.isCollection()) {
        instance.suggestions = suggestions;
      }
      else {
        instance.suggestions.reset(suggestions);
      }
      instance.visible = suggestions.length > 1;
    }
    if (parent) {
      this.parent = parent;
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
SuggestionsView.instance = function (suggestions, parent) {
  if (!instance) {
    instance = new SuggestionsView({});
    instance.render();
  }

  if (!document.body.contains(instance.el)) {
    document.body.appendChild(instance.el);
  }

  instance.show(suggestions, parent);

  return instance;
};


SuggestionsView.Collection = SuggestionsCollection;

module.exports = SuggestionsView;

},{}],15:[function(require,module,exports){
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


  _ruleClipboard: null,







  addRule: function (scopeCell, beforeAfter) {
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

    var options = {};
    if (beforeAfter) {
      var ruleDelta = this.rules.indexOf(scopeCell.collection.parent);
      options.at = ruleDelta + (beforeAfter > 0 ? ruleDelta : (ruleDelta - 1));
    }

    this.rules.add({
      cells: cells
    }, options);

    return this;
  },

  removeRule: function (scopeCell) {
    this.rules.remove(scopeCell.collection.parent);
    this.rules.trigger('reset');
    return this;
  },


  copyRule: function (scopeCell, upDown) {
    var rule = scopeCell.collection.parent;
    if (!rule) { return this; }
    this._ruleClipboard = rule;

    if (upDown) {
      var ruleDelta = this.rules.indexOf(rule);
      this.pasteRule(ruleDelta + (upDown > 1 ? 0 : 1));
    }

    return this;
  },


  pasteRule: function (delta) {
    if (!this._ruleClipboard) { return this; }
    var data = this._ruleClipboard.toJSON();
    this.rules.add(data, {
      at: delta
    });
    return this;
  },


  clearRule: function (rule) {
    var ruleDelta = this.rules.indexOf(rule);
    this.rules.at(ruleDelta).cells.forEach(function (cell) {
      cell.value = '';
    });
    return this;
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

    return this;
  },

  removeInput: function () {
    return this;
  },



  addOutput: function () {
    var delta = this.inputs.length + this.inputs.length - 1;
    this._rulesCells(this.outputs.add({
      label:    null,
      choices:  null,
      mapping:  null,
      datatype: 'string'
    }), delta);

    return this;
  },

  removeOutput: function () {
    return this;
  }
});

window.DecisionTableModel = DecisionTableModel;

module.exports = {
  Model: DecisionTableModel
};

},{"./input-data":9,"./output-data":10,"./rule-data":11}],16:[function(require,module,exports){
'use strict';
/*global module:false*/

function elOffset(el) {
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


module.exports = {
  elOffset: elOffset
};

},{}]},{},[8])(8)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2NlbGwtZGF0YS5qcyIsInNjcmlwdHMvY2VsbC12aWV3LmpzIiwic2NyaXB0cy9jaG9pY2Utdmlldy5qcyIsInNjcmlwdHMvY2xhdXNlLWRhdGEuanMiLCJzY3JpcHRzL2NsYXVzZS12aWV3LmpzIiwic2NyaXB0cy9jb250ZXh0bWVudS12aWV3LmpzIiwic2NyaXB0cy9kZWNpc2lvbi10YWJsZS12aWV3LmpzIiwic2NyaXB0cy9pbmRleC5qcyIsInNjcmlwdHMvaW5wdXQtZGF0YS5qcyIsInNjcmlwdHMvb3V0cHV0LWRhdGEuanMiLCJzY3JpcHRzL3J1bGUtZGF0YS5qcyIsInNjcmlwdHMvcnVsZS12aWV3LmpzIiwic2NyaXB0cy9zY29wZWNvbnRyb2xzLXZpZXcuanMiLCJzY3JpcHRzL3N1Z2dlc3Rpb25zLXZpZXcuanMiLCJzY3JpcHRzL3RhYmxlLWRhdGEuanMiLCJzY3JpcHRzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0ZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UqL1xuXG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcblxudmFyIENlbGxNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIHByb3BzOiB7XG4gICAgdmFsdWU6ICdzdHJpbmcnXG4gIH0sXG5cbiAgc2Vzc2lvbjoge1xuICAgIGZvY3VzZWQ6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcblxuICAgIGVkaXRhYmxlOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfVxuICB9LFxuXG4gIGRlcml2ZWQ6IHtcbiAgICB0YWJsZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICdjb2xsZWN0aW9uLnBhcmVudCcsXG4gICAgICAgICdjb2xsZWN0aW9uLnBhcmVudC5jb2xsZWN0aW9uJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24ucGFyZW50J1xuICAgICAgXSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24ucGFyZW50O1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGF1c2VEZWx0YToge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICd0YWJsZS5pbnB1dHMnLFxuICAgICAgICAndGFibGUub3V0cHV0cydcbiAgICAgIF0sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVsdGEgPSB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKTtcbiAgICAgICAgdmFyIGlucHV0cyA9IHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aDtcbiAgICAgICAgdmFyIG91dHB1dHMgPSB0aGlzLnRhYmxlLmlucHV0cy5sZW5ndGggKyB0aGlzLnRhYmxlLm91dHB1dHMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChkZWx0YSA8IGlucHV0cykge1xuICAgICAgICAgIHJldHVybiBkZWx0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZWx0YSA8IG91dHB1dHMpIHtcbiAgICAgICAgICByZXR1cm4gZGVsdGEgLSBpbnB1dHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdHlwZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICd0YWJsZS5pbnB1dHMnLFxuICAgICAgICAndGFibGUub3V0cHV0cydcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVsdGEgPSB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKTtcbiAgICAgICAgdmFyIGlucHV0cyA9IHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aDtcbiAgICAgICAgdmFyIG91dHB1dHMgPSB0aGlzLnRhYmxlLmlucHV0cy5sZW5ndGggKyB0aGlzLnRhYmxlLm91dHB1dHMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChkZWx0YSA8IGlucHV0cykge1xuICAgICAgICAgIHJldHVybiAnaW5wdXQnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRlbHRhIDwgb3V0cHV0cykge1xuICAgICAgICAgIHJldHVybiAnb3V0cHV0JztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAnYW5ub3RhdGlvbic7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNsYXVzZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICdjb2xsZWN0aW9uLmxlbmd0aCcsXG4gICAgICAgICd0eXBlJyxcbiAgICAgICAgJ2NsYXVzZURlbHRhJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNsYXVzZURlbHRhIDwgMCB8fCB0aGlzLnR5cGUgPT09ICdhbm5vdGF0aW9uJykgeyByZXR1cm47IH1cbiAgICAgICAgdmFyIGNsYXVzZSA9IHRoaXMudGFibGVbdGhpcy50eXBlICsncyddLmF0KHRoaXMuY2xhdXNlRGVsdGEpO1xuICAgICAgICByZXR1cm4gY2xhdXNlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjaG9pY2VzOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICd0YWJsZScsXG4gICAgICAgICdjb2xsZWN0aW9uLmxlbmd0aCcsXG4gICAgICAgICd0eXBlJyxcbiAgICAgICAgJ2NsYXVzZScsXG4gICAgICAgICdjbGF1c2VEZWx0YSdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2xhdXNlKSB7IHJldHVybjsgfVxuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UuY2hvaWNlcztcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMub24oJ2NoYW5nZTpmb2N1c2VkJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmZvY3VzZWQpIHsgcmV0dXJuOyB9XG4gICAgICB2YXIgY2lkID0gdGhpcy5jaWQ7XG4gICAgICB2YXIgcnVsZUNpZCA9IHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuY2lkO1xuICAgICAgdmFyIHggPSAwO1xuICAgICAgdmFyIHkgPSAwO1xuXG4gICAgICB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24uZm9yRWFjaChmdW5jdGlvbiAocnVsZSwgcikge1xuICAgICAgICB2YXIgcnVsZUZvY3VzZWQgPSBydWxlLmNpZCA9PT0gcnVsZUNpZDtcbiAgICAgICAgaWYgKHJ1bGUuZm9jdXNlZCAhPT0gcnVsZUZvY3VzZWQpIHtcbiAgICAgICAgICBydWxlLmZvY3VzZWQgPSBydWxlRm9jdXNlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChydWxlRm9jdXNlZCkge1xuICAgICAgICAgIHkgPSByO1xuICAgICAgICB9XG5cbiAgICAgICAgcnVsZS5jZWxscy5mb3JFYWNoKGZ1bmN0aW9uIChjZWxsLCBjKSB7XG4gICAgICAgICAgdmFyIGNlbGxGb2N1c2VkID0gY2VsbC5jaWQgPT09IGNpZDtcblxuICAgICAgICAgIGlmIChjZWxsLmZvY3VzZWQgIT09IGNlbGxGb2N1c2VkKSB7XG4gICAgICAgICAgICBjZWxsLmZvY3VzZWQgPSBjZWxsRm9jdXNlZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY2VsbEZvY3VzZWQpIHtcbiAgICAgICAgICAgIHggPSBjO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy50YWJsZS5zZXQoe1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogQ2VsbE1vZGVsLFxuICBDb2xsZWN0aW9uOiBDb2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IENlbGxNb2RlbFxuICB9KVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCByZXF1aXJlOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIG1lcmdlID0gZGVwcygnbG9kYXNoLm1lcmdlJyk7XG5cblxudmFyIENob2ljZVZpZXcgPSByZXF1aXJlKCcuL2Nob2ljZS12aWV3Jyk7XG52YXIgUnVsZUNlbGxWaWV3ID0gVmlldy5leHRlbmQobWVyZ2Uoe30sIENob2ljZVZpZXcucHJvdG90eXBlLCB7XG4gIHRlbXBsYXRlOiAnPHRkPjwvdGQ+JyxcblxuICBiaW5kaW5nczogbWVyZ2Uoe30sIENob2ljZVZpZXcucHJvdG90eXBlLmJpbmRpbmdzLCB7XG4gICAgJ21vZGVsLnZhbHVlJzoge1xuICAgICAgdHlwZTogJ3RleHQnXG4gICAgfSxcblxuICAgICdtb2RlbC5lZGl0YWJsZSc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdjb250ZW50ZWRpdGFibGUnXG4gICAgfSxcblxuICAgICdtb2RlbC5zcGVsbGNoZWNrZWQnOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkF0dHJpYnV0ZScsXG4gICAgICBuYW1lOiAnc3BlbGxjaGVjaydcbiAgICB9LFxuXG4gICAgJ21vZGVsLnR5cGUnOiB7XG4gICAgICB0eXBlOiAnY2xhc3MnXG4gICAgfVxuICB9KSxcblxuICBldmVudHM6IG1lcmdlKHt9LCBDaG9pY2VWaWV3LnByb3RvdHlwZS5ldmVudHMsIHtcbiAgICAnY29udGV4dG1lbnUnOiAgJ19oYW5kbGVDb250ZXh0TWVudScsXG4gICAgJ2NsaWNrJzogICAgICAgICdfaGFuZGxlQ2xpY2snXG4gIH0pLFxuXG4gIF9oYW5kbGVGb2N1czogZnVuY3Rpb24gKCkge1xuICAgIENob2ljZVZpZXcucHJvdG90eXBlLl9oYW5kbGVGb2N1cy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucGFyZW50LnBhcmVudC5oaWRlQ29udGV4dE1lbnUoKTtcbiAgfSxcblxuICBfaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBhcmVudC5wYXJlbnQuaGlkZUNvbnRleHRNZW51KCk7XG4gIH0sXG5cbiAgX2hhbmRsZUNvbnRleHRNZW51OiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdGhpcy5wYXJlbnQucGFyZW50LnNob3dDb250ZXh0TWVudSh0aGlzLm1vZGVsLCBldnQpO1xuICB9XG59KSk7XG5cblxuXG52YXIgUnVsZUlucHV0Q2VsbFZpZXcgPSBSdWxlQ2VsbFZpZXcuZXh0ZW5kKHt9KTtcblxudmFyIFJ1bGVPdXRwdXRDZWxsVmlldyA9IFJ1bGVDZWxsVmlldy5leHRlbmQoe30pO1xuXG52YXIgUnVsZUFubm90YXRpb25DZWxsVmlldyA9IFJ1bGVDZWxsVmlldy5leHRlbmQoe30pO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENlbGw6ICAgICAgIFJ1bGVDZWxsVmlldyxcbiAgSW5wdXQ6ICAgICAgUnVsZUlucHV0Q2VsbFZpZXcsXG4gIE91dHB1dDogICAgIFJ1bGVPdXRwdXRDZWxsVmlldyxcbiAgQW5ub3RhdGlvbjogUnVsZUFubm90YXRpb25DZWxsVmlld1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBkZXBzOiBmYWxzZSwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UgKi9cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcblxudmFyIFN1Z2dlc3Rpb25zVmlldyA9IHJlcXVpcmUoJy4vc3VnZ2VzdGlvbnMtdmlldycpO1xuXG52YXIgc3VnZ2VzdGlvbnNWaWV3ID0gU3VnZ2VzdGlvbnNWaWV3Lmluc3RhbmNlKCk7XG5cbnZhciBzcGVjaWFsS2V5cyA9IFtcbiAgOCAvLyBiYWNrc3BhY2Vcbl07XG5cbnZhciBDaG9pY2VWaWV3ID0gVmlldy5leHRlbmQoe1xuICBjb2xsZWN0aW9uczoge1xuICAgIGNob2ljZXM6IFN1Z2dlc3Rpb25zVmlldy5Db2xsZWN0aW9uXG4gIH0sXG5cbiAgZXZlbnRzOiB7XG4gICAgaW5wdXQ6ICdfaGFuZGxlSW5wdXQnLFxuICAgIGZvY3VzOiAnX2hhbmRsZUZvY3VzJyxcbiAgICBibHVyOiAgJ19oYW5kbGVCbHVyJ1xuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICB2YWxpZDogICAgICAgICAge1xuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIH0sXG5cbiAgICBvcmlnaW5hbFZhbHVlOiAgJ3N0cmluZydcbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgaXNPcmlnaW5hbDoge1xuICAgICAgZGVwczogWydtb2RlbC52YWx1ZScsICdvcmlnaW5hbFZhbHVlJ10sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC52YWx1ZSA9PT0gdGhpcy5vcmlnaW5hbFZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC52YWx1ZSc6IHtcbiAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSB8fCAhdmFsdWUudHJpbSgpKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLmVsLnRleHRDb250ZW50ID0gdmFsdWUudHJpbSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAnbW9kZWwuZm9jdXNlZCc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgbmFtZTogJ2ZvY3VzZWQnXG4gICAgfSxcblxuICAgIGlzT3JpZ2luYWw6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgbmFtZTogJ3VudG91Y2hlZCdcbiAgICB9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAodGhpcy5lbCkge1xuICAgICAgdGhpcy5lbC5jb250ZW50RWRpdGFibGUgPSB0cnVlO1xuICAgICAgdGhpcy5lbC5zcGVsbGNoZWNrID0gZmFsc2U7XG4gICAgICB0aGlzLm9yaWdpbmFsVmFsdWUgPSB0aGlzLnZhbHVlID0gdGhpcy5lbC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5vcmlnaW5hbFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB9XG5cblxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbCwgJ2NoYW5nZTpjaG9pY2VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNob2ljZXMgPSB0aGlzLm1vZGVsLmNob2ljZXM7XG4gICAgICBpZiAoIXRoaXMuY2hvaWNlcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWNob2ljZXMpIHtcbiAgICAgICAgY2hvaWNlcyA9IFtdO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNob2ljZXMucmVzZXQoY2hvaWNlcy5tYXAoZnVuY3Rpb24gKGNob2ljZSkge1xuICAgICAgICByZXR1cm4ge3ZhbHVlOiBjaG9pY2V9O1xuICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zdWdnZXN0aW9ucyA9IG5ldyBTdWdnZXN0aW9uc1ZpZXcuQ29sbGVjdGlvbih7XG4gICAgICBwYXJlbnQ6IHRoaXMuY2hvaWNlc1xuICAgIH0pO1xuXG5cblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIHJlc2V0U3VnZ2VzdGlvbnMoKSB7XG4gICAgICBzZWxmLnN1Z2dlc3Rpb25zLnJlc2V0KHNlbGYuX2ZpbHRlcihzZWxmLnZhbHVlKSk7XG4gICAgfVxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbCwgJ2NoYW5nZTp2YWx1ZScsIHJlc2V0U3VnZ2VzdGlvbnMpO1xuXG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0aGlzLmNob2ljZXMsICdjaGFuZ2UnLCByZXNldFN1Z2dlc3Rpb25zKTtcblxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5zdWdnZXN0aW9ucywgJ3Jlc2V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFzdWdnZXN0aW9uc1ZpZXcpIHsgcmV0dXJuOyB9XG4gICAgICBzdWdnZXN0aW9uc1ZpZXcuZWwuc3R5bGUuZGlzcGxheSA9IHRoaXMuc3VnZ2VzdGlvbnMubGVuZ3RoIDwgMiA/ICdub25lJyA6ICdibG9jayc7XG4gICAgfSk7XG5cblxuICAgIGZ1bmN0aW9uIF9oYW5kbGVSZXNpemUoKSB7XG4gICAgICBzZWxmLl9oYW5kbGVSZXNpemUoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmVsKSB7XG4gICAgICB0aGlzLm9uY2UoJ2NoYW5nZTplbCcsIF9oYW5kbGVSZXNpemUpO1xuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgX2hhbmRsZVJlc2l6ZSk7XG4gICAgdGhpcy5faGFuZGxlUmVzaXplKCk7XG4gIH0sXG5cbiAgX2ZpbHRlcjogZnVuY3Rpb24gKHZhbCkge1xuICAgIHZhciBmaWx0ZXJlZCA9IHRoaXMuY2hvaWNlc1xuICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGNob2ljZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNob2ljZS52YWx1ZS5pbmRleE9mKHZhbCkgPT09IDA7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uIChjaG9pY2UpIHtcbiAgICAgICAgICAgIHZhciBjaGFycyA9IHRoaXMuZWwudGV4dENvbnRlbnQubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIHZhbCA9IGNob2ljZS5lc2NhcGUoJ3ZhbHVlJyk7XG4gICAgICAgICAgICB2YXIgaHRtbFN0ciA9ICc8c3BhbiBjbGFzcz1cImhpZ2hsaWdodGVkXCI+JyArIHZhbC5zbGljZSgwLCBjaGFycykgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICBodG1sU3RyICs9IHZhbC5zbGljZShjaGFycyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB2YWx1ZTogY2hvaWNlLnZhbHVlLFxuICAgICAgICAgICAgICBodG1sOiBodG1sU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiBmaWx0ZXJlZDtcbiAgfSxcblxuICBfaGFuZGxlRm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9oYW5kbGVJbnB1dCgpO1xuICAgIHRoaXMubW9kZWwuZm9jdXNlZCA9IHRydWU7XG4gIH0sXG5cbiAgX2hhbmRsZUJsdXI6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyB0aGlzLm1vZGVsLmZvY3VzZWQgPSBmYWxzZTtcbiAgfSxcblxuICBfaGFuZGxlUmVzaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmVsIHx8ICFzdWdnZXN0aW9uc1ZpZXcpIHsgcmV0dXJuOyB9XG4gICAgdmFyIG5vZGUgPSB0aGlzLmVsO1xuICAgIHZhciB0b3AgPSBub2RlLm9mZnNldFRvcDtcbiAgICB2YXIgbGVmdCA9IG5vZGUub2Zmc2V0TGVmdDtcbiAgICB2YXIgaGVscGVyID0gc3VnZ2VzdGlvbnNWaWV3LmVsO1xuXG4gICAgd2hpbGUgKChub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQpKSB7XG4gICAgICBpZiAobm9kZS5vZmZzZXRUb3ApIHtcbiAgICAgICAgdG9wICs9IHBhcnNlSW50KG5vZGUub2Zmc2V0VG9wLCAxMCk7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5vZmZzZXRMZWZ0KSB7XG4gICAgICAgIGxlZnQgKz0gcGFyc2VJbnQobm9kZS5vZmZzZXRMZWZ0LCAxMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdG9wIC09IGhlbHBlci5jbGllbnRIZWlnaHQ7XG4gICAgaGVscGVyLnN0eWxlLnRvcCA9IHRvcDtcbiAgICBoZWxwZXIuc3R5bGUubGVmdCA9IGxlZnQ7XG4gIH0sXG5cbiAgX2hhbmRsZUlucHV0OiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKGV2dCAmJiAoc3BlY2lhbEtleXMuaW5kZXhPZihldnQua2V5Q29kZSkgPiAtMSB8fCBldnQuY3RybEtleSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHZhbCA9IHRoaXMuZWwudGV4dENvbnRlbnQ7XG5cbiAgICB2YXIgZmlsdGVyZWQgPSB0aGlzLl9maWx0ZXIodmFsKTtcbiAgICAvLyB0aGlzLnN1Z2dlc3Rpb25zLnJlc2V0KGZpbHRlcmVkKTtcbiAgICBzdWdnZXN0aW9uc1ZpZXcuc2hvdyhmaWx0ZXJlZCwgdGhpcyk7XG4gICAgdGhpcy5faGFuZGxlUmVzaXplKCk7XG5cbiAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoZXZ0KSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWF0Y2hpbmcgPSBmaWx0ZXJlZFswXS52YWx1ZTtcbiAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgdmFsdWU6IG1hdGNoaW5nXG4gICAgICB9LCB7XG4gICAgICAgIHNpbGVudDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLmVsLnRleHRDb250ZW50ID0gbWF0Y2hpbmc7XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaG9pY2VWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UqL1xuXG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcblxudmFyIENsYXVzZU1vZGVsID0gU3RhdGUuZXh0ZW5kKHtcbiAgcHJvcHM6IHtcbiAgICBsYWJlbDogICAgJ3N0cmluZycsXG4gICAgY2hvaWNlczogICdhcnJheScsXG4gICAgbWFwcGluZzogICdzdHJpbmcnLFxuICAgIGRhdGF0eXBlOiAnc3RyaW5nJ1xuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICBlZGl0YWJsZToge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH0sXG4gICAgZm9jdXNlZDogJ2Jvb2xlYW4nXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IENsYXVzZU1vZGVsLFxuICBDb2xsZWN0aW9uOiBDb2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IENsYXVzZU1vZGVsXG4gIH0pXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgbWVyZ2UgPSBkZXBzKCdsb2Rhc2gubWVyZ2UnKTtcbnZhciBTY29wZUNvbnRyb2xzVmlldyA9IHJlcXVpcmUoJy4vc2NvcGVjb250cm9scy12aWV3Jyk7XG5cblxuXG52YXIgTGFiZWxWaWV3ID0gVmlldy5leHRlbmQobWVyZ2Uoe1xuICBldmVudHM6IHtcbiAgICAnaW5wdXQgLnZhbHVlJzogJ19oYW5kbGVJbnB1dCcsXG4gIH0sXG5cbiAgX2hhbmRsZUlucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbC5sYWJlbCA9IHRoaXMudmFsdWVFbC50ZXh0Q29udGVudC50cmltKCk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlRWwgPSB0aGlzLnZhbHVlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdmFsdWVFbC5jbGFzc05hbWUgPSAndmFsdWUnO1xuICAgIHZhbHVlRWwuc2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnLCB0cnVlKTtcbiAgICB2YWx1ZUVsLnRleHRDb250ZW50ID0gKHRoaXMubW9kZWwubGFiZWwgfHwgJycpLnRyaW0oKTtcbiAgICB0aGlzLmVsLmlubmVySFRNTCA9ICcnO1xuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodmFsdWVFbCk7XG5cblxuICAgIHZhciBjbGF1c2UgPSB0aGlzLm1vZGVsO1xuICAgIHZhciB0YWJsZSA9IGNsYXVzZS5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICB2YXIgYWRkTWV0aG9kID0gY2xhdXNlLmNsYXVzZVR5cGUgPT09ICdpbnB1dCcgPyAnYWRkSW5wdXQnIDogJ2FkZE91dHB1dCc7XG5cbiAgICB2YXIgY3RybHMgPSBuZXcgU2NvcGVDb250cm9sc1ZpZXcoe1xuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgc2NvcGU6IHRoaXMubW9kZWwsXG4gICAgICBjb21tYW5kczogW1xuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6IGNsYXVzZS5jbGF1c2VUeXBlID09PSAnaW5wdXQnID8gJ0lucHV0JyA6ICdPdXRwdXQnLFxuICAgICAgICAgIGljb246IGNsYXVzZS5jbGF1c2VUeXBlLFxuICAgICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxhYmVsOiAnYWRkJyxcbiAgICAgICAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICAgICAgICBoaW50OiAnQWRkIGEgJyArIGNsYXVzZS5jbGF1c2VUeXBlICsgJyBjbGF1c2UnLFxuICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRhYmxlW2FkZE1ldGhvZF0oe30pO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiAnYmVmb3JlJyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdsZWZ0JyxcbiAgICAgICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYSAnICsgY2xhdXNlLmNsYXVzZVR5cGUgKyAnIGJlZm9yZSB0aGlzIG9uZScsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVthZGRNZXRob2RdKHt9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiAnYWZ0ZXInLFxuICAgICAgICAgICAgICAgICAgaWNvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYSAnICsgY2xhdXNlLmNsYXVzZVR5cGUgKyAnIGFmdGVyIHRoaXMgb25lJyxcbiAgICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhYmxlW2FkZE1ldGhvZF0oe30pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdyZW1vdmUnLFxuICAgICAgICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICAgICAgICBoaW50OiAnUmVtb3ZlIHRoZSAnICsgY2xhdXNlLmNsYXVzZVR5cGUgKyAnIGNsYXVzZScsXG4gICAgICAgICAgICAgIHBvc3NpYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXVzZS5jb2xsZWN0aW9uLmxlbmd0aCA+IDE7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlbHRhID0gY2xhdXNlLmNvbGxlY3Rpb24uaW5kZXhPZihjbGF1c2UpO1xuICAgICAgICAgICAgICAgIGNsYXVzZS5jb2xsZWN0aW9uLnJlbW92ZShjbGF1c2UpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNsYXVzZS5jbGF1c2VUeXBlID09PSAnb3V0cHV0Jykge1xuICAgICAgICAgICAgICAgICAgZGVsdGEgKz0gdGFibGUuaW5wdXRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0YWJsZS5ydWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IHJ1bGUuY2VsbHMuYXQoZGVsdGEpO1xuICAgICAgICAgICAgICAgICAgcnVsZS5jZWxscy5yZW1vdmUoY2VsbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGFibGUucnVsZXMudHJpZ2dlcigncmVzZXQnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KGN0cmxzKTtcbiAgICB0aGlzLmVsLmFwcGVuZENoaWxkKGN0cmxzLmVsKTtcbiAgfVxufSkpO1xuXG5cblxuXG52YXIgTWFwcGluZ1ZpZXcgPSBWaWV3LmV4dGVuZChtZXJnZSh7XG4gIGV2ZW50czoge1xuICAgICdpbnB1dCc6ICdfaGFuZGxlSW5wdXQnLFxuICB9LFxuXG4gIF9oYW5kbGVJbnB1dDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwubWFwcGluZyA9IHRoaXMuZWwudGV4dENvbnRlbnQudHJpbSgpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnLCB0cnVlKTtcbiAgICB0aGlzLmVsLnRleHRDb250ZW50ID0gKHRoaXMubW9kZWwubWFwcGluZyB8fCAnJykudHJpbSgpO1xuICB9XG59KSk7XG5cblxuXG5cbnZhciBWYWx1ZVZpZXcgPSBWaWV3LmV4dGVuZChtZXJnZSh7XG4gIGV2ZW50czoge1xuICAgICdpbnB1dCc6ICdfaGFuZGxlSW5wdXQnLFxuICAgICdmb2N1cyc6ICdfaGFuZGxlRm9jdXMnXG4gIH0sXG5cbiAgX2hhbmRsZUlucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbnRlbnQgPSB0aGlzLmVsLnRleHRDb250ZW50LnRyaW0oKTtcblxuICAgIGlmIChjb250ZW50WzBdID09PSAnKCcgJiYgY29udGVudC5zbGljZSgtMSkgPT09ICcpJykge1xuICAgICAgdGhpcy5tb2RlbC5jaG9pY2VzID0gY29udGVudFxuICAgICAgICAuc2xpY2UoMSwgLTEpXG4gICAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgIHJldHVybiBzdHIudHJpbSgpO1xuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICByZXR1cm4gISFzdHI7XG4gICAgICAgIH0pXG4gICAgICAgIDtcbiAgICAgIHRoaXMubW9kZWwuZGF0YXR5cGUgPSBudWxsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMubW9kZWwuY2hvaWNlcyA9IG51bGw7XG4gICAgICB0aGlzLm1vZGVsLmRhdGF0eXBlID0gY29udGVudDtcbiAgICB9XG4gIH0sXG5cbiAgX2hhbmRsZUZvY3VzOiBmdW5jdGlvbiAoKSB7XG5cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgdHJ1ZSk7XG4gICAgdmFyIHN0ciA9ICcnO1xuICAgIGlmICh0aGlzLm1vZGVsLmNob2ljZXMgJiYgdGhpcy5tb2RlbC5jaG9pY2VzLmxlbmd0aCkge1xuICAgICAgc3RyID0gJygnICsgdGhpcy5tb2RlbC5jaG9pY2VzLmpvaW4oJywgJykgKyAnKSc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgc3RyID0gdGhpcy5tb2RlbC5kYXRhdHlwZTtcbiAgICB9XG4gICAgdGhpcy5lbC50ZXh0Q29udGVudCA9IHN0cjtcbiAgfVxufSkpO1xuXG5cblxuXG5cbnZhciByZXF1aXJlZEVsZW1lbnQgPSB7XG4gIHR5cGU6ICdlbGVtZW50JyxcbiAgcmVxdWlyZWQ6IHRydWVcbn07XG5cbnZhciBDbGF1c2VWaWV3ID0gVmlldy5leHRlbmQoe1xuICBzZXNzaW9uOiB7XG4gICAgbGFiZWxFbDogICAgcmVxdWlyZWRFbGVtZW50LFxuICAgIG1hcHBpbmdFbDogIHJlcXVpcmVkRWxlbWVudCxcbiAgICB2YWx1ZUVsOiAgICByZXF1aXJlZEVsZW1lbnRcbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNsYXVzZSA9IHRoaXMubW9kZWw7XG5cbiAgICB2YXIgc3Vidmlld3MgPSB7XG4gICAgICBsYWJlbDogICAgTGFiZWxWaWV3LFxuICAgICAgbWFwcGluZzogIE1hcHBpbmdWaWV3LFxuICAgICAgdmFsdWU6ICAgIFZhbHVlVmlld1xuICAgIH07XG5cbiAgICBPYmplY3Qua2V5cyhzdWJ2aWV3cykuZm9yRWFjaChmdW5jdGlvbiAoa2luZCkge1xuICAgICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0aGlzLm1vZGVsLCAnY2hhbmdlOicgKyBraW5kLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzW2tpbmQgKyAnVmlldyddKSB7XG4gICAgICAgICAgdGhpcy5zdG9wTGlzdGVuaW5nKHRoaXNba2luZCArICdWaWV3J10pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpc1traW5kICsgJ1ZpZXcnXSA9IG5ldyBzdWJ2aWV3c1traW5kXSh7XG4gICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgIG1vZGVsOiAgY2xhdXNlLFxuICAgICAgICAgIGVsOiAgICAgdGhpc1traW5kICsgJ0VsJ11cbiAgICAgICAgfSkucmVuZGVyKCk7XG4gICAgICB9KTtcbiAgICB9LCB0aGlzKTtcbiAgfVxufSk7XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ2xhdXNlVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgQ29sbGVjdGlvbiA9IGRlcHMoJ2FtcGVyc2FuZC1jb2xsZWN0aW9uJyk7XG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcblxudmFyIGRlZmF1bHRDb21tYW5kcyA9IFtcbiAgLy8ge1xuICAvLyAgIGxhYmVsOiAnQWN0aW9ucycsXG4gIC8vICAgc3ViY29tbWFuZHM6IFtcbiAgLy8gICAgIHtcbiAgLy8gICAgICAgbGFiZWw6ICd1bmRvJyxcbiAgLy8gICAgICAgaWNvbjogJ3VuZG8nLFxuICAvLyAgICAgICBmbjogZnVuY3Rpb24gKCkge31cbiAgLy8gICAgIH0sXG4gIC8vICAgICB7XG4gIC8vICAgICAgIGxhYmVsOiAncmVkbycsXG4gIC8vICAgICAgIGljb246ICdyZWRvJyxcbiAgLy8gICAgICAgZm46IGZ1bmN0aW9uICgpIHt9XG4gIC8vICAgICB9XG4gIC8vICAgXVxuICAvLyB9LFxuICB7XG4gICAgbGFiZWw6ICdDZWxsJyxcbiAgICBzdWJjb21tYW5kczogW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ2NsZWFyJyxcbiAgICAgICAgaWNvbjogJ2NsZWFyJyxcbiAgICAgICAgaGludDogJ0NsZWFyIHRoZSBjb250ZW50IG9mIHRoZSBmb2N1c2VkIGNlbGwnLFxuICAgICAgICBwb3NzaWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIGNvbnNvbGUuaW5mbygnY2xlYXIgcG9zc2libGU/JywgYXJndW1lbnRzLCB0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm46IGZ1bmN0aW9uICgpIHt9XG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgbGFiZWw6ICdSdWxlJyxcbiAgICBpY29uOiAnJyxcbiAgICBzdWJjb21tYW5kczogW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ2FkZCcsXG4gICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5hZGRSdWxlKHRoaXMuc2NvcGUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ2NvcHknLFxuICAgICAgICBpY29uOiAnY29weScsXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuY29weVJ1bGUodGhpcy5zY29wZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdhYm92ZScsXG4gICAgICAgICAgICBpY29uOiAnYWJvdmUnLFxuICAgICAgICAgICAgaGludDogJ0NvcHkgdGhlIHJ1bGUgYWJvdmUgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmNvcHlSdWxlKHRoaXMuc2NvcGUsIC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYmVsb3cnLFxuICAgICAgICAgICAgaWNvbjogJ2JlbG93JyxcbiAgICAgICAgICAgIGhpbnQ6ICdDb3B5IHRoZSBydWxlIGJlbG93IHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5jb3B5UnVsZSh0aGlzLnNjb3BlLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAncmVtb3ZlJyxcbiAgICAgICAgaWNvbjogJ21pbnVzJyxcbiAgICAgICAgaGludDogJ1JlbW92ZSB0aGUgZm9jdXNlZCBydWxlJyxcbiAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5yZW1vdmVSdWxlKHRoaXMuc2NvcGUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ2NsZWFyJyxcbiAgICAgICAgaWNvbjogJ2NsZWFyJyxcbiAgICAgICAgaGludDogJ0NsZWFyIHRoZSBmb2N1c2VkIHJ1bGUnLFxuICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmNsZWFyUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGxhYmVsOiAnSW5wdXQnLFxuICAgIGljb246ICdpbnB1dCcsXG4gICAgc3ViY29tbWFuZHM6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdiZWZvcmUnLFxuICAgICAgICAgICAgaWNvbjogJ2xlZnQnLFxuICAgICAgICAgICAgaGludDogJ0FkZCBhbiBpbnB1dCBjbGF1c2UgYmVmb3JlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5hZGRJbnB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdhZnRlcicsXG4gICAgICAgICAgICBpY29uOiAncmlnaHQnLFxuICAgICAgICAgICAgaGludDogJ0FkZCBhbiBpbnB1dCBjbGF1c2UgYWZ0ZXIgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmFkZElucHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwucmVtb3ZlSW5wdXQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGxhYmVsOiAnT3V0cHV0JyxcbiAgICBpY29uOiAnb3V0cHV0JyxcbiAgICBzdWJjb21tYW5kczogW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ2FkZCcsXG4gICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2JlZm9yZScsXG4gICAgICAgICAgICBpY29uOiAnbGVmdCcsXG4gICAgICAgICAgICBoaW50OiAnQWRkIGFuIG91dHB1dCBjbGF1c2UgYmVmb3JlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5hZGRPdXRwdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYWZ0ZXInLFxuICAgICAgICAgICAgaWNvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgIGhpbnQ6ICdBZGQgYW4gb3V0cHV0IGNsYXVzZSBhZnRlciB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuYWRkT3V0cHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwucmVtb3ZlT3V0cHV0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH1cbl07XG5cblxuXG5cblxuXG5cblxuXG52YXIgQ29tbWFuZE1vZGVsID0gU3RhdGUuZXh0ZW5kKHtcbiAgcHJvcHM6IHtcbiAgICBsYWJlbDogJ3N0cmluZycsXG4gICAgaGludDogJ3N0cmluZycsXG4gICAgaWNvbjogJ3N0cmluZycsXG4gICAgaHJlZjogJ3N0cmluZycsXG5cbiAgICBwb3NzaWJsZToge1xuICAgICAgdHlwZTogJ2FueScsXG4gICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBmdW5jdGlvbiAoKSB7fTsgfSxcbiAgICAgIHRlc3Q6IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIG5ld1ZhbHVlICE9PSAnZnVuY3Rpb24nICYmIG5ld1ZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiAnbXVzdCBiZSBlaXRoZXIgYSBmdW5jdGlvbiBvciBmYWxzZSc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZm46IHtcbiAgICAgIHR5cGU6ICdhbnknLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICB0ZXN0OiBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSAhPT0gJ2Z1bmN0aW9uJyAmJiBuZXdWYWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gJ211c3QgYmUgZWl0aGVyIGEgZnVuY3Rpb24gb3IgZmFsc2UnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGRlcml2ZWQ6IHtcbiAgICBkaXNhYmxlZDoge1xuICAgICAgZGVwczogWydwb3NzaWJsZSddLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLnBvc3NpYmxlID09PSAnZnVuY3Rpb24nID8gIXRoaXMucG9zc2libGUoKSA6IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBzdWJjb21tYW5kczogbnVsbCxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0cmlidXRlcykge1xuICAgIHRoaXMuc3ViY29tbWFuZHMgPSBuZXcgQ29tbWFuZHNDb2xsZWN0aW9uKGF0dHJpYnV0ZXMuc3ViY29tbWFuZHMgfHwgW10sIHtcbiAgICAgIHBhcmVudDogdGhpc1xuICAgIH0pO1xuICB9XG59KTtcblxuXG5cblxuXG5cblxuXG5cblxudmFyIENvbW1hbmRzQ29sbGVjdGlvbiA9IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbW9kZWw6IENvbW1hbmRNb2RlbFxufSk7XG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBDb250ZXh0TWVudUl0ZW0gPSBWaWV3LmV4dGVuZCh7XG4gIGF1dG9SZW5kZXI6IHRydWUsXG5cbiAgdGVtcGxhdGU6ICc8bGk+JyArXG4gICAgICAgICAgICAgICc8YT4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJpY29uXCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImxhYmVsXCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAnPC9hPicgK1xuICAgICAgICAgICAgICAnPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPjwvdWw+JyArXG4gICAgICAgICAgICAnPC9saT4nLFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLmxhYmVsJzoge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgc2VsZWN0b3I6ICcubGFiZWwnXG4gICAgfSxcblxuICAgICdtb2RlbC5oaW50Jzoge1xuICAgICAgdHlwZTogJ2F0dHJpYnV0ZScsXG4gICAgICBuYW1lOiAndGl0bGUnXG4gICAgfSxcblxuICAgICdtb2RlbC5mbic6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgc2VsZWN0b3I6ICdhJyxcbiAgICAgIG5vOiAnZGlzYWJsZWQnXG4gICAgfSxcblxuICAgICdtb2RlbC5kaXNhYmxlZCc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgbmFtZTogJ2Rpc2FibGVkJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwuc3ViY29tbWFuZHMubGVuZ3RoJzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5DbGFzcycsXG4gICAgICBuYW1lOiAnZHJvcGRvd24nXG4gICAgfSxcblxuICAgICdtb2RlbC5ocmVmJzoge1xuICAgICAgc2VsZWN0b3I6ICdhJyxcbiAgICAgIG5hbWU6ICdocmVmJyxcbiAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnaHJlZicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnaHJlZicsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAnbW9kZWwuaWNvbic6IHtcbiAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsdWUpIHtcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gJ2ljb24gJyArIHZhbHVlO1xuICAgICAgfSxcbiAgICAgIHNlbGVjdG9yOiAnLmljb24nXG4gICAgfVxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgIGNsaWNrOiAgICAgICdfaGFuZGxlQ2xpY2snLFxuICAgIG1vdXNlb3ZlcjogICdfaGFuZGxlTW91c2VvdmVyJyxcbiAgICBtb3VzZW91dDogICAnX2hhbmRsZU1vdXNlb3V0J1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyV2l0aFRlbXBsYXRlKCk7XG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0aGlzLm1vZGVsLCAnY2hhbmdlOnN1YmNvbW1hbmRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMubW9kZWwuc3ViY29tbWFuZHMsIENvbnRleHRNZW51SXRlbSwgdGhpcy5xdWVyeSgndWwnKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgX2hhbmRsZUNsaWNrOiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKHRoaXMubW9kZWwuZm4pIHtcbiAgICAgIHRoaXMucGFyZW50LnRyaWdnZXJDb21tYW5kKHRoaXMubW9kZWwsIGV2dCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCF0aGlzLm1vZGVsLmhyZWYpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfSxcblxuICBfaGFuZGxlTW91c2VvdmVyOiBmdW5jdGlvbiAoKSB7XG5cbiAgfSxcblxuXG5cbiAgX2hhbmRsZU1vdXNlb3V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgfSxcblxuXG5cbiAgdHJpZ2dlckNvbW1hbmQ6IGZ1bmN0aW9uIChjb21tYW5kLCBldnQpIHtcbiAgICB0aGlzLnBhcmVudC50cmlnZ2VyQ29tbWFuZChjb21tYW5kLCBldnQpO1xuICB9XG59KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgQ29udGV4dE1lbnVWaWV3ID0gVmlldy5leHRlbmQoe1xuICBhdXRvUmVuZGVyOiB0cnVlLFxuXG4gIHRlbXBsYXRlOiAnPG5hdiBjbGFzcz1cImRtbi1jb250ZXh0LW1lbnVcIj4nICtcbiAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjb29yZGluYXRlc1wiPicgK1xuICAgICAgICAgICAgICAgICc8bGFiZWw+Q29vcmRzOjwvbGFiZWw+JyArXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwieFwiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ5XCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICc8dWw+PC91bD4nICtcbiAgICAgICAgICAgICc8L25hdj4nLFxuXG4gIGNvbGxlY3Rpb25zOiB7XG4gICAgY29tbWFuZHM6IENvbW1hbmRzQ29sbGVjdGlvblxuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICBpc09wZW46ICdib29sZWFuJyxcbiAgICBzY29wZTogICdzdGF0ZSdcbiAgfSxcblxuICBiaW5kaW5nczoge1xuICAgIGlzT3Blbjoge1xuICAgICAgdHlwZTogJ3RvZ2dsZSdcbiAgICB9LFxuICAgICdwYXJlbnQubW9kZWwueCc6IHtcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIHNlbGVjdG9yOiAnZGl2IHNwYW4ueCdcbiAgICB9LFxuICAgICdwYXJlbnQubW9kZWwueSc6IHtcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIHNlbGVjdG9yOiAnZGl2IHNwYW4ueSdcbiAgICB9XG4gIH0sXG5cbiAgb3BlbjogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgc3R5bGUgPSB0aGlzLmVsLnN0eWxlO1xuXG4gICAgc3R5bGUubGVmdCA9IG9wdGlvbnMubGVmdCArICdweCc7XG4gICAgc3R5bGUudG9wID0gb3B0aW9ucy50b3AgKyAncHgnO1xuXG4gICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuXG4gICAgdGhpcy5zY29wZSA9IG9wdGlvbnMuc2NvcGU7XG4gICAgdmFyIGNvbW1hbmRzID0gb3B0aW9ucy5jb21tYW5kcyB8fCBkZWZhdWx0Q29tbWFuZHM7XG5cbiAgICB0aGlzLmNvbW1hbmRzLnJlc2V0KGNvbW1hbmRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICB0cmlnZ2VyQ29tbWFuZDogZnVuY3Rpb24gKGNvbW1hbmQsIGV2dCkge1xuICAgIGNvbW1hbmQuZm4uY2FsbCh0aGlzLCBldnQpO1xuICAgIGlmICghY29tbWFuZC5rZWVwT3Blbikge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICB0aGlzLmNhY2hlRWxlbWVudHMoe1xuICAgICAgY29tbWFuZHNFbDogJ3VsJ1xuICAgIH0pO1xuICAgIHRoaXMuY29tbWFuZHNWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuY29tbWFuZHMsIENvbnRleHRNZW51SXRlbSwgdGhpcy5jb21tYW5kc0VsKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIGluc3RhbmNlO1xuQ29udGV4dE1lbnVWaWV3Lmluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIWluc3RhbmNlKSB7XG4gICAgaW5zdGFuY2UgPSBuZXcgQ29udGV4dE1lbnVWaWV3KCk7XG4gIH1cblxuICBpZiAoIWRvY3VtZW50LmJvZHkuY29udGFpbnMoaW5zdGFuY2UuZWwpKSB7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnN0YW5jZS5lbCk7XG4gIH1cblxuICByZXR1cm4gaW5zdGFuY2U7XG59O1xuXG5Db250ZXh0TWVudVZpZXcuQ29sbGVjdGlvbiA9IENvbW1hbmRzQ29sbGVjdGlvbjtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250ZXh0TWVudVZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBEZWNpc2lvblRhYmxlID0gcmVxdWlyZSgnLi90YWJsZS1kYXRhJyk7XG52YXIgUnVsZVZpZXcgPSByZXF1aXJlKCcuL3J1bGUtdmlldycpO1xuXG5cblxuXG52YXIgQ2xhdXNlSGVhZGVyVmlldyA9IHJlcXVpcmUoJy4vY2xhdXNlLXZpZXcnKTtcblxudmFyIENvbnRleHRNZW51VmlldyA9IHJlcXVpcmUoJy4vY29udGV4dG1lbnUtdmlldycpO1xudmFyIGNvbnRleHRNZW51ID0gQ29udGV4dE1lbnVWaWV3Lmluc3RhbmNlKCk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cblxuLy8gdmFyIFNjb3BlQ29udHJvbHNWaWV3ID0gcmVxdWlyZSgnLi9zY29wZWNvbnRyb2xzLXZpZXcnKTtcblxuZnVuY3Rpb24gdG9BcnJheShlbHMpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShlbHMpO1xufVxuXG5cbmZ1bmN0aW9uIG1ha2VUZCh0eXBlKSB7XG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gIGVsLmNsYXNzTmFtZSA9IHR5cGU7XG4gIHJldHVybiBlbDtcbn1cblxuXG5mdW5jdGlvbiBtYWtlQWRkQnV0dG9uKGNsYXVzZVR5cGUsIHRhYmxlKSB7XG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgZWwuY2xhc3NOYW1lID0gJ2ljb24tZG1uIGljb24tcGx1cyc7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHRhYmxlW2NsYXVzZVR5cGUgPT09ICdpbnB1dCcgPyAnYWRkSW5wdXQnIDogJ2FkZE91dHB1dCddKCk7XG4gIH0pO1xuICByZXR1cm4gZWw7XG59XG5cblxuXG5cbnZhciBEZWNpc2lvblRhYmxlVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgYXV0b1JlbmRlcjogdHJ1ZSxcblxuICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJkbW4tdGFibGVcIj4nICtcbiAgICAgICAgICAgICAgJzxkaXYgZGF0YS1ob29rPVwiY29udHJvbHNcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzxoZWFkZXI+JyArXG4gICAgICAgICAgICAgICAgJzxoMyBkYXRhLWhvb2s9XCJ0YWJsZS1uYW1lXCI+PC9oMz4nICtcbiAgICAgICAgICAgICAgJzwvaGVhZGVyPicgK1xuICAgICAgICAgICAgICAnPHRhYmxlPicgK1xuICAgICAgICAgICAgICAgICc8dGhlYWQ+JyArXG4gICAgICAgICAgICAgICAgICAnPHRyPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHRoIGNsYXNzPVwiaGl0XCIgcnVsZXNwYW49XCI0XCI+PC90aD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0aCBjbGFzcz1cImlucHV0IGRvdWJsZS1ib3JkZXItcmlnaHRcIiBjb2xzcGFuPVwiMlwiPklucHV0PC90aD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0aCBjbGFzcz1cIm91dHB1dFwiIGNvbHNwYW49XCIyXCI+T3V0cHV0PC90aD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0aCBjbGFzcz1cImFubm90YXRpb25cIiBydWxlc3Bhbj1cIjRcIj5Bbm5vdGF0aW9uPC90aD4nICtcbiAgICAgICAgICAgICAgICAgICc8L3RyPicgK1xuICAgICAgICAgICAgICAgICAgJzx0ciBjbGFzcz1cImxhYmVsc1wiPjwvdHI+JyArXG4gICAgICAgICAgICAgICAgICAnPHRyIGNsYXNzPVwidmFsdWVzXCI+PC90cj4nICtcbiAgICAgICAgICAgICAgICAgICc8dHIgY2xhc3M9XCJtYXBwaW5nc1wiPjwvdHI+JyArXG4gICAgICAgICAgICAgICAgJzwvdGhlYWQ+JyArXG4gICAgICAgICAgICAgICAgJzx0Ym9keT48L3Rib2R5PicgK1xuICAgICAgICAgICAgICAnPC90YWJsZT4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nLFxuXG4gIGV2ZW50czoge1xuICAgICdjbGljayAuYWRkLXJ1bGUgYSc6ICdfaGFuZGxlQWRkUnVsZUNsaWNrJ1xuICB9LFxuXG4gIF9oYW5kbGVBZGRSdWxlQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vZGVsLmFkZFJ1bGUoKTtcbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbCA9IHRoaXMubW9kZWwgfHwgbmV3IERlY2lzaW9uVGFibGUuTW9kZWwoKTtcbiAgfSxcblxuICBoaWRlQ29udGV4dE1lbnU6IGZ1bmN0aW9uICgpIHtcbiAgICBjb250ZXh0TWVudS5jbG9zZSgpO1xuICB9LFxuXG4gIHNob3dDb250ZXh0TWVudTogZnVuY3Rpb24gKGNlbGxNb2RlbCwgZXZ0KSB7XG4gICAgdmFyIG9wdGlvbnMgPSB1dGlscy5lbE9mZnNldChldnQuY3VycmVudFRhcmdldCk7XG4gICAgb3B0aW9ucy5zY29wZSA9IGNlbGxNb2RlbDtcbiAgICBvcHRpb25zLmxlZnQgKz0gZXZ0LmN1cnJlbnRUYXJnZXQuY2xpZW50V2lkdGg7XG4gICAgdmFyIHRhYmxlID0gdGhpcy5tb2RlbDtcblxuICAgIG9wdGlvbnMuY29tbWFuZHMgPSBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnUnVsZScsXG4gICAgICAgIGljb246ICcnLFxuICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYWRkJyxcbiAgICAgICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRhYmxlLmFkZFJ1bGUodGhpcy5zY29wZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnYWJvdmUnLFxuICAgICAgICAgICAgICAgIGljb246ICdhYm92ZScsXG4gICAgICAgICAgICAgICAgaGludDogJ0FkZCBhIHJ1bGUgYWJvdmUgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdGFibGUuYWRkUnVsZSh0aGlzLnNjb3BlLCAtMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICdiZWxvdycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2JlbG93JyxcbiAgICAgICAgICAgICAgICBoaW50OiAnQWRkIGEgcnVsZSBiZWxvdyB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB0YWJsZS5hZGRSdWxlKHRoaXMuc2NvcGUsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLy8ge1xuICAgICAgICAgIC8vICAgbGFiZWw6ICdjb3B5JyxcbiAgICAgICAgICAvLyAgIGljb246ICdjb3B5JyxcbiAgICAgICAgICAvLyAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gICAgIHRhYmxlLmNvcHlSdWxlKHRoaXMuc2NvcGUpO1xuICAgICAgICAgIC8vICAgfSxcbiAgICAgICAgICAvLyAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAgLy8gICAgIHtcbiAgICAgICAgICAvLyAgICAgICBsYWJlbDogJ2Fib3ZlJyxcbiAgICAgICAgICAvLyAgICAgICBpY29uOiAnYWJvdmUnLFxuICAgICAgICAgIC8vICAgICAgIGhpbnQ6ICdDb3B5IHRoZSBydWxlIGFib3ZlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgLy8gICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyAgICAgICAgIHRhYmxlLmNvcHlSdWxlKHRoaXMuc2NvcGUsIC0xKTtcbiAgICAgICAgICAvLyAgICAgICB9XG4gICAgICAgICAgLy8gICAgIH0sXG4gICAgICAgICAgLy8gICAgIHtcbiAgICAgICAgICAvLyAgICAgICBsYWJlbDogJ2JlbG93JyxcbiAgICAgICAgICAvLyAgICAgICBpY29uOiAnYmVsb3cnLFxuICAgICAgICAgIC8vICAgICAgIGhpbnQ6ICdDb3B5IHRoZSBydWxlIGJlbG93IHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgLy8gICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyAgICAgICAgIHRhYmxlLmNvcHlSdWxlKHRoaXMuc2NvcGUsIDEpO1xuICAgICAgICAgIC8vICAgICAgIH1cbiAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgIC8vICAgXVxuICAgICAgICAgIC8vIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdyZW1vdmUnLFxuICAgICAgICAgICAgaWNvbjogJ21pbnVzJyxcbiAgICAgICAgICAgIGhpbnQ6ICdSZW1vdmUgdGhlIGZvY3VzZWQgcnVsZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0YWJsZS5yZW1vdmVSdWxlKHRoaXMuc2NvcGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdjbGVhcicsXG4gICAgICAgICAgICBpY29uOiAnY2xlYXInLFxuICAgICAgICAgICAgaGludDogJ0NsZWFyIHRoZSBmb2N1c2VkIHJ1bGUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGFibGUuY2xlYXJSdWxlKHRoaXMuc2NvcGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF07XG5cbiAgICB2YXIgdHlwZSA9IGNlbGxNb2RlbC50eXBlO1xuICAgIHZhciBhZGRNZXRob2QgPSB0eXBlID09PSAnaW5wdXQnID8gJ2FkZElucHV0JyA6ICdhZGRPdXRwdXQnO1xuXG4gICAgb3B0aW9ucy5jb21tYW5kcy51bnNoaWZ0KHtcbiAgICAgIGxhYmVsOiB0eXBlID09PSAnaW5wdXQnID8gJ0lucHV0JyA6ICdPdXRwdXQnLFxuICAgICAgaWNvbjogdHlwZSxcbiAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogJ2FkZCcsXG4gICAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0YWJsZVthZGRNZXRob2RdKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ2JlZm9yZScsXG4gICAgICAgICAgICAgIGljb246ICdsZWZ0JyxcbiAgICAgICAgICAgICAgaGludDogJ0FkZCBhbiAnICsgdHlwZSArICcgY2xhdXNlIGJlZm9yZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRhYmxlW2FkZE1ldGhvZF0oKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdhZnRlcicsXG4gICAgICAgICAgICAgIGljb246ICdyaWdodCcsXG4gICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYW4gJyArIHR5cGUgKyAnIGNsYXVzZSBhZnRlciB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRhYmxlW2FkZE1ldGhvZF0oKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAncmVtb3ZlJyxcbiAgICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICAgIGhpbnQ6ICdSZW1vdmUgdGhlICcgKyB0eXBlICsgJyBjbGF1c2UnLFxuICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY2xhdXNlID0gY2VsbE1vZGVsLmNsYXVzZTtcbiAgICAgICAgICAgIHZhciBkZWx0YSA9IGNsYXVzZS5jb2xsZWN0aW9uLmluZGV4T2YoY2xhdXNlKTtcbiAgICAgICAgICAgIGNsYXVzZS5jb2xsZWN0aW9uLnJlbW92ZShjbGF1c2UpO1xuXG4gICAgICAgICAgICBpZiAoY2xhdXNlLmNsYXVzZVR5cGUgPT09ICdvdXRwdXQnKSB7XG4gICAgICAgICAgICAgIGRlbHRhICs9IHRhYmxlLmlucHV0cy5sZW5ndGg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhYmxlLnJ1bGVzLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgICAgICAgdmFyIGNlbGwgPSBydWxlLmNlbGxzLmF0KGRlbHRhKTtcbiAgICAgICAgICAgICAgcnVsZS5jZWxscy5yZW1vdmUoY2VsbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRhYmxlLnJ1bGVzLnRyaWdnZXIoJ3Jlc2V0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG5cbiAgICBjb250ZXh0TWVudS5vcGVuKG9wdGlvbnMpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH0sXG5cblxuICBwYXJzZUNob2ljZXM6IGZ1bmN0aW9uIChlbCkge1xuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVybiAnTUlTU0lORyc7XG4gICAgfVxuICAgIHZhciBjb250ZW50ID0gZWwudGV4dENvbnRlbnQudHJpbSgpO1xuXG4gICAgaWYgKGNvbnRlbnRbMF0gPT09ICcoJyAmJiBjb250ZW50LnNsaWNlKC0xKSA9PT0gJyknKSB7XG4gICAgICByZXR1cm4gY29udGVudFxuICAgICAgICAuc2xpY2UoMSwgLTEpXG4gICAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgIHJldHVybiBzdHIudHJpbSgpO1xuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICByZXR1cm4gISFzdHI7XG4gICAgICAgIH0pXG4gICAgICAgIDtcbiAgICB9XG5cbiAgICByZXR1cm4gW107XG4gIH0sXG5cbiAgcGFyc2VSdWxlczogZnVuY3Rpb24gKHJ1bGVFbHMpIHtcbiAgICByZXR1cm4gcnVsZUVscy5tYXAoZnVuY3Rpb24gKGVsKSB7XG4gICAgICByZXR1cm4gZWwudGV4dENvbnRlbnQudHJpbSgpO1xuICAgIH0pO1xuICB9LFxuXG4gIHBhcnNlVGFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW5wdXRzID0gW107XG4gICAgdmFyIG91dHB1dHMgPSBbXTtcbiAgICB2YXIgcnVsZXMgPSBbXTtcblxuICAgIHRoaXMucXVlcnlBbGwoJ3RoZWFkIC5sYWJlbHMgLmlucHV0JykuZm9yRWFjaChmdW5jdGlvbiAoZWwsIG51bSkge1xuICAgICAgdmFyIGNob2ljZUVscyA9IHRoaXMucXVlcnkoJ3RoZWFkIC52YWx1ZXMgLmlucHV0Om50aC1jaGlsZCgnICsgKG51bSArIDEpICsgJyknKTtcblxuICAgICAgaW5wdXRzLnB1c2goe1xuICAgICAgICBsYWJlbDogICAgZWwudGV4dENvbnRlbnQudHJpbSgpLFxuICAgICAgICBjaG9pY2VzOiAgdGhpcy5wYXJzZUNob2ljZXMoY2hvaWNlRWxzKVxuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0aGlzLnF1ZXJ5QWxsKCd0aGVhZCAubGFiZWxzIC5vdXRwdXQnKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgbnVtKSB7XG4gICAgICB2YXIgY2hvaWNlRWxzID0gdGhpcy5xdWVyeSgndGhlYWQgLnZhbHVlcyAub3V0cHV0Om50aC1jaGlsZCgnICsgKG51bSArIGlucHV0cy5sZW5ndGggKyAxKSArICcpJyk7XG5cbiAgICAgIG91dHB1dHMucHVzaCh7XG4gICAgICAgIGxhYmVsOiAgICBlbC50ZXh0Q29udGVudC50cmltKCksXG4gICAgICAgIGNob2ljZXM6ICB0aGlzLnBhcnNlQ2hvaWNlcyhjaG9pY2VFbHMpXG4gICAgICB9KTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRoaXMucXVlcnlBbGwoJ3Rib2R5IHRyJykuZm9yRWFjaChmdW5jdGlvbiAocm93KSB7XG4gICAgICB2YXIgY2VsbHMgPSBbXTtcbiAgICAgIHZhciBjZWxsRWxzID0gcm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RkJyk7XG5cbiAgICAgIGZvciAodmFyIGMgPSAxOyBjIDwgY2VsbEVscy5sZW5ndGg7IGMrKykge1xuICAgICAgICB2YXIgY2hvaWNlcyA9IG51bGw7XG4gICAgICAgIHZhciB2YWx1ZSA9IGNlbGxFbHNbY10udGV4dENvbnRlbnQudHJpbSgpO1xuICAgICAgICB2YXIgdHlwZSA9IGMgPD0gaW5wdXRzLmxlbmd0aCA/ICdpbnB1dCcgOiAoYyA8IChjZWxsRWxzLmxlbmd0aCAtIDEpID8gJ291dHB1dCcgOiAnYW5ub3RhdGlvbicpO1xuICAgICAgICB2YXIgb2MgPSBjIC0gKGlucHV0cy5sZW5ndGggKyAxKTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gJ2lucHV0JyAmJiBpbnB1dHNbYyAtIDFdKSB7XG4gICAgICAgICAgY2hvaWNlcyA9IGlucHV0c1tjIC0gMV0uY2hvaWNlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnb3V0cHV0JyAmJiBvdXRwdXRzW29jXSkge1xuICAgICAgICAgIGNob2ljZXMgPSBvdXRwdXRzW29jXS5jaG9pY2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgY2VsbHMucHVzaCh7XG4gICAgICAgICAgdmFsdWU6ICAgIHZhbHVlLFxuICAgICAgICAgIGNob2ljZXM6ICBjaG9pY2VzXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBydWxlcy5wdXNoKHtcbiAgICAgICAgY2VsbHM6IGNlbGxzXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMubW9kZWwubmFtZSA9IHRoaXMucXVlcnkoJ2gzJykudGV4dENvbnRlbnQudHJpbSgpO1xuICAgIHRoaXMubW9kZWwuaW5wdXRzLnJlc2V0KGlucHV0cyk7XG4gICAgdGhpcy5tb2RlbC5vdXRwdXRzLnJlc2V0KG91dHB1dHMpO1xuICAgIHRoaXMubW9kZWwucnVsZXMucmVzZXQocnVsZXMpO1xuXG4gICAgcmV0dXJuIHRoaXMudG9KU09OKCk7XG4gIH0sXG5cbiAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWwudG9KU09OKCk7XG4gIH0sXG5cbiAgaW5wdXRDbGF1c2VWaWV3czogW10sXG4gIG91dHB1dENsYXVzZVZpZXdzOiBbXSxcblxuICBfaGVhZGVyQ2xlYXI6IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdG9BcnJheSh0aGlzLmxhYmVsc1Jvd0VsLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nKyB0eXBlKSkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHRoaXMubGFiZWxzUm93RWwucmVtb3ZlQ2hpbGQoZWwpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdG9BcnJheSh0aGlzLnZhbHVlc1Jvd0VsLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nKyB0eXBlKSkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHRoaXMudmFsdWVzUm93RWwucmVtb3ZlQ2hpbGQoZWwpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdG9BcnJheSh0aGlzLm1hcHBpbmdzUm93RWwucXVlcnlTZWxlY3RvckFsbCgnLicrIHR5cGUpKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgdGhpcy5tYXBwaW5nc1Jvd0VsLnJlbW92ZUNoaWxkKGVsKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmVsKSB7XG4gICAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMucGFyc2VUYWJsZSgpO1xuICAgICAgdGhpcy50cmlnZ2VyKCdjaGFuZ2U6ZWwnKTtcbiAgICB9XG5cbiAgICB2YXIgdGFibGUgPSB0aGlzLm1vZGVsO1xuXG4gICAgaWYgKCF0aGlzLmhlYWRlckVsKSB7XG4gICAgICB0aGlzLmNhY2hlRWxlbWVudHMoe1xuICAgICAgICB0YWJsZUVsOiAgICAgICAgICAndGFibGUnLFxuICAgICAgICBsYWJlbEVsOiAgICAgICAgICAnaGVhZGVyIGgzJyxcbiAgICAgICAgaGVhZGVyRWw6ICAgICAgICAgJ3RoZWFkJyxcbiAgICAgICAgYm9keUVsOiAgICAgICAgICAgJ3Rib2R5JyxcbiAgICAgICAgaW5wdXRzSGVhZGVyRWw6ICAgJ3RoZWFkIHRyOm50aC1jaGlsZCgxKSB0aC5pbnB1dCcsXG4gICAgICAgIG91dHB1dHNIZWFkZXJFbDogICd0aGVhZCB0cjpudGgtY2hpbGQoMSkgdGgub3V0cHV0JyxcbiAgICAgICAgbGFiZWxzUm93RWw6ICAgICAgJ3RoZWFkIHRyLmxhYmVscycsXG4gICAgICAgIHZhbHVlc1Jvd0VsOiAgICAgICd0aGVhZCB0ci52YWx1ZXMnLFxuICAgICAgICBtYXBwaW5nc1Jvd0VsOiAgICAndGhlYWQgdHIubWFwcGluZ3MnXG4gICAgICB9KTtcblxuXG4gICAgICB0aGlzLmlucHV0c0hlYWRlckVsLmFwcGVuZENoaWxkKG1ha2VBZGRCdXR0b24oJ2lucHV0JywgdGFibGUpKTtcblxuICAgICAgdGhpcy5vdXRwdXRzSGVhZGVyRWwuYXBwZW5kQ2hpbGQobWFrZUFkZEJ1dHRvbignb3V0cHV0JywgdGFibGUpKTtcblxuICAgICAgLypcbiAgICAgIHZhciBpbnB1dHNIZWFkZXJWaWV3ID0gbmV3IFNjb3BlQ29udHJvbHNWaWV3KHtcbiAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICBzY29wZTogdGhpcy5tb2RlbCxcbiAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0FkZCBpbnB1dCcsXG4gICAgICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgICAgICBoaW50OiAnQWRkIGFuIGlucHV0IGNsYXVzZSBhZnRlciBvbiB0aGUgcmlnaHQnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGFibGUuYWRkSW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZWdpc3RlclN1YnZpZXcoaW5wdXRzSGVhZGVyVmlldyk7XG4gICAgICB0aGlzLmlucHV0c0hlYWRlckVsLmFwcGVuZENoaWxkKGlucHV0c0hlYWRlclZpZXcuZWwpO1xuXG4gICAgICB2YXIgb3V0cHV0c0hlYWRlclZpZXcgPSBuZXcgU2NvcGVDb250cm9sc1ZpZXcoe1xuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIHNjb3BlOiB0aGlzLm1vZGVsLFxuICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnQWRkIG91dHB1dCcsXG4gICAgICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgICAgICBoaW50OiAnQWRkIGFuIG91dHB1dCBjbGF1c2Ugb24gdGhlIHJpZ2h0JyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRhYmxlLmFkZE91dHB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICB0aGlzLnJlZ2lzdGVyU3VidmlldyhvdXRwdXRzSGVhZGVyVmlldyk7XG4gICAgICB0aGlzLm91dHB1dHNIZWFkZXJFbC5hcHBlbmRDaGlsZChvdXRwdXRzSGVhZGVyVmlldy5lbCk7XG4gICAgICAqL1xuICAgIH1cblxuXG4gICAgWydpbnB1dCcsICdvdXRwdXQnXS5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWxbdHlwZSArICdzJ10sICdhZGQgcmVzZXQgcmVtb3ZlJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBjb2xzID0gdGhpcy5tb2RlbFt0eXBlICsgJ3MnXS5sZW5ndGg7XG4gICAgICAgIGlmIChjb2xzID4gMSkge1xuICAgICAgICAgIHRoaXNbdHlwZSArICdzSGVhZGVyRWwnXS5zZXRBdHRyaWJ1dGUoJ2NvbHNwYW4nLCBjb2xzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzW3R5cGUgKyAnc0hlYWRlckVsJ10ucmVtb3ZlQXR0cmlidXRlKCdjb2xzcGFuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oZWFkZXJDbGVhcih0eXBlKTtcbiAgICAgICAgdGhpc1t0eXBlICsgJ0NsYXVzZVZpZXdzJ10uZm9yRWFjaChmdW5jdGlvbiAodmlldykge1xuICAgICAgICAgIHZpZXcucmVtb3ZlKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubW9kZWxbdHlwZSArICdzJ10uZm9yRWFjaChmdW5jdGlvbiAoY2xhdXNlKSB7XG4gICAgICAgICAgdmFyIGxhYmVsRWwgPSBtYWtlVGQodHlwZSk7XG4gICAgICAgICAgdmFyIHZhbHVlRWwgPSBtYWtlVGQodHlwZSk7XG4gICAgICAgICAgdmFyIG1hcHBpbmdFbCA9IG1ha2VUZCh0eXBlKTtcblxuICAgICAgICAgIHZhciB2aWV3ID0gbmV3IENsYXVzZUhlYWRlclZpZXcoe1xuICAgICAgICAgICAgbGFiZWxFbDogICAgbGFiZWxFbCxcbiAgICAgICAgICAgIHZhbHVlRWw6ICAgIHZhbHVlRWwsXG4gICAgICAgICAgICBtYXBwaW5nRWw6ICBtYXBwaW5nRWwsXG5cbiAgICAgICAgICAgIG1vZGVsOiAgICAgIGNsYXVzZSxcbiAgICAgICAgICAgIHBhcmVudDogICAgIHRoaXNcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIFsnbGFiZWwnLCAndmFsdWUnLCAnbWFwcGluZyddLmZvckVhY2goZnVuY3Rpb24gKGtpbmQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnaW5wdXQnKSB7XG4gICAgICAgICAgICAgIHRoaXNba2luZCArJ3NSb3dFbCddLmluc2VydEJlZm9yZSh2aWV3W2tpbmQgKyAnRWwnXSwgdGhpc1traW5kICsnc1Jvd0VsJ10ucXVlcnlTZWxlY3RvcignLm91dHB1dCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzW2tpbmQgKydzUm93RWwnXS5hcHBlbmRDaGlsZCh2aWV3W2tpbmQgKyAnRWwnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcblxuICAgICAgICAgIHRoaXNbdHlwZSArICdDbGF1c2VWaWV3cyddLnB1c2godmlldyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cblxuICAgIHRoaXMuYm9keUVsLmlubmVySFRNTCA9ICcnO1xuICAgIHRoaXMucnVsZXNWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMubW9kZWwucnVsZXMsIFJ1bGVWaWV3LCB0aGlzLmJvZHlFbCk7XG5cblxuICAgIGlmICghdGhpcy5mb290RWwpIHtcbiAgICAgIHZhciBmb290RWwgPSB0aGlzLmZvb3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rmb290Jyk7XG4gICAgICBmb290RWwuY2xhc3NOYW1lID0gJ3J1bGVzLWNvbnRyb2xzJztcbiAgICAgIGZvb3RFbC5pbm5lckhUTUwgPSAnPHRyPjx0ZCBjbGFzcz1cImFkZC1ydWxlXCI+PGEgdGl0bGU9XCJBZGQgYSBydWxlXCIgY2xhc3M9XCJpY29uLWRtbiBpY29uLXBsdXNcIj48L2E+PC90ZD48L3RyPic7XG4gICAgICB0aGlzLnRhYmxlRWwuYXBwZW5kQ2hpbGQoZm9vdEVsKTtcblxuICAgIH1cblxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlY2lzaW9uVGFibGVWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG5kZXBzKCcuL2NsYXNzTGlzdCcpO1xuXG5cbnZhciBEZWNpc2lvblRhYmxlVmlldyA9IHJlcXVpcmUoJy4vZGVjaXNpb24tdGFibGUtdmlldycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRGVjaXNpb25UYWJsZVZpZXc7XG5cbmZ1bmN0aW9uIG5vZGVMaXN0YXJyYXkoZWxzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGVscykpIHtcbiAgICByZXR1cm4gZWxzO1xuICB9XG4gIHZhciBhcnIgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbHMubGVuZ3RoOyBpKyspIHtcbiAgICBhcnIucHVzaChlbHNbaV0pO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdEFsbChzZWxlY3RvciwgY3R4KSB7XG4gIGN0eCA9IGN0eCB8fCBkb2N1bWVudDtcbiAgcmV0dXJuIG5vZGVMaXN0YXJyYXkoY3R4LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbn1cbndpbmRvdy5zZWxlY3RBbGwgPSBzZWxlY3RBbGw7IiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgcmVxdWlyZTogZmFsc2UsIGRlcHM6IGZhbHNlKi9cblxudmFyIENsYXVzZSA9IHJlcXVpcmUoJy4vY2xhdXNlLWRhdGEnKTtcblxudmFyIElucHV0TW9kZWwgPSBDbGF1c2UuTW9kZWwuZXh0ZW5kKHtcbiAgY2xhdXNlVHlwZTogJ2lucHV0J1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogSW5wdXRNb2RlbCxcbiAgQ29sbGVjdGlvbjogQ2xhdXNlLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICBtb2RlbDogSW5wdXRNb2RlbFxuICB9KVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIG1vZHVsZTogZmFsc2UsIHJlcXVpcmU6IGZhbHNlLCBkZXBzOiBmYWxzZSovXG5cbnZhciBDbGF1c2UgPSByZXF1aXJlKCcuL2NsYXVzZS1kYXRhJyk7XG5cbnZhciBPdXRwdXRNb2RlbCA9IENsYXVzZS5Nb2RlbC5leHRlbmQoe1xuICBjbGF1c2VUeXBlOiAnb3V0cHV0J1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogT3V0cHV0TW9kZWwsXG4gIENvbGxlY3Rpb246IENsYXVzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IE91dHB1dE1vZGVsXG4gIH0pXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgcmVxdWlyZTogZmFsc2UsIGRlcHM6IGZhbHNlKi9cblxudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG52YXIgQ29sbGVjdGlvbiA9IGRlcHMoJ2FtcGVyc2FuZC1jb2xsZWN0aW9uJyk7XG52YXIgQ2VsbCA9IHJlcXVpcmUoJy4vY2VsbC1kYXRhJyk7XG5cbnZhciBSdWxlTW9kZWwgPSBTdGF0ZS5leHRlbmQoe1xuICBzZXNzaW9uOiB7XG4gICAgZm9jdXNlZDogJ2Jvb2xlYW4nXG4gIH0sXG5cbiAgY29sbGVjdGlvbnM6IHtcbiAgICBjZWxsczogQ2VsbC5Db2xsZWN0aW9uXG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIGRlbHRhOiB7XG4gICAgICBkZXA6IFsnY29sbGVjdGlvbiddLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIDEgKyB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5wdXRDZWxsczoge1xuICAgICAgZGVwOiBbJ2NlbGxzJywgJ2NvbGxlY3Rpb24ucGFyZW50LmlucHV0cyddLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHMubW9kZWxzLnNsaWNlKDAsIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuaW5wdXRzLmxlbmd0aCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG91dHB1dENlbGxzOiB7XG4gICAgICBkZXA6IFsnY2VsbHMnLCAnY29sbGVjdGlvbi5wYXJlbnQuaW5wdXRzJ10sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxscy5tb2RlbHMuc2xpY2UodGhpcy5jb2xsZWN0aW9uLnBhcmVudC5pbnB1dHMubGVuZ3RoLCAtMSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFubm90YXRpb246IHtcbiAgICAgIGRlcDogWydjZWxscyddLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHMubW9kZWxzW3RoaXMuY2VsbHMubGVuZ3RoIC0gMV07XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1vZGVsOiBSdWxlTW9kZWwsXG5cbiAgQ29sbGVjdGlvbjogQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBSdWxlTW9kZWwsXG4gIH0pXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgQ2VsbFZpZXdzID0gcmVxdWlyZSgnLi9jZWxsLXZpZXcnKTtcbnZhciBTY29wZUNvbnRyb2xzVmlldyA9IHJlcXVpcmUoJy4vc2NvcGVjb250cm9scy12aWV3Jyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cblxudmFyIFJ1bGVWaWV3ID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogJzx0cj48dGQgY2xhc3M9XCJudW1iZXJcIj4nICtcbiAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwidmFsdWVcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAnPC90ZD48L3RyPicsXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuZGVsdGEnOiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBzZWxlY3RvcjogJy5udW1iZXIgLnZhbHVlJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwuZm9jdXNlZCc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgbmFtZTogJ2ZvY3VzZWQnXG4gICAgfVxuICB9LFxuXG4gIGRlcml2ZWQ6IHtcbiAgICBpbnB1dHM6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3BhcmVudCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwnLFxuICAgICAgICAncGFyZW50Lm1vZGVsLmlucHV0cydcbiAgICAgIF0sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQubW9kZWwuaW5wdXRzO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBvdXRwdXRzOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdwYXJlbnQnLFxuICAgICAgICAncGFyZW50Lm1vZGVsJyxcbiAgICAgICAgJ3BhcmVudC5tb2RlbC5vdXRwdXRzJ1xuICAgICAgXSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5tb2RlbC5vdXRwdXRzO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBhbm5vdGF0aW9uOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdwYXJlbnQnLFxuICAgICAgICAncGFyZW50Lm1vZGVsJyxcbiAgICAgICAgJ3BhcmVudC5tb2RlbC5hbm5vdGF0aW9ucydcbiAgICAgIF0sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQubW9kZWwuYW5ub3RhdGlvbnMuYXQoMCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHBvc2l0aW9uOiB7XG4gICAgICBkZXBzOiBbXSxcbiAgICAgIGNhY2hlOiBmYWxzZSwgLy8gYmVjYXVzZSBvZiByZXNpemVcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7IHJldHVybiB1dGlscy5lbE9mZnNldCh0aGlzLmVsKTsgfVxuICAgIH1cbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJvb3QgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4ocm9vdC5ydWxlcywgJ3Jlc2V0JywgdGhpcy5yZW5kZXIpO1xuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4ocm9vdC5pbnB1dHMsICdyZXNldCcsIHRoaXMucmVuZGVyKTtcbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHJvb3Qub3V0cHV0cywgJ3Jlc2V0JywgdGhpcy5yZW5kZXIpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyV2l0aFRlbXBsYXRlKCk7XG5cbiAgICB0aGlzLmNhY2hlRWxlbWVudHMoe1xuICAgICAgbnVtYmVyRWw6ICcubnVtYmVyJ1xuICAgIH0pO1xuXG4gICAgdmFyIHJ1bGUgPSB0aGlzLm1vZGVsO1xuICAgIHZhciB0YWJsZSA9IHJ1bGUuY29sbGVjdGlvbi5wYXJlbnQ7XG5cbiAgICB2YXIgY3RybHMgPSBuZXcgU2NvcGVDb250cm9sc1ZpZXcoe1xuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgc2NvcGU6IHRoaXMubW9kZWwsXG4gICAgICBjb21tYW5kczogW1xuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdSdWxlJyxcbiAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ2FkZCcsXG4gICAgICAgICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0YWJsZS5hZGRSdWxlKHJ1bGUpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiAnYWJvdmUnLFxuICAgICAgICAgICAgICAgICAgaWNvbjogJ2Fib3ZlJyxcbiAgICAgICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYSBydWxlIGFib3ZlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZS5hZGRSdWxlKHJ1bGUsIC0xKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiAnYmVsb3cnLFxuICAgICAgICAgICAgICAgICAgaWNvbjogJ2JlbG93JyxcbiAgICAgICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYSBydWxlIGJlbG93IHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZS5hZGRSdWxlKHJ1bGUsIDEpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgbGFiZWw6ICdjb3B5JyxcbiAgICAgICAgICAgIC8vICAgaWNvbjogJ2NvcHknLFxuICAgICAgICAgICAgLy8gICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gICAgIHRhYmxlLmNvcHlSdWxlKHJ1bGUpO1xuICAgICAgICAgICAgLy8gICB9LFxuICAgICAgICAgICAgLy8gICBzdWJjb21tYW5kczogW1xuICAgICAgICAgICAgLy8gICAgIHtcbiAgICAgICAgICAgIC8vICAgICAgIGxhYmVsOiAnYWJvdmUnLFxuICAgICAgICAgICAgLy8gICAgICAgaWNvbjogJ2Fib3ZlJyxcbiAgICAgICAgICAgIC8vICAgICAgIGhpbnQ6ICdDb3B5IHRoZSBydWxlIGFib3ZlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICAvLyAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gICAgICAgICB0YWJsZS5jb3B5UnVsZShydWxlLCAtMSk7XG4gICAgICAgICAgICAvLyAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgICAvLyAgICAgICBsYWJlbDogJ2JlbG93JyxcbiAgICAgICAgICAgIC8vICAgICAgIGljb246ICdiZWxvdycsXG4gICAgICAgICAgICAvLyAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBiZWxvdyB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgLy8gICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgdGFibGUuY29weVJ1bGUocnVsZSwgMSk7XG4gICAgICAgICAgICAvLyAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gICBdXG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgICAgICAgIGhpbnQ6ICdSZW1vdmUgdGhpcyBydWxlJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBydWxlLmNvbGxlY3Rpb24ucmVtb3ZlKHJ1bGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ2NsZWFyJyxcbiAgICAgICAgICAgICAgaWNvbjogJ2NsZWFyJyxcbiAgICAgICAgICAgICAgaGludDogJ0NsZWFyIHRoZSBmb2N1c2VkIHJ1bGUnLFxuICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRhYmxlLmNsZWFyUnVsZShydWxlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KGN0cmxzKTtcbiAgICB0aGlzLm51bWJlckVsLmFwcGVuZENoaWxkKGN0cmxzLmVsKTtcblxuICAgIHZhciBpO1xuICAgIHZhciBzdWJ2aWV3O1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuaW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdWJ2aWV3ID0gbmV3IENlbGxWaWV3cy5JbnB1dCh7XG4gICAgICAgIG1vZGVsOiAgdGhpcy5tb2RlbC5jZWxscy5hdChpKSxcbiAgICAgICAgcGFyZW50OiB0aGlzXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5yZWdpc3RlclN1YnZpZXcoc3Vidmlldy5yZW5kZXIoKSk7XG4gICAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHN1YnZpZXcuZWwpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLm91dHB1dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN1YnZpZXcgPSBuZXcgQ2VsbFZpZXdzLk91dHB1dCh7XG4gICAgICAgIG1vZGVsOiAgdGhpcy5tb2RlbC5jZWxscy5hdCh0aGlzLmlucHV0cy5sZW5ndGggKyBpKSxcbiAgICAgICAgcGFyZW50OiB0aGlzXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5yZWdpc3RlclN1YnZpZXcoc3Vidmlldy5yZW5kZXIoKSk7XG4gICAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHN1YnZpZXcuZWwpO1xuICAgIH1cbiAgICBzdWJ2aWV3ID0gbmV3IENlbGxWaWV3cy5Bbm5vdGF0aW9uKHtcbiAgICAgIG1vZGVsOiAgdGhpcy5tb2RlbC5hbm5vdGF0aW9uLFxuICAgICAgcGFyZW50OiB0aGlzXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcoc3Vidmlldy5yZW5kZXIoKSk7XG4gICAgdGhpcy5lbC5hcHBlbmRDaGlsZChzdWJ2aWV3LmVsKTtcblxuICAgIHRoaXMub24oJ2NoYW5nZTplbCBjaGFuZ2U6cGFyZW50JywgdGhpcy5wb3NpdGlvbkNvbnRyb2xzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSdWxlVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIGRlcHM6ZmFsc2UsIHJlcXVpcmU6ZmFsc2UsIG1vZHVsZTpmYWxzZSovXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG5cbnZhciBDb250ZXh0TWVudVZpZXcgPSByZXF1aXJlKCcuL2NvbnRleHRtZW51LXZpZXcnKTtcbnZhciBjb250ZXh0TWVudSA9IENvbnRleHRNZW51Vmlldy5pbnN0YW5jZSgpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5cblxudmFyIFNjb3BlQ29udHJvbHNWaWV3ID0gVmlldy5leHRlbmQoe1xuICBhdXRvUmVuZGVyOiB0cnVlLFxuXG4gIHRlbXBsYXRlOiAnPHNwYW4gY2xhc3M9XCJjdHJsc1wiPjwvc3Bhbj4nLFxuXG4gIGRlcml2ZWQ6IHtcbiAgICBvZmZzZXQ6IHtcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1dGlscy5lbE9mZnNldCh0aGlzLmVsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgc2Vzc2lvbjoge1xuICAgIHNjb3BlOiAnc3RhdGUnLFxuXG4gICAgY29tbWFuZHM6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBbXTsgfVxuICAgIH1cbiAgfSxcblxuICBldmVudHM6IHtcbiAgICBjbGljazogJ19oYW5kbGVDbGljaydcbiAgfSxcblxuICBfaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub2Zmc2V0O1xuICAgIG9wdGlvbnMubGVmdCArPSB0aGlzLmVsLmNsaWVudFdpZHRoO1xuICAgIG9wdGlvbnMuY29tbWFuZHMgPSB0aGlzLmNvbW1hbmRzIHx8IFtdO1xuICAgIGNvbnRleHRNZW51Lm9wZW4ob3B0aW9ucyk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNjb3BlQ29udHJvbHNWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcbnZhciBTdGF0ZSA9IGRlcHMoJ2FtcGVyc2FuZC1zdGF0ZScpO1xuXG5cblxudmFyIFN1Z2dlc3Rpb25zQ29sbGVjdGlvbiA9IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgbW9kZWw6IFN0YXRlLmV4dGVuZCh7XG4gICAgcHJvcHM6IHtcbiAgICAgIHZhbHVlOiAnc3RyaW5nJyxcbiAgICAgIGh0bWw6ICdzdHJpbmcnXG4gICAgfVxuICB9KVxufSk7XG5cblxuXG52YXIgU3VnZ2VzdGlvbnNJdGVtVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6ICc8bGk+PC9saT4nLFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLmh0bWwnOiB7XG4gICAgICB0eXBlOiAnaW5uZXJIVE1MJ1xuICAgIH1cbiAgfSxcblxuICBldmVudHM6IHtcbiAgICBjbGljazogJ19oYW5kbGVDbGljaydcbiAgfSxcblxuICBfaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMucGFyZW50IHx8ICF0aGlzLnBhcmVudC5wYXJlbnQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5wYXJlbnQucGFyZW50Lm1vZGVsLnZhbHVlID0gdGhpcy5tb2RlbC52YWx1ZTtcbiAgfVxufSk7XG5cblxuXG52YXIgU3VnZ2VzdGlvbnNWaWV3ID0gVmlldy5leHRlbmQoe1xuICBzZXNzaW9uOiB7XG4gICAgdmlzaWJsZTogJ2Jvb2xlYW4nXG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICB2aXNpYmxlOiB7XG4gICAgICB0eXBlOiAndG9nZ2xlJ1xuICAgIH1cbiAgfSxcblxuICB0ZW1wbGF0ZTogJzx1bCBjbGFzcz1cImRtbi1zdWdnZXN0aW9ucy1oZWxwZXJcIj48L3VsPicsXG5cbiAgY29sbGVjdGlvbnM6IHtcbiAgICBzdWdnZXN0aW9uczogU3VnZ2VzdGlvbnNDb2xsZWN0aW9uXG4gIH0sXG5cbiAgc2hvdzogZnVuY3Rpb24gKHN1Z2dlc3Rpb25zLCBwYXJlbnQpIHtcbiAgICBpZiAoc3VnZ2VzdGlvbnMpIHtcbiAgICAgIGlmIChzdWdnZXN0aW9ucy5pc0NvbGxlY3Rpb24gJiYgc3VnZ2VzdGlvbnMuaXNDb2xsZWN0aW9uKCkpIHtcbiAgICAgICAgaW5zdGFuY2Uuc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9ucztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpbnN0YW5jZS5zdWdnZXN0aW9ucy5yZXNldChzdWdnZXN0aW9ucyk7XG4gICAgICB9XG4gICAgICBpbnN0YW5jZS52aXNpYmxlID0gc3VnZ2VzdGlvbnMubGVuZ3RoID4gMTtcbiAgICB9XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyV2l0aFRlbXBsYXRlKCk7XG4gICAgdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMuc3VnZ2VzdGlvbnMsIFN1Z2dlc3Rpb25zSXRlbVZpZXcsIHRoaXMuZWwpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxuXG5cbnZhciBpbnN0YW5jZTtcblN1Z2dlc3Rpb25zVmlldy5pbnN0YW5jZSA9IGZ1bmN0aW9uIChzdWdnZXN0aW9ucywgcGFyZW50KSB7XG4gIGlmICghaW5zdGFuY2UpIHtcbiAgICBpbnN0YW5jZSA9IG5ldyBTdWdnZXN0aW9uc1ZpZXcoe30pO1xuICAgIGluc3RhbmNlLnJlbmRlcigpO1xuICB9XG5cbiAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGluc3RhbmNlLmVsKSkge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5zdGFuY2UuZWwpO1xuICB9XG5cbiAgaW5zdGFuY2Uuc2hvdyhzdWdnZXN0aW9ucywgcGFyZW50KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59O1xuXG5cblN1Z2dlc3Rpb25zVmlldy5Db2xsZWN0aW9uID0gU3VnZ2VzdGlvbnNDb2xsZWN0aW9uO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN1Z2dlc3Rpb25zVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlLCByZXF1aXJlOiBmYWxzZSovXG5cbnZhciBTdGF0ZSA9IGRlcHMoJ2FtcGVyc2FuZC1zdGF0ZScpO1xudmFyIElucHV0ID0gcmVxdWlyZSgnLi9pbnB1dC1kYXRhJyk7XG52YXIgT3V0cHV0ID0gcmVxdWlyZSgnLi9vdXRwdXQtZGF0YScpO1xuXG52YXIgUnVsZSA9IHJlcXVpcmUoJy4vcnVsZS1kYXRhJyk7XG5cbnZhciBEZWNpc2lvblRhYmxlTW9kZWwgPSBTdGF0ZS5leHRlbmQoe1xuICBjb2xsZWN0aW9uczoge1xuICAgIGlucHV0czogICBJbnB1dC5Db2xsZWN0aW9uLFxuICAgIG91dHB1dHM6ICBPdXRwdXQuQ29sbGVjdGlvbixcbiAgICBydWxlczogICAgUnVsZS5Db2xsZWN0aW9uXG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBuYW1lOiAnc3RyaW5nJ1xuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICB4OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICB9LFxuXG4gICAgeToge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAwXG4gICAgfVxuICB9LFxuXG5cbiAgX3J1bGVDbGlwYm9hcmQ6IG51bGwsXG5cblxuXG5cblxuXG5cbiAgYWRkUnVsZTogZnVuY3Rpb24gKHNjb3BlQ2VsbCwgYmVmb3JlQWZ0ZXIpIHtcbiAgICB2YXIgY2VsbHMgPSBbXTtcbiAgICB2YXIgYztcblxuICAgIGZvciAoYyA9IDA7IGMgPCB0aGlzLmlucHV0cy5sZW5ndGg7IGMrKykge1xuICAgICAgY2VsbHMucHVzaCh7XG4gICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgY2hvaWNlczogdGhpcy5pbnB1dHMuYXQoYykuY2hvaWNlcyxcbiAgICAgICAgZm9jdXNlZDogYyA9PT0gMFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZm9yIChjID0gMDsgYyA8IHRoaXMub3V0cHV0cy5sZW5ndGg7IGMrKykge1xuICAgICAgY2VsbHMucHVzaCh7XG4gICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgY2hvaWNlczogdGhpcy5vdXRwdXRzLmF0KGMpLmNob2ljZXNcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNlbGxzLnB1c2goe1xuICAgICAgdmFsdWU6ICcnXG4gICAgfSk7XG5cbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIGlmIChiZWZvcmVBZnRlcikge1xuICAgICAgdmFyIHJ1bGVEZWx0YSA9IHRoaXMucnVsZXMuaW5kZXhPZihzY29wZUNlbGwuY29sbGVjdGlvbi5wYXJlbnQpO1xuICAgICAgb3B0aW9ucy5hdCA9IHJ1bGVEZWx0YSArIChiZWZvcmVBZnRlciA+IDAgPyBydWxlRGVsdGEgOiAocnVsZURlbHRhIC0gMSkpO1xuICAgIH1cblxuICAgIHRoaXMucnVsZXMuYWRkKHtcbiAgICAgIGNlbGxzOiBjZWxsc1xuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgcmVtb3ZlUnVsZTogZnVuY3Rpb24gKHNjb3BlQ2VsbCkge1xuICAgIHRoaXMucnVsZXMucmVtb3ZlKHNjb3BlQ2VsbC5jb2xsZWN0aW9uLnBhcmVudCk7XG4gICAgdGhpcy5ydWxlcy50cmlnZ2VyKCdyZXNldCcpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgY29weVJ1bGU6IGZ1bmN0aW9uIChzY29wZUNlbGwsIHVwRG93bikge1xuICAgIHZhciBydWxlID0gc2NvcGVDZWxsLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgIGlmICghcnVsZSkgeyByZXR1cm4gdGhpczsgfVxuICAgIHRoaXMuX3J1bGVDbGlwYm9hcmQgPSBydWxlO1xuXG4gICAgaWYgKHVwRG93bikge1xuICAgICAgdmFyIHJ1bGVEZWx0YSA9IHRoaXMucnVsZXMuaW5kZXhPZihydWxlKTtcbiAgICAgIHRoaXMucGFzdGVSdWxlKHJ1bGVEZWx0YSArICh1cERvd24gPiAxID8gMCA6IDEpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIHBhc3RlUnVsZTogZnVuY3Rpb24gKGRlbHRhKSB7XG4gICAgaWYgKCF0aGlzLl9ydWxlQ2xpcGJvYXJkKSB7IHJldHVybiB0aGlzOyB9XG4gICAgdmFyIGRhdGEgPSB0aGlzLl9ydWxlQ2xpcGJvYXJkLnRvSlNPTigpO1xuICAgIHRoaXMucnVsZXMuYWRkKGRhdGEsIHtcbiAgICAgIGF0OiBkZWx0YVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgY2xlYXJSdWxlOiBmdW5jdGlvbiAocnVsZSkge1xuICAgIHZhciBydWxlRGVsdGEgPSB0aGlzLnJ1bGVzLmluZGV4T2YocnVsZSk7XG4gICAgdGhpcy5ydWxlcy5hdChydWxlRGVsdGEpLmNlbGxzLmZvckVhY2goZnVuY3Rpb24gKGNlbGwpIHtcbiAgICAgIGNlbGwudmFsdWUgPSAnJztcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIF9ydWxlc0NlbGxzOiBmdW5jdGlvbiAoYWRkZWQsIGRlbHRhKSB7XG4gICAgdGhpcy5ydWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICBydWxlLmNlbGxzLmFkZCh7XG4gICAgICAgIGNob2ljZXM6IGFkZGVkLmNob2ljZXNcbiAgICAgIH0sIHtcbiAgICAgICAgYXQ6IGRlbHRhLFxuICAgICAgICBzaWxlbnQ6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMucnVsZXMudHJpZ2dlcigncmVzZXQnKTtcbiAgfSxcblxuICBhZGRJbnB1dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWx0YSA9IHRoaXMuaW5wdXRzLmxlbmd0aDtcbiAgICB0aGlzLl9ydWxlc0NlbGxzKHRoaXMuaW5wdXRzLmFkZCh7XG4gICAgICBsYWJlbDogICAgbnVsbCxcbiAgICAgIGNob2ljZXM6ICBudWxsLFxuICAgICAgbWFwcGluZzogIG51bGwsXG4gICAgICBkYXRhdHlwZTogJ3N0cmluZydcbiAgICB9KSwgZGVsdGEpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgcmVtb3ZlSW5wdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG5cbiAgYWRkT3V0cHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlbHRhID0gdGhpcy5pbnB1dHMubGVuZ3RoICsgdGhpcy5pbnB1dHMubGVuZ3RoIC0gMTtcbiAgICB0aGlzLl9ydWxlc0NlbGxzKHRoaXMub3V0cHV0cy5hZGQoe1xuICAgICAgbGFiZWw6ICAgIG51bGwsXG4gICAgICBjaG9pY2VzOiAgbnVsbCxcbiAgICAgIG1hcHBpbmc6ICBudWxsLFxuICAgICAgZGF0YXR5cGU6ICdzdHJpbmcnXG4gICAgfSksIGRlbHRhKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHJlbW92ZU91dHB1dDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxud2luZG93LkRlY2lzaW9uVGFibGVNb2RlbCA9IERlY2lzaW9uVGFibGVNb2RlbDtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1vZGVsOiBEZWNpc2lvblRhYmxlTW9kZWxcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6ZmFsc2UqL1xuXG5mdW5jdGlvbiBlbE9mZnNldChlbCkge1xuICB2YXIgbm9kZSA9IGVsO1xuICB2YXIgdG9wID0gbm9kZS5vZmZzZXRUb3A7XG4gIHZhciBsZWZ0ID0gbm9kZS5vZmZzZXRMZWZ0O1xuXG4gIHdoaWxlICgobm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50KSkge1xuICAgIHRvcCArPSBub2RlLm9mZnNldFRvcDtcbiAgICBsZWZ0ICs9IG5vZGUub2Zmc2V0TGVmdDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdG9wOiB0b3AsXG4gICAgbGVmdDogbGVmdFxuICB9O1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBlbE9mZnNldDogZWxPZmZzZXRcbn07XG4iXX0=
