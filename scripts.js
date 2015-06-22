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

    var ctrls = new ScopeControlsView({
      parent: this,
      scope: this.model,
      commands: [
        {
          label: 'Remove ' + clause.clauseType,
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


var ScopeControlsView = require('./scopecontrols-view');

function toArray(els) {
  return Array.prototype.slice.apply(els);
}


function makeTd(type) {
  var el = document.createElement('td');
  el.className = type;
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

},{"./clause-view":5,"./contextmenu-view":6,"./rule-view":12,"./scopecontrols-view":13,"./table-data":15,"./utils":16}],8:[function(require,module,exports){
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
    var ctrls = new ScopeControlsView({
      parent: this,
      scope: this.model,
      commands: [
        {
          label: 'Remove rule',
          icon: 'minus',
          hint: 'Remove this rule',
          fn: function () {
            rule.collection.remove(rule);
          }
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2NlbGwtZGF0YS5qcyIsInNjcmlwdHMvY2VsbC12aWV3LmpzIiwic2NyaXB0cy9jaG9pY2Utdmlldy5qcyIsInNjcmlwdHMvY2xhdXNlLWRhdGEuanMiLCJzY3JpcHRzL2NsYXVzZS12aWV3LmpzIiwic2NyaXB0cy9jb250ZXh0bWVudS12aWV3LmpzIiwic2NyaXB0cy9kZWNpc2lvbi10YWJsZS12aWV3LmpzIiwic2NyaXB0cy9pbmRleC5qcyIsInNjcmlwdHMvaW5wdXQtZGF0YS5qcyIsInNjcmlwdHMvb3V0cHV0LWRhdGEuanMiLCJzY3JpcHRzL3J1bGUtZGF0YS5qcyIsInNjcmlwdHMvcnVsZS12aWV3LmpzIiwic2NyaXB0cy9zY29wZWNvbnRyb2xzLXZpZXcuanMiLCJzY3JpcHRzL3N1Z2dlc3Rpb25zLXZpZXcuanMiLCJzY3JpcHRzL3RhYmxlLWRhdGEuanMiLCJzY3JpcHRzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UqL1xuXG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcblxudmFyIENlbGxNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIHByb3BzOiB7XG4gICAgdmFsdWU6ICdzdHJpbmcnXG4gIH0sXG5cbiAgc2Vzc2lvbjoge1xuICAgIGZvY3VzZWQ6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcblxuICAgIGVkaXRhYmxlOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfVxuICB9LFxuXG4gIGRlcml2ZWQ6IHtcbiAgICB0YWJsZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICdjb2xsZWN0aW9uLnBhcmVudCcsXG4gICAgICAgICdjb2xsZWN0aW9uLnBhcmVudC5jb2xsZWN0aW9uJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24ucGFyZW50J1xuICAgICAgXSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24ucGFyZW50O1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGF1c2VEZWx0YToge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICd0YWJsZS5pbnB1dHMnLFxuICAgICAgICAndGFibGUub3V0cHV0cydcbiAgICAgIF0sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVsdGEgPSB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKTtcbiAgICAgICAgdmFyIGlucHV0cyA9IHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aDtcbiAgICAgICAgdmFyIG91dHB1dHMgPSB0aGlzLnRhYmxlLmlucHV0cy5sZW5ndGggKyB0aGlzLnRhYmxlLm91dHB1dHMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChkZWx0YSA8IGlucHV0cykge1xuICAgICAgICAgIHJldHVybiBkZWx0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZWx0YSA8IG91dHB1dHMpIHtcbiAgICAgICAgICByZXR1cm4gZGVsdGEgLSBpbnB1dHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdHlwZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICd0YWJsZS5pbnB1dHMnLFxuICAgICAgICAndGFibGUub3V0cHV0cydcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVsdGEgPSB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKTtcbiAgICAgICAgdmFyIGlucHV0cyA9IHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aDtcbiAgICAgICAgdmFyIG91dHB1dHMgPSB0aGlzLnRhYmxlLmlucHV0cy5sZW5ndGggKyB0aGlzLnRhYmxlLm91dHB1dHMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChkZWx0YSA8IGlucHV0cykge1xuICAgICAgICAgIHJldHVybiAnaW5wdXQnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRlbHRhIDwgb3V0cHV0cykge1xuICAgICAgICAgIHJldHVybiAnb3V0cHV0JztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAnYW5ub3RhdGlvbic7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNsYXVzZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICdjb2xsZWN0aW9uLmxlbmd0aCcsXG4gICAgICAgICd0eXBlJyxcbiAgICAgICAgJ2NsYXVzZURlbHRhJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNsYXVzZURlbHRhIDwgMCB8fCB0aGlzLnR5cGUgPT09ICdhbm5vdGF0aW9uJykgeyByZXR1cm47IH1cbiAgICAgICAgdmFyIGNsYXVzZSA9IHRoaXMudGFibGVbdGhpcy50eXBlICsncyddLmF0KHRoaXMuY2xhdXNlRGVsdGEpO1xuICAgICAgICByZXR1cm4gY2xhdXNlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjaG9pY2VzOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICd0YWJsZScsXG4gICAgICAgICdjb2xsZWN0aW9uLmxlbmd0aCcsXG4gICAgICAgICd0eXBlJyxcbiAgICAgICAgJ2NsYXVzZScsXG4gICAgICAgICdjbGF1c2VEZWx0YSdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2xhdXNlKSB7IHJldHVybjsgfVxuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UuY2hvaWNlcztcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMub24oJ2NoYW5nZTpmb2N1c2VkJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmZvY3VzZWQpIHsgcmV0dXJuOyB9XG4gICAgICB2YXIgY2lkID0gdGhpcy5jaWQ7XG4gICAgICB2YXIgcnVsZUNpZCA9IHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuY2lkO1xuICAgICAgdmFyIHggPSAwO1xuICAgICAgdmFyIHkgPSAwO1xuXG4gICAgICB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LmNvbGxlY3Rpb24uZm9yRWFjaChmdW5jdGlvbiAocnVsZSwgcikge1xuICAgICAgICB2YXIgcnVsZUZvY3VzZWQgPSBydWxlLmNpZCA9PT0gcnVsZUNpZDtcbiAgICAgICAgaWYgKHJ1bGUuZm9jdXNlZCAhPT0gcnVsZUZvY3VzZWQpIHtcbiAgICAgICAgICBydWxlLmZvY3VzZWQgPSBydWxlRm9jdXNlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChydWxlRm9jdXNlZCkge1xuICAgICAgICAgIHkgPSByO1xuICAgICAgICB9XG5cbiAgICAgICAgcnVsZS5jZWxscy5mb3JFYWNoKGZ1bmN0aW9uIChjZWxsLCBjKSB7XG4gICAgICAgICAgdmFyIGNlbGxGb2N1c2VkID0gY2VsbC5jaWQgPT09IGNpZDtcblxuICAgICAgICAgIGlmIChjZWxsLmZvY3VzZWQgIT09IGNlbGxGb2N1c2VkKSB7XG4gICAgICAgICAgICBjZWxsLmZvY3VzZWQgPSBjZWxsRm9jdXNlZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY2VsbEZvY3VzZWQpIHtcbiAgICAgICAgICAgIHggPSBjO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy50YWJsZS5zZXQoe1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogQ2VsbE1vZGVsLFxuICBDb2xsZWN0aW9uOiBDb2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IENlbGxNb2RlbFxuICB9KVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCByZXF1aXJlOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIG1lcmdlID0gZGVwcygnbG9kYXNoLm1lcmdlJyk7XG5cblxudmFyIENob2ljZVZpZXcgPSByZXF1aXJlKCcuL2Nob2ljZS12aWV3Jyk7XG52YXIgUnVsZUNlbGxWaWV3ID0gVmlldy5leHRlbmQobWVyZ2Uoe30sIENob2ljZVZpZXcucHJvdG90eXBlLCB7XG4gIHRlbXBsYXRlOiAnPHRkPjwvdGQ+JyxcblxuICBiaW5kaW5nczogbWVyZ2Uoe30sIENob2ljZVZpZXcucHJvdG90eXBlLmJpbmRpbmdzLCB7XG4gICAgJ21vZGVsLnZhbHVlJzoge1xuICAgICAgdHlwZTogJ3RleHQnXG4gICAgfSxcblxuICAgICdtb2RlbC5lZGl0YWJsZSc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICdjb250ZW50ZWRpdGFibGUnXG4gICAgfSxcblxuICAgICdtb2RlbC5zcGVsbGNoZWNrZWQnOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkF0dHJpYnV0ZScsXG4gICAgICBuYW1lOiAnc3BlbGxjaGVjaydcbiAgICB9LFxuXG4gICAgJ21vZGVsLnR5cGUnOiB7XG4gICAgICB0eXBlOiAnY2xhc3MnXG4gICAgfVxuICB9KSxcblxuICBldmVudHM6IG1lcmdlKHt9LCBDaG9pY2VWaWV3LnByb3RvdHlwZS5ldmVudHMsIHtcbiAgICAnY29udGV4dG1lbnUnOiAgJ19oYW5kbGVDb250ZXh0TWVudScsXG4gICAgJ2NsaWNrJzogICAgICAgICdfaGFuZGxlQ2xpY2snXG4gIH0pLFxuXG4gIF9oYW5kbGVGb2N1czogZnVuY3Rpb24gKCkge1xuICAgIENob2ljZVZpZXcucHJvdG90eXBlLl9oYW5kbGVGb2N1cy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMucGFyZW50LnBhcmVudC5oaWRlQ29udGV4dE1lbnUoKTtcbiAgfSxcblxuICBfaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBhcmVudC5wYXJlbnQuaGlkZUNvbnRleHRNZW51KCk7XG4gIH0sXG5cbiAgX2hhbmRsZUNvbnRleHRNZW51OiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdGhpcy5wYXJlbnQucGFyZW50LnNob3dDb250ZXh0TWVudSh0aGlzLm1vZGVsLCBldnQpO1xuICB9XG59KSk7XG5cblxuXG52YXIgUnVsZUlucHV0Q2VsbFZpZXcgPSBSdWxlQ2VsbFZpZXcuZXh0ZW5kKHt9KTtcblxudmFyIFJ1bGVPdXRwdXRDZWxsVmlldyA9IFJ1bGVDZWxsVmlldy5leHRlbmQoe30pO1xuXG52YXIgUnVsZUFubm90YXRpb25DZWxsVmlldyA9IFJ1bGVDZWxsVmlldy5leHRlbmQoe30pO1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENlbGw6ICAgICAgIFJ1bGVDZWxsVmlldyxcbiAgSW5wdXQ6ICAgICAgUnVsZUlucHV0Q2VsbFZpZXcsXG4gIE91dHB1dDogICAgIFJ1bGVPdXRwdXRDZWxsVmlldyxcbiAgQW5ub3RhdGlvbjogUnVsZUFubm90YXRpb25DZWxsVmlld1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBkZXBzOiBmYWxzZSwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UgKi9cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcblxudmFyIFN1Z2dlc3Rpb25zVmlldyA9IHJlcXVpcmUoJy4vc3VnZ2VzdGlvbnMtdmlldycpO1xuXG52YXIgc3VnZ2VzdGlvbnNWaWV3ID0gU3VnZ2VzdGlvbnNWaWV3Lmluc3RhbmNlKCk7XG5cbnZhciBzcGVjaWFsS2V5cyA9IFtcbiAgOCAvLyBiYWNrc3BhY2Vcbl07XG5cbnZhciBDaG9pY2VWaWV3ID0gVmlldy5leHRlbmQoe1xuICBjb2xsZWN0aW9uczoge1xuICAgIGNob2ljZXM6IFN1Z2dlc3Rpb25zVmlldy5Db2xsZWN0aW9uXG4gIH0sXG5cbiAgZXZlbnRzOiB7XG4gICAgaW5wdXQ6ICdfaGFuZGxlSW5wdXQnLFxuICAgIGZvY3VzOiAnX2hhbmRsZUZvY3VzJyxcbiAgICBibHVyOiAgJ19oYW5kbGVCbHVyJ1xuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICB2YWxpZDogICAgICAgICAge1xuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIH0sXG5cbiAgICBvcmlnaW5hbFZhbHVlOiAgJ3N0cmluZydcbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgaXNPcmlnaW5hbDoge1xuICAgICAgZGVwczogWydtb2RlbC52YWx1ZScsICdvcmlnaW5hbFZhbHVlJ10sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC52YWx1ZSA9PT0gdGhpcy5vcmlnaW5hbFZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC52YWx1ZSc6IHtcbiAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSB8fCAhdmFsdWUudHJpbSgpKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLmVsLnRleHRDb250ZW50ID0gdmFsdWUudHJpbSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAnbW9kZWwuZm9jdXNlZCc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgbmFtZTogJ2ZvY3VzZWQnXG4gICAgfSxcblxuICAgIGlzT3JpZ2luYWw6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgbmFtZTogJ3VudG91Y2hlZCdcbiAgICB9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAodGhpcy5lbCkge1xuICAgICAgdGhpcy5lbC5jb250ZW50RWRpdGFibGUgPSB0cnVlO1xuICAgICAgdGhpcy5lbC5zcGVsbGNoZWNrID0gZmFsc2U7XG4gICAgICB0aGlzLm9yaWdpbmFsVmFsdWUgPSB0aGlzLnZhbHVlID0gdGhpcy5lbC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5vcmlnaW5hbFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB9XG5cblxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbCwgJ2NoYW5nZTpjaG9pY2VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNob2ljZXMgPSB0aGlzLm1vZGVsLmNob2ljZXM7XG4gICAgICBpZiAoIXRoaXMuY2hvaWNlcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWNob2ljZXMpIHtcbiAgICAgICAgY2hvaWNlcyA9IFtdO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNob2ljZXMucmVzZXQoY2hvaWNlcy5tYXAoZnVuY3Rpb24gKGNob2ljZSkge1xuICAgICAgICByZXR1cm4ge3ZhbHVlOiBjaG9pY2V9O1xuICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zdWdnZXN0aW9ucyA9IG5ldyBTdWdnZXN0aW9uc1ZpZXcuQ29sbGVjdGlvbih7XG4gICAgICBwYXJlbnQ6IHRoaXMuY2hvaWNlc1xuICAgIH0pO1xuXG5cblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIHJlc2V0U3VnZ2VzdGlvbnMoKSB7XG4gICAgICBzZWxmLnN1Z2dlc3Rpb25zLnJlc2V0KHNlbGYuX2ZpbHRlcihzZWxmLnZhbHVlKSk7XG4gICAgfVxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbCwgJ2NoYW5nZTp2YWx1ZScsIHJlc2V0U3VnZ2VzdGlvbnMpO1xuXG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0aGlzLmNob2ljZXMsICdjaGFuZ2UnLCByZXNldFN1Z2dlc3Rpb25zKTtcblxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5zdWdnZXN0aW9ucywgJ3Jlc2V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFzdWdnZXN0aW9uc1ZpZXcpIHsgcmV0dXJuOyB9XG4gICAgICBzdWdnZXN0aW9uc1ZpZXcuZWwuc3R5bGUuZGlzcGxheSA9IHRoaXMuc3VnZ2VzdGlvbnMubGVuZ3RoIDwgMiA/ICdub25lJyA6ICdibG9jayc7XG4gICAgfSk7XG5cblxuICAgIGZ1bmN0aW9uIF9oYW5kbGVSZXNpemUoKSB7XG4gICAgICBzZWxmLl9oYW5kbGVSZXNpemUoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmVsKSB7XG4gICAgICB0aGlzLm9uY2UoJ2NoYW5nZTplbCcsIF9oYW5kbGVSZXNpemUpO1xuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgX2hhbmRsZVJlc2l6ZSk7XG4gICAgdGhpcy5faGFuZGxlUmVzaXplKCk7XG4gIH0sXG5cbiAgX2ZpbHRlcjogZnVuY3Rpb24gKHZhbCkge1xuICAgIHZhciBmaWx0ZXJlZCA9IHRoaXMuY2hvaWNlc1xuICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGNob2ljZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNob2ljZS52YWx1ZS5pbmRleE9mKHZhbCkgPT09IDA7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uIChjaG9pY2UpIHtcbiAgICAgICAgICAgIHZhciBjaGFycyA9IHRoaXMuZWwudGV4dENvbnRlbnQubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIHZhbCA9IGNob2ljZS5lc2NhcGUoJ3ZhbHVlJyk7XG4gICAgICAgICAgICB2YXIgaHRtbFN0ciA9ICc8c3BhbiBjbGFzcz1cImhpZ2hsaWdodGVkXCI+JyArIHZhbC5zbGljZSgwLCBjaGFycykgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICBodG1sU3RyICs9IHZhbC5zbGljZShjaGFycyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB2YWx1ZTogY2hvaWNlLnZhbHVlLFxuICAgICAgICAgICAgICBodG1sOiBodG1sU3RyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiBmaWx0ZXJlZDtcbiAgfSxcblxuICBfaGFuZGxlRm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9oYW5kbGVJbnB1dCgpO1xuICAgIHRoaXMubW9kZWwuZm9jdXNlZCA9IHRydWU7XG4gIH0sXG5cbiAgX2hhbmRsZUJsdXI6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyB0aGlzLm1vZGVsLmZvY3VzZWQgPSBmYWxzZTtcbiAgfSxcblxuICBfaGFuZGxlUmVzaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmVsIHx8ICFzdWdnZXN0aW9uc1ZpZXcpIHsgcmV0dXJuOyB9XG4gICAgdmFyIG5vZGUgPSB0aGlzLmVsO1xuICAgIHZhciB0b3AgPSBub2RlLm9mZnNldFRvcDtcbiAgICB2YXIgbGVmdCA9IG5vZGUub2Zmc2V0TGVmdDtcbiAgICB2YXIgaGVscGVyID0gc3VnZ2VzdGlvbnNWaWV3LmVsO1xuXG4gICAgd2hpbGUgKChub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQpKSB7XG4gICAgICBpZiAobm9kZS5vZmZzZXRUb3ApIHtcbiAgICAgICAgdG9wICs9IHBhcnNlSW50KG5vZGUub2Zmc2V0VG9wLCAxMCk7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5vZmZzZXRMZWZ0KSB7XG4gICAgICAgIGxlZnQgKz0gcGFyc2VJbnQobm9kZS5vZmZzZXRMZWZ0LCAxMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdG9wIC09IGhlbHBlci5jbGllbnRIZWlnaHQ7XG4gICAgaGVscGVyLnN0eWxlLnRvcCA9IHRvcDtcbiAgICBoZWxwZXIuc3R5bGUubGVmdCA9IGxlZnQ7XG4gIH0sXG5cbiAgX2hhbmRsZUlucHV0OiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKGV2dCAmJiAoc3BlY2lhbEtleXMuaW5kZXhPZihldnQua2V5Q29kZSkgPiAtMSB8fCBldnQuY3RybEtleSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHZhbCA9IHRoaXMuZWwudGV4dENvbnRlbnQ7XG5cbiAgICB2YXIgZmlsdGVyZWQgPSB0aGlzLl9maWx0ZXIodmFsKTtcbiAgICAvLyB0aGlzLnN1Z2dlc3Rpb25zLnJlc2V0KGZpbHRlcmVkKTtcbiAgICBzdWdnZXN0aW9uc1ZpZXcuc2hvdyhmaWx0ZXJlZCwgdGhpcyk7XG4gICAgdGhpcy5faGFuZGxlUmVzaXplKCk7XG5cbiAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoZXZ0KSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWF0Y2hpbmcgPSBmaWx0ZXJlZFswXS52YWx1ZTtcbiAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgdmFsdWU6IG1hdGNoaW5nXG4gICAgICB9LCB7XG4gICAgICAgIHNpbGVudDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLmVsLnRleHRDb250ZW50ID0gbWF0Y2hpbmc7XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaG9pY2VWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UqL1xuXG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcblxudmFyIENsYXVzZU1vZGVsID0gU3RhdGUuZXh0ZW5kKHtcbiAgcHJvcHM6IHtcbiAgICBsYWJlbDogICAgJ3N0cmluZycsXG4gICAgY2hvaWNlczogICdhcnJheScsXG4gICAgbWFwcGluZzogICdzdHJpbmcnLFxuICAgIGRhdGF0eXBlOiAnc3RyaW5nJ1xuICB9LFxuXG4gIHNlc3Npb246IHtcbiAgICBlZGl0YWJsZToge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH0sXG4gICAgZm9jdXNlZDogJ2Jvb2xlYW4nXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IENsYXVzZU1vZGVsLFxuICBDb2xsZWN0aW9uOiBDb2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IENsYXVzZU1vZGVsXG4gIH0pXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgbWVyZ2UgPSBkZXBzKCdsb2Rhc2gubWVyZ2UnKTtcbnZhciBTY29wZUNvbnRyb2xzVmlldyA9IHJlcXVpcmUoJy4vc2NvcGVjb250cm9scy12aWV3Jyk7XG5cblxuXG52YXIgTGFiZWxWaWV3ID0gVmlldy5leHRlbmQobWVyZ2Uoe1xuICBldmVudHM6IHtcbiAgICAnaW5wdXQgLnZhbHVlJzogJ19oYW5kbGVJbnB1dCcsXG4gIH0sXG5cbiAgX2hhbmRsZUlucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbC5sYWJlbCA9IHRoaXMudmFsdWVFbC50ZXh0Q29udGVudC50cmltKCk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlRWwgPSB0aGlzLnZhbHVlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdmFsdWVFbC5jbGFzc05hbWUgPSAndmFsdWUnO1xuICAgIHZhbHVlRWwuc2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnLCB0cnVlKTtcbiAgICB2YWx1ZUVsLnRleHRDb250ZW50ID0gKHRoaXMubW9kZWwubGFiZWwgfHwgJycpLnRyaW0oKTtcbiAgICB0aGlzLmVsLmlubmVySFRNTCA9ICcnO1xuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodmFsdWVFbCk7XG5cblxuICAgIHZhciBjbGF1c2UgPSB0aGlzLm1vZGVsO1xuICAgIHZhciB0YWJsZSA9IGNsYXVzZS5jb2xsZWN0aW9uLnBhcmVudDtcblxuICAgIHZhciBjdHJscyA9IG5ldyBTY29wZUNvbnRyb2xzVmlldyh7XG4gICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICBzY29wZTogdGhpcy5tb2RlbCxcbiAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogJ1JlbW92ZSAnICsgY2xhdXNlLmNsYXVzZVR5cGUsXG4gICAgICAgICAgaWNvbjogJ21pbnVzJyxcbiAgICAgICAgICBoaW50OiAnUmVtb3ZlIHRoZSAnICsgY2xhdXNlLmNsYXVzZVR5cGUgKyAnIGNsYXVzZScsXG4gICAgICAgICAgcG9zc2libGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBjbGF1c2UuY29sbGVjdGlvbi5sZW5ndGggPiAxO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWx0YSA9IGNsYXVzZS5jb2xsZWN0aW9uLmluZGV4T2YoY2xhdXNlKTtcbiAgICAgICAgICAgIGNsYXVzZS5jb2xsZWN0aW9uLnJlbW92ZShjbGF1c2UpO1xuXG4gICAgICAgICAgICBpZiAoY2xhdXNlLmNsYXVzZVR5cGUgPT09ICdvdXRwdXQnKSB7XG4gICAgICAgICAgICAgIGRlbHRhICs9IHRhYmxlLmlucHV0cy5sZW5ndGg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhYmxlLnJ1bGVzLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgICAgICAgdmFyIGNlbGwgPSBydWxlLmNlbGxzLmF0KGRlbHRhKTtcbiAgICAgICAgICAgICAgcnVsZS5jZWxscy5yZW1vdmUoY2VsbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRhYmxlLnJ1bGVzLnRyaWdnZXIoJ3Jlc2V0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcoY3RybHMpO1xuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQoY3RybHMuZWwpO1xuICB9XG59KSk7XG5cblxuXG5cbnZhciBNYXBwaW5nVmlldyA9IFZpZXcuZXh0ZW5kKG1lcmdlKHtcbiAgZXZlbnRzOiB7XG4gICAgJ2lucHV0JzogJ19oYW5kbGVJbnB1dCcsXG4gIH0sXG5cbiAgX2hhbmRsZUlucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbC5tYXBwaW5nID0gdGhpcy5lbC50ZXh0Q29udGVudC50cmltKCk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsIHRydWUpO1xuICAgIHRoaXMuZWwudGV4dENvbnRlbnQgPSAodGhpcy5tb2RlbC5tYXBwaW5nIHx8ICcnKS50cmltKCk7XG4gIH1cbn0pKTtcblxuXG5cblxudmFyIFZhbHVlVmlldyA9IFZpZXcuZXh0ZW5kKG1lcmdlKHtcbiAgZXZlbnRzOiB7XG4gICAgJ2lucHV0JzogJ19oYW5kbGVJbnB1dCcsXG4gICAgJ2ZvY3VzJzogJ19oYW5kbGVGb2N1cydcbiAgfSxcblxuICBfaGFuZGxlSW5wdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29udGVudCA9IHRoaXMuZWwudGV4dENvbnRlbnQudHJpbSgpO1xuXG4gICAgaWYgKGNvbnRlbnRbMF0gPT09ICcoJyAmJiBjb250ZW50LnNsaWNlKC0xKSA9PT0gJyknKSB7XG4gICAgICB0aGlzLm1vZGVsLmNob2ljZXMgPSBjb250ZW50XG4gICAgICAgIC5zbGljZSgxLCAtMSlcbiAgICAgICAgLnNwbGl0KCcsJylcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ci50cmltKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgIHJldHVybiAhIXN0cjtcbiAgICAgICAgfSlcbiAgICAgICAgO1xuICAgICAgdGhpcy5tb2RlbC5kYXRhdHlwZSA9IG51bGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5tb2RlbC5jaG9pY2VzID0gbnVsbDtcbiAgICAgIHRoaXMubW9kZWwuZGF0YXR5cGUgPSBjb250ZW50O1xuICAgIH1cbiAgfSxcblxuICBfaGFuZGxlRm9jdXM6IGZ1bmN0aW9uICgpIHtcblxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnLCB0cnVlKTtcbiAgICB2YXIgc3RyID0gJyc7XG4gICAgaWYgKHRoaXMubW9kZWwuY2hvaWNlcyAmJiB0aGlzLm1vZGVsLmNob2ljZXMubGVuZ3RoKSB7XG4gICAgICBzdHIgPSAnKCcgKyB0aGlzLm1vZGVsLmNob2ljZXMuam9pbignLCAnKSArICcpJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzdHIgPSB0aGlzLm1vZGVsLmRhdGF0eXBlO1xuICAgIH1cbiAgICB0aGlzLmVsLnRleHRDb250ZW50ID0gc3RyO1xuICB9XG59KSk7XG5cblxuXG5cblxudmFyIHJlcXVpcmVkRWxlbWVudCA9IHtcbiAgdHlwZTogJ2VsZW1lbnQnLFxuICByZXF1aXJlZDogdHJ1ZVxufTtcblxudmFyIENsYXVzZVZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIHNlc3Npb246IHtcbiAgICBsYWJlbEVsOiAgICByZXF1aXJlZEVsZW1lbnQsXG4gICAgbWFwcGluZ0VsOiAgcmVxdWlyZWRFbGVtZW50LFxuICAgIHZhbHVlRWw6ICAgIHJlcXVpcmVkRWxlbWVudFxuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2xhdXNlID0gdGhpcy5tb2RlbDtcblxuICAgIHZhciBzdWJ2aWV3cyA9IHtcbiAgICAgIGxhYmVsOiAgICBMYWJlbFZpZXcsXG4gICAgICBtYXBwaW5nOiAgTWFwcGluZ1ZpZXcsXG4gICAgICB2YWx1ZTogICAgVmFsdWVWaWV3XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKHN1YnZpZXdzKS5mb3JFYWNoKGZ1bmN0aW9uIChraW5kKSB7XG4gICAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWwsICdjaGFuZ2U6JyArIGtpbmQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXNba2luZCArICdWaWV3J10pIHtcbiAgICAgICAgICB0aGlzLnN0b3BMaXN0ZW5pbmcodGhpc1traW5kICsgJ1ZpZXcnXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzW2tpbmQgKyAnVmlldyddID0gbmV3IHN1YnZpZXdzW2tpbmRdKHtcbiAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgbW9kZWw6ICBjbGF1c2UsXG4gICAgICAgICAgZWw6ICAgICB0aGlzW2tpbmQgKyAnRWwnXVxuICAgICAgICB9KS5yZW5kZXIoKTtcbiAgICAgIH0pO1xuICAgIH0sIHRoaXMpO1xuICB9XG59KTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDbGF1c2VWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcbnZhciBTdGF0ZSA9IGRlcHMoJ2FtcGVyc2FuZC1zdGF0ZScpO1xuXG52YXIgZGVmYXVsdENvbW1hbmRzID0gW1xuICAvLyB7XG4gIC8vICAgbGFiZWw6ICdBY3Rpb25zJyxcbiAgLy8gICBzdWJjb21tYW5kczogW1xuICAvLyAgICAge1xuICAvLyAgICAgICBsYWJlbDogJ3VuZG8nLFxuICAvLyAgICAgICBpY29uOiAndW5kbycsXG4gIC8vICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fVxuICAvLyAgICAgfSxcbiAgLy8gICAgIHtcbiAgLy8gICAgICAgbGFiZWw6ICdyZWRvJyxcbiAgLy8gICAgICAgaWNvbjogJ3JlZG8nLFxuICAvLyAgICAgICBmbjogZnVuY3Rpb24gKCkge31cbiAgLy8gICAgIH1cbiAgLy8gICBdXG4gIC8vIH0sXG4gIHtcbiAgICBsYWJlbDogJ0NlbGwnLFxuICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnY2xlYXInLFxuICAgICAgICBpY29uOiAnY2xlYXInLFxuICAgICAgICBoaW50OiAnQ2xlYXIgdGhlIGNvbnRlbnQgb2YgdGhlIGZvY3VzZWQgY2VsbCcsXG4gICAgICAgIHBvc3NpYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gY29uc29sZS5pbmZvKCdjbGVhciBwb3NzaWJsZT8nLCBhcmd1bWVudHMsIHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBmbjogZnVuY3Rpb24gKCkge31cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBsYWJlbDogJ1J1bGUnLFxuICAgIGljb246ICcnLFxuICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnYWRkJyxcbiAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmFkZFJ1bGUodGhpcy5zY29wZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnY29weScsXG4gICAgICAgIGljb246ICdjb3B5JyxcbiAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5jb3B5UnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgfSxcbiAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2Fib3ZlJyxcbiAgICAgICAgICAgIGljb246ICdhYm92ZScsXG4gICAgICAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBhYm92ZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuY29weVJ1bGUodGhpcy5zY29wZSwgLTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdiZWxvdycsXG4gICAgICAgICAgICBpY29uOiAnYmVsb3cnLFxuICAgICAgICAgICAgaGludDogJ0NvcHkgdGhlIHJ1bGUgYmVsb3cgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmNvcHlSdWxlKHRoaXMuc2NvcGUsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdyZW1vdmUnLFxuICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICBoaW50OiAnUmVtb3ZlIHRoZSBmb2N1c2VkIHJ1bGUnLFxuICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLnJlbW92ZVJ1bGUodGhpcy5zY29wZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnY2xlYXInLFxuICAgICAgICBpY29uOiAnY2xlYXInLFxuICAgICAgICBoaW50OiAnQ2xlYXIgdGhlIGZvY3VzZWQgcnVsZScsXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuY2xlYXJSdWxlKHRoaXMuc2NvcGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgbGFiZWw6ICdJbnB1dCcsXG4gICAgaWNvbjogJ2lucHV0JyxcbiAgICBzdWJjb21tYW5kczogW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ2FkZCcsXG4gICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2JlZm9yZScsXG4gICAgICAgICAgICBpY29uOiAnbGVmdCcsXG4gICAgICAgICAgICBoaW50OiAnQWRkIGFuIGlucHV0IGNsYXVzZSBiZWZvcmUgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmFkZElucHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2FmdGVyJyxcbiAgICAgICAgICAgIGljb246ICdyaWdodCcsXG4gICAgICAgICAgICBoaW50OiAnQWRkIGFuIGlucHV0IGNsYXVzZSBhZnRlciB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuYWRkSW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAncmVtb3ZlJyxcbiAgICAgICAgaWNvbjogJ21pbnVzJyxcbiAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5yZW1vdmVJbnB1dCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgbGFiZWw6ICdPdXRwdXQnLFxuICAgIGljb246ICdvdXRwdXQnLFxuICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnYWRkJyxcbiAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYmVmb3JlJyxcbiAgICAgICAgICAgIGljb246ICdsZWZ0JyxcbiAgICAgICAgICAgIGhpbnQ6ICdBZGQgYW4gb3V0cHV0IGNsYXVzZSBiZWZvcmUgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmFkZE91dHB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdhZnRlcicsXG4gICAgICAgICAgICBpY29uOiAncmlnaHQnLFxuICAgICAgICAgICAgaGludDogJ0FkZCBhbiBvdXRwdXQgY2xhdXNlIGFmdGVyIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5hZGRPdXRwdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAncmVtb3ZlJyxcbiAgICAgICAgaWNvbjogJ21pbnVzJyxcbiAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5yZW1vdmVPdXRwdXQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfVxuXTtcblxuXG5cblxuXG5cblxuXG5cbnZhciBDb21tYW5kTW9kZWwgPSBTdGF0ZS5leHRlbmQoe1xuICBwcm9wczoge1xuICAgIGxhYmVsOiAnc3RyaW5nJyxcbiAgICBoaW50OiAnc3RyaW5nJyxcbiAgICBpY29uOiAnc3RyaW5nJyxcbiAgICBocmVmOiAnc3RyaW5nJyxcblxuICAgIHBvc3NpYmxlOiB7XG4gICAgICB0eXBlOiAnYW55JyxcbiAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHt9OyB9LFxuICAgICAgdGVzdDogZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgIT09ICdmdW5jdGlvbicgJiYgbmV3VmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuICdtdXN0IGJlIGVpdGhlciBhIGZ1bmN0aW9uIG9yIGZhbHNlJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBmbjoge1xuICAgICAgdHlwZTogJ2FueScsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIHRlc3Q6IGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIG5ld1ZhbHVlICE9PSAnZnVuY3Rpb24nICYmIG5ld1ZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiAnbXVzdCBiZSBlaXRoZXIgYSBmdW5jdGlvbiBvciBmYWxzZSc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIGRpc2FibGVkOiB7XG4gICAgICBkZXBzOiBbJ3Bvc3NpYmxlJ10sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHRoaXMucG9zc2libGUgPT09ICdmdW5jdGlvbicgPyAhdGhpcy5wb3NzaWJsZSgpIDogZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHN1YmNvbW1hbmRzOiBudWxsLFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5zdWJjb21tYW5kcyA9IG5ldyBDb21tYW5kc0NvbGxlY3Rpb24oYXR0cmlidXRlcy5zdWJjb21tYW5kcyB8fCBbXSwge1xuICAgICAgcGFyZW50OiB0aGlzXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5cblxuXG5cblxuXG5cblxuXG52YXIgQ29tbWFuZHNDb2xsZWN0aW9uID0gQ29sbGVjdGlvbi5leHRlbmQoe1xuICBtb2RlbDogQ29tbWFuZE1vZGVsXG59KTtcblxuXG5cblxuXG5cblxuXG5cblxudmFyIENvbnRleHRNZW51SXRlbSA9IFZpZXcuZXh0ZW5kKHtcbiAgYXV0b1JlbmRlcjogdHJ1ZSxcblxuICB0ZW1wbGF0ZTogJzxsaT4nICtcbiAgICAgICAgICAgICAgJzxhPicgK1xuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImljb25cIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibGFiZWxcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICc8L2E+JyArXG4gICAgICAgICAgICAgICc8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+PC91bD4nICtcbiAgICAgICAgICAgICc8L2xpPicsXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwubGFiZWwnOiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBzZWxlY3RvcjogJy5sYWJlbCdcbiAgICB9LFxuXG4gICAgJ21vZGVsLmhpbnQnOiB7XG4gICAgICB0eXBlOiAnYXR0cmlidXRlJyxcbiAgICAgIG5hbWU6ICd0aXRsZSdcbiAgICB9LFxuXG4gICAgJ21vZGVsLmZuJzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5DbGFzcycsXG4gICAgICBzZWxlY3RvcjogJ2EnLFxuICAgICAgbm86ICdkaXNhYmxlZCdcbiAgICB9LFxuXG4gICAgJ21vZGVsLmRpc2FibGVkJzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5DbGFzcycsXG4gICAgICBuYW1lOiAnZGlzYWJsZWQnXG4gICAgfSxcblxuICAgICdtb2RlbC5zdWJjb21tYW5kcy5sZW5ndGgnOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkNsYXNzJyxcbiAgICAgIG5hbWU6ICdkcm9wZG93bidcbiAgICB9LFxuXG4gICAgJ21vZGVsLmhyZWYnOiB7XG4gICAgICBzZWxlY3RvcjogJ2EnLFxuICAgICAgbmFtZTogJ2hyZWYnLFxuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWx1ZSkge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdocmVmJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdocmVmJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgICdtb2RlbC5pY29uJzoge1xuICAgICAgdHlwZTogZnVuY3Rpb24gKGVsLCB2YWx1ZSkge1xuICAgICAgICBlbC5jbGFzc05hbWUgPSAnaWNvbiAnICsgdmFsdWU7XG4gICAgICB9LFxuICAgICAgc2VsZWN0b3I6ICcuaWNvbidcbiAgICB9XG4gIH0sXG5cbiAgZXZlbnRzOiB7XG4gICAgY2xpY2s6ICAgICAgJ19oYW5kbGVDbGljaycsXG4gICAgbW91c2VvdmVyOiAgJ19oYW5kbGVNb3VzZW92ZXInLFxuICAgIG1vdXNlb3V0OiAgICdfaGFuZGxlTW91c2VvdXQnXG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWwsICdjaGFuZ2U6c3ViY29tbWFuZHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5tb2RlbC5zdWJjb21tYW5kcywgQ29udGV4dE1lbnVJdGVtLCB0aGlzLnF1ZXJ5KCd1bCcpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBfaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAodGhpcy5tb2RlbC5mbikge1xuICAgICAgdGhpcy5wYXJlbnQudHJpZ2dlckNvbW1hbmQodGhpcy5tb2RlbCwgZXZ0KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIXRoaXMubW9kZWwuaHJlZikge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9LFxuXG4gIF9oYW5kbGVNb3VzZW92ZXI6IGZ1bmN0aW9uICgpIHtcblxuICB9LFxuXG5cblxuICBfaGFuZGxlTW91c2VvdXQ6IGZ1bmN0aW9uICgpIHtcblxuICB9LFxuXG5cblxuICB0cmlnZ2VyQ29tbWFuZDogZnVuY3Rpb24gKGNvbW1hbmQsIGV2dCkge1xuICAgIHRoaXMucGFyZW50LnRyaWdnZXJDb21tYW5kKGNvbW1hbmQsIGV2dCk7XG4gIH1cbn0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBDb250ZXh0TWVudVZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIGF1dG9SZW5kZXI6IHRydWUsXG5cbiAgdGVtcGxhdGU6ICc8bmF2IGNsYXNzPVwiZG1uLWNvbnRleHQtbWVudVwiPicgK1xuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNvb3JkaW5hdGVzXCI+JyArXG4gICAgICAgICAgICAgICAgJzxsYWJlbD5Db29yZHM6PC9sYWJlbD4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ4XCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInlcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzx1bD48L3VsPicgK1xuICAgICAgICAgICAgJzwvbmF2PicsXG5cbiAgY29sbGVjdGlvbnM6IHtcbiAgICBjb21tYW5kczogQ29tbWFuZHNDb2xsZWN0aW9uXG4gIH0sXG5cbiAgc2Vzc2lvbjoge1xuICAgIGlzT3BlbjogJ2Jvb2xlYW4nLFxuICAgIHNjb3BlOiAgJ3N0YXRlJ1xuICB9LFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgaXNPcGVuOiB7XG4gICAgICB0eXBlOiAndG9nZ2xlJ1xuICAgIH0sXG4gICAgJ3BhcmVudC5tb2RlbC54Jzoge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgc2VsZWN0b3I6ICdkaXYgc3Bhbi54J1xuICAgIH0sXG4gICAgJ3BhcmVudC5tb2RlbC55Jzoge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgc2VsZWN0b3I6ICdkaXYgc3Bhbi55J1xuICAgIH1cbiAgfSxcblxuICBvcGVuOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBzdHlsZSA9IHRoaXMuZWwuc3R5bGU7XG5cbiAgICBzdHlsZS5sZWZ0ID0gb3B0aW9ucy5sZWZ0ICsgJ3B4JztcbiAgICBzdHlsZS50b3AgPSBvcHRpb25zLnRvcCArICdweCc7XG5cbiAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG5cbiAgICB0aGlzLnNjb3BlID0gb3B0aW9ucy5zY29wZTtcbiAgICB2YXIgY29tbWFuZHMgPSBvcHRpb25zLmNvbW1hbmRzIHx8IGRlZmF1bHRDb21tYW5kcztcblxuICAgIHRoaXMuY29tbWFuZHMucmVzZXQoY29tbWFuZHMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHRyaWdnZXJDb21tYW5kOiBmdW5jdGlvbiAoY29tbWFuZCwgZXZ0KSB7XG4gICAgY29tbWFuZC5mbi5jYWxsKHRoaXMsIGV2dCk7XG4gICAgaWYgKCFjb21tYW5kLmtlZXBPcGVuKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuICAgIHRoaXMuY2FjaGVFbGVtZW50cyh7XG4gICAgICBjb21tYW5kc0VsOiAndWwnXG4gICAgfSk7XG4gICAgdGhpcy5jb21tYW5kc1ZpZXcgPSB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5jb21tYW5kcywgQ29udGV4dE1lbnVJdGVtLCB0aGlzLmNvbW1hbmRzRWwpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgaW5zdGFuY2U7XG5Db250ZXh0TWVudVZpZXcuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghaW5zdGFuY2UpIHtcbiAgICBpbnN0YW5jZSA9IG5ldyBDb250ZXh0TWVudVZpZXcoKTtcbiAgfVxuXG4gIGlmICghZG9jdW1lbnQuYm9keS5jb250YWlucyhpbnN0YW5jZS5lbCkpIHtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGluc3RhbmNlLmVsKTtcbiAgfVxuXG4gIHJldHVybiBpbnN0YW5jZTtcbn07XG5cbkNvbnRleHRNZW51Vmlldy5Db2xsZWN0aW9uID0gQ29tbWFuZHNDb2xsZWN0aW9uO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRleHRNZW51VmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCByZXF1aXJlOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIERlY2lzaW9uVGFibGUgPSByZXF1aXJlKCcuL3RhYmxlLWRhdGEnKTtcbnZhciBSdWxlVmlldyA9IHJlcXVpcmUoJy4vcnVsZS12aWV3Jyk7XG5cblxuXG5cbnZhciBDbGF1c2VIZWFkZXJWaWV3ID0gcmVxdWlyZSgnLi9jbGF1c2UtdmlldycpO1xuXG52YXIgQ29udGV4dE1lbnVWaWV3ID0gcmVxdWlyZSgnLi9jb250ZXh0bWVudS12aWV3Jyk7XG52YXIgY29udGV4dE1lbnUgPSBDb250ZXh0TWVudVZpZXcuaW5zdGFuY2UoKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuXG52YXIgU2NvcGVDb250cm9sc1ZpZXcgPSByZXF1aXJlKCcuL3Njb3BlY29udHJvbHMtdmlldycpO1xuXG5mdW5jdGlvbiB0b0FycmF5KGVscykge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGVscyk7XG59XG5cblxuZnVuY3Rpb24gbWFrZVRkKHR5cGUpIHtcbiAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgZWwuY2xhc3NOYW1lID0gdHlwZTtcbiAgcmV0dXJuIGVsO1xufVxuXG5cblxuXG52YXIgRGVjaXNpb25UYWJsZVZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIGF1dG9SZW5kZXI6IHRydWUsXG5cbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiZG1uLXRhYmxlXCI+JyArXG4gICAgICAgICAgICAgICc8ZGl2IGRhdGEtaG9vaz1cImNvbnRyb2xzXCI+PC9kaXY+JyArXG4gICAgICAgICAgICAgICc8aGVhZGVyPicgK1xuICAgICAgICAgICAgICAgICc8aDMgZGF0YS1ob29rPVwidGFibGUtbmFtZVwiPjwvaDM+JyArXG4gICAgICAgICAgICAgICc8L2hlYWRlcj4nICtcbiAgICAgICAgICAgICAgJzx0YWJsZT4nICtcbiAgICAgICAgICAgICAgICAnPHRoZWFkPicgK1xuICAgICAgICAgICAgICAgICAgJzx0cj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0aCBjbGFzcz1cImhpdFwiIHJ1bGVzcGFuPVwiNFwiPjwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJpbnB1dCBkb3VibGUtYm9yZGVyLXJpZ2h0XCIgY29sc3Bhbj1cIjJcIj5JbnB1dDwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJvdXRwdXRcIiBjb2xzcGFuPVwiMlwiPk91dHB1dDwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJhbm5vdGF0aW9uXCIgcnVsZXNwYW49XCI0XCI+QW5ub3RhdGlvbjwvdGg+JyArXG4gICAgICAgICAgICAgICAgICAnPC90cj4nICtcbiAgICAgICAgICAgICAgICAgICc8dHIgY2xhc3M9XCJsYWJlbHNcIj48L3RyPicgK1xuICAgICAgICAgICAgICAgICAgJzx0ciBjbGFzcz1cInZhbHVlc1wiPjwvdHI+JyArXG4gICAgICAgICAgICAgICAgICAnPHRyIGNsYXNzPVwibWFwcGluZ3NcIj48L3RyPicgK1xuICAgICAgICAgICAgICAgICc8L3RoZWFkPicgK1xuICAgICAgICAgICAgICAgICc8dGJvZHk+PC90Ym9keT4nICtcbiAgICAgICAgICAgICAgJzwvdGFibGU+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyxcblxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgLmFkZC1ydWxlIGEnOiAnX2hhbmRsZUFkZFJ1bGVDbGljaydcbiAgfSxcblxuICBfaGFuZGxlQWRkUnVsZUNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb2RlbC5hZGRSdWxlKCk7XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwgPSB0aGlzLm1vZGVsIHx8IG5ldyBEZWNpc2lvblRhYmxlLk1vZGVsKCk7XG4gIH0sXG5cbiAgaGlkZUNvbnRleHRNZW51OiBmdW5jdGlvbiAoKSB7XG4gICAgY29udGV4dE1lbnUuY2xvc2UoKTtcbiAgfSxcblxuICBzaG93Q29udGV4dE1lbnU6IGZ1bmN0aW9uIChjZWxsTW9kZWwsIGV2dCkge1xuICAgIHZhciBvcHRpb25zID0gdXRpbHMuZWxPZmZzZXQoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgIG9wdGlvbnMuc2NvcGUgPSBjZWxsTW9kZWw7XG4gICAgb3B0aW9ucy5sZWZ0ICs9IGV2dC5jdXJyZW50VGFyZ2V0LmNsaWVudFdpZHRoO1xuICAgIGNvbnRleHRNZW51Lm9wZW4ob3B0aW9ucyk7XG5cbiAgICB0cnkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfSxcblxuXG4gIHBhcnNlQ2hvaWNlczogZnVuY3Rpb24gKGVsKSB7XG4gICAgaWYgKCFlbCkge1xuICAgICAgcmV0dXJuICdNSVNTSU5HJztcbiAgICB9XG4gICAgdmFyIGNvbnRlbnQgPSBlbC50ZXh0Q29udGVudC50cmltKCk7XG5cbiAgICBpZiAoY29udGVudFswXSA9PT0gJygnICYmIGNvbnRlbnQuc2xpY2UoLTEpID09PSAnKScpIHtcbiAgICAgIHJldHVybiBjb250ZW50XG4gICAgICAgIC5zbGljZSgxLCAtMSlcbiAgICAgICAgLnNwbGl0KCcsJylcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ci50cmltKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgIHJldHVybiAhIXN0cjtcbiAgICAgICAgfSlcbiAgICAgICAgO1xuICAgIH1cblxuICAgIHJldHVybiBbXTtcbiAgfSxcblxuICBwYXJzZVJ1bGVzOiBmdW5jdGlvbiAocnVsZUVscykge1xuICAgIHJldHVybiBydWxlRWxzLm1hcChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHJldHVybiBlbC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgcGFyc2VUYWJsZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpbnB1dHMgPSBbXTtcbiAgICB2YXIgb3V0cHV0cyA9IFtdO1xuICAgIHZhciBydWxlcyA9IFtdO1xuXG4gICAgdGhpcy5xdWVyeUFsbCgndGhlYWQgLmxhYmVscyAuaW5wdXQnKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgbnVtKSB7XG4gICAgICB2YXIgY2hvaWNlRWxzID0gdGhpcy5xdWVyeSgndGhlYWQgLnZhbHVlcyAuaW5wdXQ6bnRoLWNoaWxkKCcgKyAobnVtICsgMSkgKyAnKScpO1xuXG4gICAgICBpbnB1dHMucHVzaCh7XG4gICAgICAgIGxhYmVsOiAgICBlbC50ZXh0Q29udGVudC50cmltKCksXG4gICAgICAgIGNob2ljZXM6ICB0aGlzLnBhcnNlQ2hvaWNlcyhjaG9pY2VFbHMpXG4gICAgICB9KTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRoaXMucXVlcnlBbGwoJ3RoZWFkIC5sYWJlbHMgLm91dHB1dCcpLmZvckVhY2goZnVuY3Rpb24gKGVsLCBudW0pIHtcbiAgICAgIHZhciBjaG9pY2VFbHMgPSB0aGlzLnF1ZXJ5KCd0aGVhZCAudmFsdWVzIC5vdXRwdXQ6bnRoLWNoaWxkKCcgKyAobnVtICsgaW5wdXRzLmxlbmd0aCArIDEpICsgJyknKTtcblxuICAgICAgb3V0cHV0cy5wdXNoKHtcbiAgICAgICAgbGFiZWw6ICAgIGVsLnRleHRDb250ZW50LnRyaW0oKSxcbiAgICAgICAgY2hvaWNlczogIHRoaXMucGFyc2VDaG9pY2VzKGNob2ljZUVscylcbiAgICAgIH0pO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdGhpcy5xdWVyeUFsbCgndGJvZHkgdHInKS5mb3JFYWNoKGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgIHZhciBjZWxscyA9IFtdO1xuICAgICAgdmFyIGNlbGxFbHMgPSByb3cucXVlcnlTZWxlY3RvckFsbCgndGQnKTtcblxuICAgICAgZm9yICh2YXIgYyA9IDE7IGMgPCBjZWxsRWxzLmxlbmd0aDsgYysrKSB7XG4gICAgICAgIHZhciBjaG9pY2VzID0gbnVsbDtcbiAgICAgICAgdmFyIHZhbHVlID0gY2VsbEVsc1tjXS50ZXh0Q29udGVudC50cmltKCk7XG4gICAgICAgIHZhciB0eXBlID0gYyA8PSBpbnB1dHMubGVuZ3RoID8gJ2lucHV0JyA6IChjIDwgKGNlbGxFbHMubGVuZ3RoIC0gMSkgPyAnb3V0cHV0JyA6ICdhbm5vdGF0aW9uJyk7XG4gICAgICAgIHZhciBvYyA9IGMgLSAoaW5wdXRzLmxlbmd0aCArIDEpO1xuXG4gICAgICAgIGlmICh0eXBlID09PSAnaW5wdXQnICYmIGlucHV0c1tjIC0gMV0pIHtcbiAgICAgICAgICBjaG9pY2VzID0gaW5wdXRzW2MgLSAxXS5jaG9pY2VzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT09ICdvdXRwdXQnICYmIG91dHB1dHNbb2NdKSB7XG4gICAgICAgICAgY2hvaWNlcyA9IG91dHB1dHNbb2NdLmNob2ljZXM7XG4gICAgICAgIH1cblxuICAgICAgICBjZWxscy5wdXNoKHtcbiAgICAgICAgICB2YWx1ZTogICAgdmFsdWUsXG4gICAgICAgICAgY2hvaWNlczogIGNob2ljZXNcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJ1bGVzLnB1c2goe1xuICAgICAgICBjZWxsczogY2VsbHNcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5tb2RlbC5uYW1lID0gdGhpcy5xdWVyeSgnaDMnKS50ZXh0Q29udGVudC50cmltKCk7XG4gICAgdGhpcy5tb2RlbC5pbnB1dHMucmVzZXQoaW5wdXRzKTtcbiAgICB0aGlzLm1vZGVsLm91dHB1dHMucmVzZXQob3V0cHV0cyk7XG4gICAgdGhpcy5tb2RlbC5ydWxlcy5yZXNldChydWxlcyk7XG5cbiAgICByZXR1cm4gdGhpcy50b0pTT04oKTtcbiAgfSxcblxuICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbC50b0pTT04oKTtcbiAgfSxcblxuICBpbnB1dENsYXVzZVZpZXdzOiBbXSxcbiAgb3V0cHV0Q2xhdXNlVmlld3M6IFtdLFxuXG4gIF9oZWFkZXJDbGVhcjogZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB0b0FycmF5KHRoaXMubGFiZWxzUm93RWwucXVlcnlTZWxlY3RvckFsbCgnLicrIHR5cGUpKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgdGhpcy5sYWJlbHNSb3dFbC5yZW1vdmVDaGlsZChlbCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0b0FycmF5KHRoaXMudmFsdWVzUm93RWwucXVlcnlTZWxlY3RvckFsbCgnLicrIHR5cGUpKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgdGhpcy52YWx1ZXNSb3dFbC5yZW1vdmVDaGlsZChlbCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0b0FycmF5KHRoaXMubWFwcGluZ3NSb3dFbC5xdWVyeVNlbGVjdG9yQWxsKCcuJysgdHlwZSkpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICB0aGlzLm1hcHBpbmdzUm93RWwucmVtb3ZlQ2hpbGQoZWwpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZWwpIHtcbiAgICAgIHRoaXMucmVuZGVyV2l0aFRlbXBsYXRlKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5wYXJzZVRhYmxlKCk7XG4gICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZTplbCcpO1xuICAgIH1cblxuICAgIHZhciB0YWJsZSA9IHRoaXMubW9kZWw7XG5cbiAgICBpZiAoIXRoaXMuaGVhZGVyRWwpIHtcbiAgICAgIHRoaXMuY2FjaGVFbGVtZW50cyh7XG4gICAgICAgIHRhYmxlRWw6ICAgICAgICAgICd0YWJsZScsXG4gICAgICAgIGxhYmVsRWw6ICAgICAgICAgICdoZWFkZXIgaDMnLFxuICAgICAgICBoZWFkZXJFbDogICAgICAgICAndGhlYWQnLFxuICAgICAgICBib2R5RWw6ICAgICAgICAgICAndGJvZHknLFxuICAgICAgICBpbnB1dHNIZWFkZXJFbDogICAndGhlYWQgdHI6bnRoLWNoaWxkKDEpIHRoLmlucHV0JyxcbiAgICAgICAgb3V0cHV0c0hlYWRlckVsOiAgJ3RoZWFkIHRyOm50aC1jaGlsZCgxKSB0aC5vdXRwdXQnLFxuICAgICAgICBsYWJlbHNSb3dFbDogICAgICAndGhlYWQgdHIubGFiZWxzJyxcbiAgICAgICAgdmFsdWVzUm93RWw6ICAgICAgJ3RoZWFkIHRyLnZhbHVlcycsXG4gICAgICAgIG1hcHBpbmdzUm93RWw6ICAgICd0aGVhZCB0ci5tYXBwaW5ncydcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgaW5wdXRzSGVhZGVyVmlldyA9IG5ldyBTY29wZUNvbnRyb2xzVmlldyh7XG4gICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgc2NvcGU6IHRoaXMubW9kZWwsXG4gICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdBZGQgaW5wdXQnLFxuICAgICAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICAgICAgaGludDogJ0FkZCBhbiBpbnB1dCBjbGF1c2UgYWZ0ZXIgb24gdGhlIHJpZ2h0JyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRhYmxlLmFkZElucHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KGlucHV0c0hlYWRlclZpZXcpO1xuICAgICAgdGhpcy5pbnB1dHNIZWFkZXJFbC5hcHBlbmRDaGlsZChpbnB1dHNIZWFkZXJWaWV3LmVsKTtcblxuICAgICAgdmFyIG91dHB1dHNIZWFkZXJWaWV3ID0gbmV3IFNjb3BlQ29udHJvbHNWaWV3KHtcbiAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICBzY29wZTogdGhpcy5tb2RlbCxcbiAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0FkZCBvdXRwdXQnLFxuICAgICAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICAgICAgaGludDogJ0FkZCBhbiBvdXRwdXQgY2xhdXNlIG9uIHRoZSByaWdodCcsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0YWJsZS5hZGRPdXRwdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZWdpc3RlclN1YnZpZXcob3V0cHV0c0hlYWRlclZpZXcpO1xuICAgICAgdGhpcy5vdXRwdXRzSGVhZGVyRWwuYXBwZW5kQ2hpbGQob3V0cHV0c0hlYWRlclZpZXcuZWwpO1xuICAgIH1cblxuXG4gICAgWydpbnB1dCcsICdvdXRwdXQnXS5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWxbdHlwZSArICdzJ10sICdhZGQgcmVzZXQgcmVtb3ZlJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBjb2xzID0gdGhpcy5tb2RlbFt0eXBlICsgJ3MnXS5sZW5ndGg7XG4gICAgICAgIGlmIChjb2xzID4gMSkge1xuICAgICAgICAgIHRoaXNbdHlwZSArICdzSGVhZGVyRWwnXS5zZXRBdHRyaWJ1dGUoJ2NvbHNwYW4nLCBjb2xzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzW3R5cGUgKyAnc0hlYWRlckVsJ10ucmVtb3ZlQXR0cmlidXRlKCdjb2xzcGFuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oZWFkZXJDbGVhcih0eXBlKTtcbiAgICAgICAgdGhpc1t0eXBlICsgJ0NsYXVzZVZpZXdzJ10uZm9yRWFjaChmdW5jdGlvbiAodmlldykge1xuICAgICAgICAgIHZpZXcucmVtb3ZlKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubW9kZWxbdHlwZSArICdzJ10uZm9yRWFjaChmdW5jdGlvbiAoY2xhdXNlKSB7XG4gICAgICAgICAgdmFyIGxhYmVsRWwgPSBtYWtlVGQodHlwZSk7XG4gICAgICAgICAgdmFyIHZhbHVlRWwgPSBtYWtlVGQodHlwZSk7XG4gICAgICAgICAgdmFyIG1hcHBpbmdFbCA9IG1ha2VUZCh0eXBlKTtcblxuICAgICAgICAgIHZhciB2aWV3ID0gbmV3IENsYXVzZUhlYWRlclZpZXcoe1xuICAgICAgICAgICAgbGFiZWxFbDogICAgbGFiZWxFbCxcbiAgICAgICAgICAgIHZhbHVlRWw6ICAgIHZhbHVlRWwsXG4gICAgICAgICAgICBtYXBwaW5nRWw6ICBtYXBwaW5nRWwsXG5cbiAgICAgICAgICAgIG1vZGVsOiAgICAgIGNsYXVzZSxcbiAgICAgICAgICAgIHBhcmVudDogICAgIHRoaXNcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIFsnbGFiZWwnLCAndmFsdWUnLCAnbWFwcGluZyddLmZvckVhY2goZnVuY3Rpb24gKGtpbmQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnaW5wdXQnKSB7XG4gICAgICAgICAgICAgIHRoaXNba2luZCArJ3NSb3dFbCddLmluc2VydEJlZm9yZSh2aWV3W2tpbmQgKyAnRWwnXSwgdGhpc1traW5kICsnc1Jvd0VsJ10ucXVlcnlTZWxlY3RvcignLm91dHB1dCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzW2tpbmQgKydzUm93RWwnXS5hcHBlbmRDaGlsZCh2aWV3W2tpbmQgKyAnRWwnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcblxuICAgICAgICAgIHRoaXNbdHlwZSArICdDbGF1c2VWaWV3cyddLnB1c2godmlldyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cblxuICAgIHRoaXMuYm9keUVsLmlubmVySFRNTCA9ICcnO1xuICAgIHRoaXMucnVsZXNWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMubW9kZWwucnVsZXMsIFJ1bGVWaWV3LCB0aGlzLmJvZHlFbCk7XG5cblxuICAgIGlmICghdGhpcy5mb290RWwpIHtcbiAgICAgIHZhciBmb290RWwgPSB0aGlzLmZvb3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rmb290Jyk7XG4gICAgICBmb290RWwuY2xhc3NOYW1lID0gJ3J1bGVzLWNvbnRyb2xzJztcbiAgICAgIGZvb3RFbC5pbm5lckhUTUwgPSAnPHRyPjx0ZCBjbGFzcz1cImFkZC1ydWxlXCI+PGEgdGl0bGU9XCJBZGQgYSBydWxlXCIgY2xhc3M9XCJpY29uLWRtbiBpY29uLXBsdXNcIj48L2E+PC90ZD48L3RyPic7XG4gICAgICB0aGlzLnRhYmxlRWwuYXBwZW5kQ2hpbGQoZm9vdEVsKTtcblxuICAgIH1cblxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlY2lzaW9uVGFibGVWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG5kZXBzKCcuL2NsYXNzTGlzdCcpO1xuXG5cbnZhciBEZWNpc2lvblRhYmxlVmlldyA9IHJlcXVpcmUoJy4vZGVjaXNpb24tdGFibGUtdmlldycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRGVjaXNpb25UYWJsZVZpZXc7XG5cbmZ1bmN0aW9uIG5vZGVMaXN0YXJyYXkoZWxzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGVscykpIHtcbiAgICByZXR1cm4gZWxzO1xuICB9XG4gIHZhciBhcnIgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbHMubGVuZ3RoOyBpKyspIHtcbiAgICBhcnIucHVzaChlbHNbaV0pO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdEFsbChzZWxlY3RvciwgY3R4KSB7XG4gIGN0eCA9IGN0eCB8fCBkb2N1bWVudDtcbiAgcmV0dXJuIG5vZGVMaXN0YXJyYXkoY3R4LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbn1cbndpbmRvdy5zZWxlY3RBbGwgPSBzZWxlY3RBbGw7IiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgcmVxdWlyZTogZmFsc2UsIGRlcHM6IGZhbHNlKi9cblxudmFyIENsYXVzZSA9IHJlcXVpcmUoJy4vY2xhdXNlLWRhdGEnKTtcblxudmFyIElucHV0TW9kZWwgPSBDbGF1c2UuTW9kZWwuZXh0ZW5kKHtcbiAgY2xhdXNlVHlwZTogJ2lucHV0J1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogSW5wdXRNb2RlbCxcbiAgQ29sbGVjdGlvbjogQ2xhdXNlLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICBtb2RlbDogSW5wdXRNb2RlbFxuICB9KVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIG1vZHVsZTogZmFsc2UsIHJlcXVpcmU6IGZhbHNlLCBkZXBzOiBmYWxzZSovXG5cbnZhciBDbGF1c2UgPSByZXF1aXJlKCcuL2NsYXVzZS1kYXRhJyk7XG5cbnZhciBPdXRwdXRNb2RlbCA9IENsYXVzZS5Nb2RlbC5leHRlbmQoe1xuICBjbGF1c2VUeXBlOiAnb3V0cHV0J1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogT3V0cHV0TW9kZWwsXG4gIENvbGxlY3Rpb246IENsYXVzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IE91dHB1dE1vZGVsXG4gIH0pXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgcmVxdWlyZTogZmFsc2UsIGRlcHM6IGZhbHNlKi9cblxudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG52YXIgQ29sbGVjdGlvbiA9IGRlcHMoJ2FtcGVyc2FuZC1jb2xsZWN0aW9uJyk7XG52YXIgQ2VsbCA9IHJlcXVpcmUoJy4vY2VsbC1kYXRhJyk7XG5cbnZhciBSdWxlTW9kZWwgPSBTdGF0ZS5leHRlbmQoe1xuICBzZXNzaW9uOiB7XG4gICAgZm9jdXNlZDogJ2Jvb2xlYW4nXG4gIH0sXG5cbiAgY29sbGVjdGlvbnM6IHtcbiAgICBjZWxsczogQ2VsbC5Db2xsZWN0aW9uXG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIGRlbHRhOiB7XG4gICAgICBkZXA6IFsnY29sbGVjdGlvbiddLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIDEgKyB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5wdXRDZWxsczoge1xuICAgICAgZGVwOiBbJ2NlbGxzJywgJ2NvbGxlY3Rpb24ucGFyZW50LmlucHV0cyddLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHMubW9kZWxzLnNsaWNlKDAsIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuaW5wdXRzLmxlbmd0aCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG91dHB1dENlbGxzOiB7XG4gICAgICBkZXA6IFsnY2VsbHMnLCAnY29sbGVjdGlvbi5wYXJlbnQuaW5wdXRzJ10sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxscy5tb2RlbHMuc2xpY2UodGhpcy5jb2xsZWN0aW9uLnBhcmVudC5pbnB1dHMubGVuZ3RoLCAtMSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFubm90YXRpb246IHtcbiAgICAgIGRlcDogWydjZWxscyddLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHMubW9kZWxzW3RoaXMuY2VsbHMubGVuZ3RoIC0gMV07XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1vZGVsOiBSdWxlTW9kZWwsXG5cbiAgQ29sbGVjdGlvbjogQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBSdWxlTW9kZWwsXG5cbiAgICAvLyBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gICB2YXIgdGFibGUgPSB0aGlzLnBhcmVudDtcblxuICAgIC8vICAgZnVuY3Rpb24gcnVsZU1hcENob2ljZXMocnVsZSkge1xuICAgIC8vICAgICBydWxlLmNlbGxzLmZvckVhY2goZnVuY3Rpb24gKGNlbGwsIGMpIHtcbiAgICAvLyAgICAgICB2YXIgY2xhdXNlO1xuXG4gICAgLy8gICAgICAgaWYgKGMgPCB0YWJsZS5pbnB1dHMubGVuZ3RoKSB7XG4gICAgLy8gICAgICAgICBjbGF1c2UgPSB0YWJsZS5pbnB1dHMuYXQoYyk7XG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICAgIGVsc2UgaWYgKGMgPCAocnVsZS5jZWxscy5sZW5ndGggLSAxKSkge1xuICAgIC8vICAgICAgICAgY2xhdXNlID0gdGFibGUub3V0cHV0cy5hdChjIC0gKHRhYmxlLmlucHV0cy5sZW5ndGggLSAwKSk7XG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICB9KTtcbiAgICAvLyAgIH1cblxuICAgIC8vICAgdGhpcy5saXN0ZW5Ubyh0YWJsZS5pbnB1dHMsICdyZXNldCcsIGZ1bmN0aW9uIChpbnB1dHMpIHtcbiAgICAvLyAgICAgLy8gY29uc29sZS5pbmZvKCdpbnB1dHMgcmVzZXQnLCBpbnB1dHMvKiwgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0qLyk7XG4gICAgLy8gICAgIHRoaXMuZm9yRWFjaChydWxlTWFwQ2hvaWNlcyk7XG4gICAgLy8gICB9KTtcblxuICAgIC8vICAgdGhpcy5saXN0ZW5Ubyh0YWJsZS5vdXRwdXRzLCAncmVzZXQnLCBmdW5jdGlvbiAob3V0cHV0cykge1xuICAgIC8vICAgICAvLyBjb25zb2xlLmluZm8oJ291dHB1dHMgcmVzZXQnLCBvdXRwdXRzLyosIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKi8pO1xuICAgIC8vICAgICB0aGlzLmZvckVhY2gocnVsZU1hcENob2ljZXMpO1xuICAgIC8vICAgfSk7XG5cbiAgICAvLyAgIHRoaXMubGlzdGVuVG8odGFibGUuaW5wdXRzLCAnYWRkJywgZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgLy8gICAgIC8vIGNvbnNvbGUuaW5mbygnaW5wdXRzIGFkZCcsIGlucHV0LyosIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKi8pO1xuICAgIC8vICAgICB0aGlzLmZvckVhY2gocnVsZU1hcENob2ljZXMpO1xuICAgIC8vICAgfSk7XG5cbiAgICAvLyAgIHRoaXMubGlzdGVuVG8odGFibGUub3V0cHV0cywgJ2FkZCcsIGZ1bmN0aW9uIChvdXRwdXQpIHtcbiAgICAvLyAgICAgLy8gY29uc29sZS5pbmZvKCdvdXRwdXRzIGFkZCcsIG91dHB1dC8qLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSovKTtcbiAgICAvLyAgICAgdGhpcy5mb3JFYWNoKHJ1bGVNYXBDaG9pY2VzKTtcbiAgICAvLyAgIH0pO1xuXG4gICAgLy8gICAvLyB0aGlzLmxpc3RlblRvKHRhYmxlLmlucHV0cywgJ3JlbW92ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgIC8vICAgY29uc29sZS5pbmZvKCdpbnB1dHMgcmVtb3ZlJywgYXJndW1lbnRzWzBdLyosIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKi8pO1xuICAgIC8vICAgLy8gfSk7XG5cbiAgICAvLyAgIC8vIHRoaXMubGlzdGVuVG8odGFibGUub3V0cHV0cywgJ3JlbW92ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgIC8vICAgY29uc29sZS5pbmZvKCdvdXRwdXRzIHJlbW92ZScsIGFyZ3VtZW50c1swXS8qLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSovKTtcbiAgICAvLyAgIC8vIH0pO1xuXG4gICAgLy8gICB0aGlzLm9uKCdhZGQnLCBydWxlTWFwQ2hvaWNlcyk7XG5cbiAgICAvLyAgIHRoaXMub24oJ3Jlc2V0JywgZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICB0aGlzLmZvckVhY2gocnVsZU1hcENob2ljZXMpO1xuICAgIC8vICAgfSk7XG4gICAgLy8gfVxuICB9KVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCByZXF1aXJlOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIENlbGxWaWV3cyA9IHJlcXVpcmUoJy4vY2VsbC12aWV3Jyk7XG52YXIgU2NvcGVDb250cm9sc1ZpZXcgPSByZXF1aXJlKCcuL3Njb3BlY29udHJvbHMtdmlldycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5cbnZhciBSdWxlVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6ICc8dHI+PHRkIGNsYXNzPVwibnVtYmVyXCI+JyArXG4gICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInZhbHVlXCI+PC9zcGFuPicgK1xuICAgICAgICAgICAgJzwvdGQ+PC90cj4nLFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLmRlbHRhJzoge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgc2VsZWN0b3I6ICcubnVtYmVyIC52YWx1ZSdcbiAgICB9LFxuXG4gICAgJ21vZGVsLmZvY3VzZWQnOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkNsYXNzJyxcbiAgICAgIG5hbWU6ICdmb2N1c2VkJ1xuICAgIH1cbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgaW5wdXRzOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdwYXJlbnQnLFxuICAgICAgICAncGFyZW50Lm1vZGVsJyxcbiAgICAgICAgJ3BhcmVudC5tb2RlbC5pbnB1dHMnXG4gICAgICBdLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lm1vZGVsLmlucHV0cztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgb3V0cHV0czoge1xuICAgICAgZGVwczogW1xuICAgICAgICAncGFyZW50JyxcbiAgICAgICAgJ3BhcmVudC5tb2RlbCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwub3V0cHV0cydcbiAgICAgIF0sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQubW9kZWwub3V0cHV0cztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYW5ub3RhdGlvbjoge1xuICAgICAgZGVwczogW1xuICAgICAgICAncGFyZW50JyxcbiAgICAgICAgJ3BhcmVudC5tb2RlbCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwuYW5ub3RhdGlvbnMnXG4gICAgICBdLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lm1vZGVsLmFubm90YXRpb25zLmF0KDApO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBwb3NpdGlvbjoge1xuICAgICAgZGVwczogW10sXG4gICAgICBjYWNoZTogZmFsc2UsIC8vIGJlY2F1c2Ugb2YgcmVzaXplXG4gICAgICBmbjogZnVuY3Rpb24gKCkgeyByZXR1cm4gdXRpbHMuZWxPZmZzZXQodGhpcy5lbCk7IH1cbiAgICB9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciByb290ID0gdGhpcy5tb2RlbC5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHJvb3QucnVsZXMsICdyZXNldCcsIHRoaXMucmVuZGVyKTtcbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHJvb3QuaW5wdXRzLCAncmVzZXQnLCB0aGlzLnJlbmRlcik7XG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bihyb290Lm91dHB1dHMsICdyZXNldCcsIHRoaXMucmVuZGVyKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuXG4gICAgdGhpcy5jYWNoZUVsZW1lbnRzKHtcbiAgICAgIG51bWJlckVsOiAnLm51bWJlcidcbiAgICB9KTtcblxuICAgIHZhciBydWxlID0gdGhpcy5tb2RlbDtcbiAgICB2YXIgY3RybHMgPSBuZXcgU2NvcGVDb250cm9sc1ZpZXcoe1xuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgc2NvcGU6IHRoaXMubW9kZWwsXG4gICAgICBjb21tYW5kczogW1xuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdSZW1vdmUgcnVsZScsXG4gICAgICAgICAgaWNvbjogJ21pbnVzJyxcbiAgICAgICAgICBoaW50OiAnUmVtb3ZlIHRoaXMgcnVsZScsXG4gICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJ1bGUuY29sbGVjdGlvbi5yZW1vdmUocnVsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RlclN1YnZpZXcoY3RybHMpO1xuICAgIHRoaXMubnVtYmVyRWwuYXBwZW5kQ2hpbGQoY3RybHMuZWwpO1xuXG4gICAgdmFyIGk7XG4gICAgdmFyIHN1YnZpZXc7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5pbnB1dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN1YnZpZXcgPSBuZXcgQ2VsbFZpZXdzLklucHV0KHtcbiAgICAgICAgbW9kZWw6ICB0aGlzLm1vZGVsLmNlbGxzLmF0KGkpLFxuICAgICAgICBwYXJlbnQ6IHRoaXNcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnJlZ2lzdGVyU3VidmlldyhzdWJ2aWV3LnJlbmRlcigpKTtcbiAgICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQoc3Vidmlldy5lbCk7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMub3V0cHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgc3VidmlldyA9IG5ldyBDZWxsVmlld3MuT3V0cHV0KHtcbiAgICAgICAgbW9kZWw6ICB0aGlzLm1vZGVsLmNlbGxzLmF0KHRoaXMuaW5wdXRzLmxlbmd0aCArIGkpLFxuICAgICAgICBwYXJlbnQ6IHRoaXNcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnJlZ2lzdGVyU3VidmlldyhzdWJ2aWV3LnJlbmRlcigpKTtcbiAgICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQoc3Vidmlldy5lbCk7XG4gICAgfVxuICAgIHN1YnZpZXcgPSBuZXcgQ2VsbFZpZXdzLkFubm90YXRpb24oe1xuICAgICAgbW9kZWw6ICB0aGlzLm1vZGVsLmFubm90YXRpb24sXG4gICAgICBwYXJlbnQ6IHRoaXNcbiAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyU3VidmlldyhzdWJ2aWV3LnJlbmRlcigpKTtcbiAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHN1YnZpZXcuZWwpO1xuXG4gICAgdGhpcy5vbignY2hhbmdlOmVsIGNoYW5nZTpwYXJlbnQnLCB0aGlzLnBvc2l0aW9uQ29udHJvbHMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJ1bGVWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgZGVwczpmYWxzZSwgcmVxdWlyZTpmYWxzZSwgbW9kdWxlOmZhbHNlKi9cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcblxudmFyIENvbnRleHRNZW51VmlldyA9IHJlcXVpcmUoJy4vY29udGV4dG1lbnUtdmlldycpO1xudmFyIGNvbnRleHRNZW51ID0gQ29udGV4dE1lbnVWaWV3Lmluc3RhbmNlKCk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cblxuXG52YXIgU2NvcGVDb250cm9sc1ZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIGF1dG9SZW5kZXI6IHRydWUsXG5cbiAgdGVtcGxhdGU6ICc8c3BhbiBjbGFzcz1cImN0cmxzXCI+PC9zcGFuPicsXG5cbiAgZGVyaXZlZDoge1xuICAgIG9mZnNldDoge1xuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxzLmVsT2Zmc2V0KHRoaXMuZWwpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgc2NvcGU6ICdzdGF0ZScsXG5cbiAgICBjb21tYW5kczoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdOyB9XG4gICAgfVxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgIGNsaWNrOiAnX2hhbmRsZUNsaWNrJ1xuICB9LFxuXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vZmZzZXQ7XG4gICAgb3B0aW9ucy5sZWZ0ICs9IHRoaXMuZWwuY2xpZW50V2lkdGg7XG4gICAgb3B0aW9ucy5jb21tYW5kcyA9IHRoaXMuY29tbWFuZHMgfHwgW107XG4gICAgY29udGV4dE1lbnUub3BlbihvcHRpb25zKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2NvcGVDb250cm9sc1ZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG5cblxuXG52YXIgU3VnZ2VzdGlvbnNDb2xsZWN0aW9uID0gQ29sbGVjdGlvbi5leHRlbmQoe1xuICBtb2RlbDogU3RhdGUuZXh0ZW5kKHtcbiAgICBwcm9wczoge1xuICAgICAgdmFsdWU6ICdzdHJpbmcnLFxuICAgICAgaHRtbDogJ3N0cmluZydcbiAgICB9XG4gIH0pXG59KTtcblxuXG5cbnZhciBTdWdnZXN0aW9uc0l0ZW1WaWV3ID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogJzxsaT48L2xpPicsXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuaHRtbCc6IHtcbiAgICAgIHR5cGU6ICdpbm5lckhUTUwnXG4gICAgfVxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgIGNsaWNrOiAnX2hhbmRsZUNsaWNrJ1xuICB9LFxuXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5wYXJlbnQgfHwgIXRoaXMucGFyZW50LnBhcmVudCkgeyByZXR1cm47IH1cbiAgICB0aGlzLnBhcmVudC5wYXJlbnQubW9kZWwudmFsdWUgPSB0aGlzLm1vZGVsLnZhbHVlO1xuICB9XG59KTtcblxuXG5cbnZhciBTdWdnZXN0aW9uc1ZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIHNlc3Npb246IHtcbiAgICB2aXNpYmxlOiAnYm9vbGVhbidcbiAgfSxcblxuICBiaW5kaW5nczoge1xuICAgIHZpc2libGU6IHtcbiAgICAgIHR5cGU6ICd0b2dnbGUnXG4gICAgfVxuICB9LFxuXG4gIHRlbXBsYXRlOiAnPHVsIGNsYXNzPVwiZG1uLXN1Z2dlc3Rpb25zLWhlbHBlclwiPjwvdWw+JyxcblxuICBjb2xsZWN0aW9uczoge1xuICAgIHN1Z2dlc3Rpb25zOiBTdWdnZXN0aW9uc0NvbGxlY3Rpb25cbiAgfSxcblxuICBzaG93OiBmdW5jdGlvbiAoc3VnZ2VzdGlvbnMsIHBhcmVudCkge1xuICAgIGlmIChzdWdnZXN0aW9ucykge1xuICAgICAgaWYgKHN1Z2dlc3Rpb25zLmlzQ29sbGVjdGlvbiAmJiBzdWdnZXN0aW9ucy5pc0NvbGxlY3Rpb24oKSkge1xuICAgICAgICBpbnN0YW5jZS5zdWdnZXN0aW9ucyA9IHN1Z2dlc3Rpb25zO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGluc3RhbmNlLnN1Z2dlc3Rpb25zLnJlc2V0KHN1Z2dlc3Rpb25zKTtcbiAgICAgIH1cbiAgICAgIGluc3RhbmNlLnZpc2libGUgPSBzdWdnZXN0aW9ucy5sZW5ndGggPiAxO1xuICAgIH1cbiAgICBpZiAocGFyZW50KSB7XG4gICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5zdWdnZXN0aW9ucywgU3VnZ2VzdGlvbnNJdGVtVmlldywgdGhpcy5lbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5cblxudmFyIGluc3RhbmNlO1xuU3VnZ2VzdGlvbnNWaWV3Lmluc3RhbmNlID0gZnVuY3Rpb24gKHN1Z2dlc3Rpb25zLCBwYXJlbnQpIHtcbiAgaWYgKCFpbnN0YW5jZSkge1xuICAgIGluc3RhbmNlID0gbmV3IFN1Z2dlc3Rpb25zVmlldyh7fSk7XG4gICAgaW5zdGFuY2UucmVuZGVyKCk7XG4gIH1cblxuICBpZiAoIWRvY3VtZW50LmJvZHkuY29udGFpbnMoaW5zdGFuY2UuZWwpKSB7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnN0YW5jZS5lbCk7XG4gIH1cblxuICBpbnN0YW5jZS5zaG93KHN1Z2dlc3Rpb25zLCBwYXJlbnQpO1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn07XG5cblxuU3VnZ2VzdGlvbnNWaWV3LkNvbGxlY3Rpb24gPSBTdWdnZXN0aW9uc0NvbGxlY3Rpb247XG5cbm1vZHVsZS5leHBvcnRzID0gU3VnZ2VzdGlvbnNWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UsIHJlcXVpcmU6IGZhbHNlKi9cblxudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0LWRhdGEnKTtcbnZhciBPdXRwdXQgPSByZXF1aXJlKCcuL291dHB1dC1kYXRhJyk7XG5cbnZhciBSdWxlID0gcmVxdWlyZSgnLi9ydWxlLWRhdGEnKTtcblxudmFyIERlY2lzaW9uVGFibGVNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIGNvbGxlY3Rpb25zOiB7XG4gICAgaW5wdXRzOiAgIElucHV0LkNvbGxlY3Rpb24sXG4gICAgb3V0cHV0czogIE91dHB1dC5Db2xsZWN0aW9uLFxuICAgIHJ1bGVzOiAgICBSdWxlLkNvbGxlY3Rpb25cbiAgfSxcblxuICBwcm9wczoge1xuICAgIG5hbWU6ICdzdHJpbmcnXG4gIH0sXG5cbiAgc2Vzc2lvbjoge1xuICAgIHg6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogMFxuICAgIH0sXG5cbiAgICB5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICB9XG4gIH0sXG5cblxuICBfY2xpcGJvYXJkOiBudWxsLFxuXG5cblxuXG5cblxuXG4gIGFkZFJ1bGU6IGZ1bmN0aW9uIChzY29wZUNlbGwpIHtcbiAgICB2YXIgY2VsbHMgPSBbXTtcbiAgICB2YXIgYztcblxuICAgIGZvciAoYyA9IDA7IGMgPCB0aGlzLmlucHV0cy5sZW5ndGg7IGMrKykge1xuICAgICAgY2VsbHMucHVzaCh7XG4gICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgY2hvaWNlczogdGhpcy5pbnB1dHMuYXQoYykuY2hvaWNlcyxcbiAgICAgICAgZm9jdXNlZDogYyA9PT0gMFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZm9yIChjID0gMDsgYyA8IHRoaXMub3V0cHV0cy5sZW5ndGg7IGMrKykge1xuICAgICAgY2VsbHMucHVzaCh7XG4gICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgY2hvaWNlczogdGhpcy5vdXRwdXRzLmF0KGMpLmNob2ljZXNcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNlbGxzLnB1c2goe1xuICAgICAgdmFsdWU6ICcnXG4gICAgfSk7XG5cbiAgICAvLyB2YXIgcnVsZSA9XG4gICAgdGhpcy5ydWxlcy5hZGQoe1xuICAgICAgY2VsbHM6IGNlbGxzXG4gICAgfSk7XG5cbiAgICAvLyBydWxlLmNlbGxzLmZvckVhY2goZnVuY3Rpb24gKGNlbGwsIGMpIHtcbiAgICAvLyAgIHZhciBjbGF1c2U7XG4gICAgLy8gICBpZiAoYyA8IHRoaXMuaW5wdXRzLmxlbmd0aCkge1xuICAgIC8vICAgICBjbGF1c2UgPSB0aGlzLmlucHV0cy5hdChjKTtcbiAgICAvLyAgICAgY2VsbC5saXN0ZW5UbyhjbGF1c2UsICdjaGFuZ2U6Y2hvaWNlcycsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgICAgICBjZWxsLmNob2ljZXMgPSBjbGF1c2UuY2hvaWNlcztcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICB9XG4gICAgLy8gICBlbHNlIGlmIChjIDwgKHJ1bGUuY2VsbHMubGVuZ3RoIC0gMSkpIHtcbiAgICAvLyAgICAgY2xhdXNlID0gdGhpcy5vdXRwdXRzLmF0KGMgLSAodGhpcy5pbnB1dHMubGVuZ3RoIC0gMCkpO1xuICAgIC8vICAgICBjZWxsLmxpc3RlblRvKGNsYXVzZSwgJ2NoYW5nZTpjaG9pY2VzJywgZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICAgIGNlbGwuY2hvaWNlcyA9IGNsYXVzZS5jaG9pY2VzO1xuICAgIC8vICAgICB9KTtcbiAgICAvLyAgIH1cbiAgICAvLyB9LCB0aGlzKTtcbiAgfSxcblxuICByZW1vdmVSdWxlOiBmdW5jdGlvbiAoc2NvcGVDZWxsKSB7XG4gICAgdGhpcy5ydWxlcy5yZW1vdmUoc2NvcGVDZWxsLmNvbGxlY3Rpb24ucGFyZW50KTtcbiAgICB0aGlzLnJ1bGVzLnRyaWdnZXIoJ3Jlc2V0Jyk7XG4gIH0sXG5cblxuICBjb3B5UnVsZTogZnVuY3Rpb24gKHNjb3BlQ2VsbCwgdXBEb3duKSB7XG4gICAgdmFyIHJ1bGVEZWx0YSA9IHRoaXMucnVsZXMuaW5kZXhPZihzY29wZUNlbGwuY29sbGVjdGlvbi5wYXJlbnQpO1xuICAgIHZhciBydWxlID0gdGhpcy5ydWxlcy5hdChydWxlRGVsdGEpO1xuICAgIGlmICghcnVsZSkgeyByZXR1cm47IH1cbiAgICBpZiAoIXVwRG93bikgeyByZXR1cm47IH1cbiAgfSxcblxuXG4gIHBhc3RlUnVsZTogZnVuY3Rpb24gKGRlbHRhKSB7XG4gICAgaWYgKCF0aGlzLl9jbGlwYm9hcmQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5ydWxlcy5hZGQodGhpcy5fY2xpcGJvYXJkLnRvSlNPTigpLCB7XG4gICAgICBhdDogZGVsdGFcbiAgICB9KTtcbiAgfSxcblxuXG4gIF9ydWxlc0NlbGxzOiBmdW5jdGlvbiAoYWRkZWQsIGRlbHRhKSB7XG4gICAgdGhpcy5ydWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICBydWxlLmNlbGxzLmFkZCh7XG4gICAgICAgIGNob2ljZXM6IGFkZGVkLmNob2ljZXNcbiAgICAgIH0sIHtcbiAgICAgICAgYXQ6IGRlbHRhLFxuICAgICAgICBzaWxlbnQ6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMucnVsZXMudHJpZ2dlcigncmVzZXQnKTtcbiAgfSxcblxuICBhZGRJbnB1dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWx0YSA9IHRoaXMuaW5wdXRzLmxlbmd0aDtcbiAgICB0aGlzLl9ydWxlc0NlbGxzKHRoaXMuaW5wdXRzLmFkZCh7XG4gICAgICBsYWJlbDogICAgbnVsbCxcbiAgICAgIGNob2ljZXM6ICBudWxsLFxuICAgICAgbWFwcGluZzogIG51bGwsXG4gICAgICBkYXRhdHlwZTogJ3N0cmluZydcbiAgICB9KSwgZGVsdGEpO1xuICB9LFxuXG4gIHJlbW92ZUlucHV0OiBmdW5jdGlvbiAoKSB7fSxcblxuXG5cbiAgYWRkT3V0cHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlbHRhID0gdGhpcy5pbnB1dHMubGVuZ3RoICsgdGhpcy5pbnB1dHMubGVuZ3RoIC0gMTtcbiAgICB0aGlzLl9ydWxlc0NlbGxzKHRoaXMub3V0cHV0cy5hZGQoe1xuICAgICAgbGFiZWw6ICAgIG51bGwsXG4gICAgICBjaG9pY2VzOiAgbnVsbCxcbiAgICAgIG1hcHBpbmc6ICBudWxsLFxuICAgICAgZGF0YXR5cGU6ICdzdHJpbmcnXG4gICAgfSksIGRlbHRhKTtcbiAgfSxcblxuICByZW1vdmVPdXRwdXQ6IGZ1bmN0aW9uICgpIHt9XG59KTtcblxud2luZG93LkRlY2lzaW9uVGFibGVNb2RlbCA9IERlY2lzaW9uVGFibGVNb2RlbDtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE1vZGVsOiBEZWNpc2lvblRhYmxlTW9kZWxcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6ZmFsc2UqL1xuXG5mdW5jdGlvbiBlbE9mZnNldChlbCkge1xuICB2YXIgbm9kZSA9IGVsO1xuICB2YXIgdG9wID0gbm9kZS5vZmZzZXRUb3A7XG4gIHZhciBsZWZ0ID0gbm9kZS5vZmZzZXRMZWZ0O1xuXG4gIHdoaWxlICgobm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50KSkge1xuICAgIHRvcCArPSBub2RlLm9mZnNldFRvcDtcbiAgICBsZWZ0ICs9IG5vZGUub2Zmc2V0TGVmdDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdG9wOiB0b3AsXG4gICAgbGVmdDogbGVmdFxuICB9O1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBlbE9mZnNldDogZWxPZmZzZXRcbn07XG4iXX0=
