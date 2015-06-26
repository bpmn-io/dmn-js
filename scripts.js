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
    editable: {
      type: 'boolean',
      default: true
    }
  },

  derived: {
    rule: {
      deps: [
        'collection',
        'collection.parent'
      ],
      fn: function () {
        return this.collection.parent;
      }
    },


    table: {
      deps: [
        'rule.collection',
        'rule.collection.parent'
      ],
      cache: false,
      fn: function () {
        return this.rule.collection.parent;
      }
    },

    x: {
      deps: [
        'collection'
      ],
      cache: false,
      fn: function () {
        var cell = this;
        var cells = cell.collection;
        return cells.indexOf(cell);
      }
    },

    y: {
      deps: [
        'rule',
        'rule.collection'
      ],
      cache: false,
      fn: function () {
        var rules = this.rule.collection;
        return rules.indexOf(this.rule);
      }
    },

    focused: {
      deps: [
        'table',
        'table.x',
        'table.y',
        'x',
        'y'
      ],
      cache: false,
      fn: function () {
        return this.x === this.table.x && this.y === this.table.y;
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

    var table = this.model.table;
    var cell = this.model;
    var cells = cell.collection;
    var rule = cells.parent;
    var rules = table.rules;

    var x = cells.indexOf(cell);
    var y = rules.indexOf(rule);

    if (table.x !== x || table.y !== y) {
      table.set({
        x: x,
        y: y
      }, {
        // silent: true
      });
      table.trigger('change:focus');
    }

    this.parent.parent.hideContextMenu();
  },

  _handleClick: function () {
    this.parent.parent.hideContextMenu();
  },

  _handleContextMenu: function (evt) {
    this.parent.parent.showContextMenu(this.model, evt);
  },

  setFocus: function () {
    if (!this.el) { return; }

    if (this.model.focused) {
      this.el.classList.add('focused');
    }
    else {
      this.el.classList.remove('focused');
    }

    if (this.model.x === this.model.table.x) {
      this.el.classList.add('col-focused');
    }
    else {
      this.el.classList.remove('col-focused');
    }

    if (this.model.y === this.model.table.y) {
      this.el.classList.add('row-focused');
    }
    else {
      this.el.classList.remove('row-focused');
    }
  },

  initialize: function () {
    this.on('change:el', this.setFocus);
    this.listenToAndRun(this.model.table, 'change:focus', this.setFocus);
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
    // this.model.focused = true;
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
    }
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

var ContextMenuView = require('./contextmenu-view');
var contextMenu = ContextMenuView.instance();


var LabelView = View.extend(merge({
  events: {
    'focus':        '_handleFocus',
    'input':        '_handleInput',
    'contextmenu':  '_handleContextMenu',
  },

  bindings: {
    'model.label': {
      type: function (el, val) {
        if (document.activeElement === el) { return; }
        el.textContent = (val || '').trim();
      }
    }
  },


  _handleFocus: function () {
    this.model.collection.parent.x = this.model.x;
    this.model.collection.parent.trigger('change:focus');
  },

  _handleInput: function () {
    this._handleFocus();
    this.model.label = this.el.textContent.trim();
  },

  _handleContextMenu: function (evt) {
    var type = this.model.clauseType;
    var table = this.model.collection.parent;
    this._handleFocus();

    var addMethod = type === 'input' ? 'addInput' : 'addOutput';

    contextMenu.open({
      top: evt.pageY,
      left: evt.pageX,
      commands: [
        {
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
                  fn: function () {
                    table[addMethod]();
                  }
                },
                {
                  label: 'after',
                  icon: 'right',
                  fn: function () {
                    table[addMethod]();
                  }
                }
              ]
            },
            {
              label: 'copy',
              // icon: 'plus',
              fn: function () {},
              subcommands: [
                {
                  label: 'before',
                  icon: 'left',
                  fn: function () {}
                },
                {
                  label: 'after',
                  icon: 'right',
                  fn: function () {}
                }
              ]
            },
            {
              label: 'move',
              // icon: 'plus',
              fn: function () {},
              subcommands: [
                {
                  label: 'before',
                  icon: 'left',
                  fn: function () {}
                },
                {
                  label: 'after',
                  icon: 'right',
                  fn: function () {}
                }
              ]
            },
            {
              label: 'remove',
              icon: 'minus',
              fn: function () {}
            }
          ]
        }
      ]
    });

    try {
      evt.preventDefault();
    } catch (e) {}
  },

  initialize: function () {
    this.el.setAttribute('contenteditable', true);
    this.el.textContent = (this.model.label || '').trim();
  }
}));




var MappingView = View.extend(merge({
  events: {
    'input': '_handleInput',
  },

  bindings: {
    'model.mapping': {
      type: function (el, val) {
        if (document.activeElement === el) { return; }
        el.textContent = (val || '').trim();
      }
    }
  },

  _handleInput: function () {
    this.model.mapping = this.el.textContent.trim();
  },

  initialize: function () {
    this.el.setAttribute('contenteditable', true);
    this.el.textContent = (this.model.mapping || '').trim();
  }
}));




var ValueView = View.extend(merge({
  events: {
    'input': '_handleInput',
    'focus': '_handleFocus'
  },

  bindings: {
    'model.choices': {
      type: function (el, val) {
        if (document.activeElement === el) { return; }
        var str = '';
        if (Array.isArray(val) && val.length) {
          str = '(' + val.join(', ') + ')';
        }
        else {
          str = this.model.datatype;
        }
        el.textContent = str;
      }
    }
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

  initialize: function () {
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
        });//.render();
      });
    }, this);

    var table = this.model.collection.parent;
    this.listenToAndRun(table, 'change:focus', function () {
      if (this.model.focused) {
        this.labelEl.classList.add('col-focused');
        this.mappingEl.classList.add('col-focused');
        this.valueEl.classList.add('col-focused');
      }
      else {
        this.labelEl.classList.remove('col-focused');
        this.mappingEl.classList.remove('col-focused');
        this.valueEl.classList.remove('col-focused');
      }
    });
  }
});




module.exports = ClauseView;

},{"./contextmenu-view":6}],6:[function(require,module,exports){
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
    // var options = utils.elOffset(evt.currentTarget);
    var options = {
      left: evt.pageX,
      top: evt.pageY
    };
    // options.left += evt.currentTarget.clientWidth;

    options.scope = cellModel;
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
      footEl.className =  'rules-controls';
      footEl.innerHTML =  '<tr>' +
                            '<td class="add-rule">' +
                              '<a title="Add a rule" class="icon-dmn icon-plus"></a>' +
                            '</td>' +
                            '<td colspan="3"></td>' +
                          '</tr>';
      this.tableEl.appendChild(footEl);
    }

    var self = this;
    function makeColspan() {
      var count = 1 + self.model.inputs.length + self.model.outputs.length;
      var tds = [self.query('tfoot .add-rule').outerHTML];
      for (var c = 0; c < count; c++) {
        tds.push('<td></td>');
      }
      self.footEl.innerHTML = tds.join('');
    }
    this.model.inputs.on('add remove reset', makeColspan);
    this.model.outputs.on('add remove reset', makeColspan);
    makeColspan();

    return this;
  }
});

module.exports = DecisionTableView;

},{"./clause-view":5,"./contextmenu-view":6,"./rule-view":12,"./table-data":14}],8:[function(require,module,exports){
'use strict';
/* global require: false, module: false */

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
/*global module: false, require: false*/

var Clause = require('./clause-data');

var InputModel = Clause.Model.extend({
  clauseType: 'input',

  derived: {
    x: {
      deps: [
        'collection'
      ],
      cache: false,
      fn: function () {
        return this.collection.indexOf(this);
      }
    },

    focused: {
      deps: [
        'collection',
        'collection.parent'
      ],
      cache: false,
      fn: function () {
        return this.collection.parent.x === this.x;
      }
    }
  }
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
  clauseType: 'output',

  derived: {
    x: {
      deps: [
        'collection',
        'collection.parent',
        'collection.parent.inputs'
      ],
      cache: false,
      fn: function () {
        return this.collection.indexOf(this) + this.collection.parent.inputs.length;
      }
    },

    focused: {
      deps: [
        'collection',
        'collection.parent',
        'collection.parent.inputs'
      ],
      cache: false,
      fn: function () {
        var table = this.collection.parent;
        return table.x === this.collection.indexOf(this) + table.inputs.length;
      }
    }
  }
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
  collections: {
    cells: Cell.Collection
  },

  derived: {
    table: {
      deps: [
        'collection',
        'collection.parent'
      ],
      cache: false,
      fn: function () {
        return this.collection.parent;
      }
    },

    focused: {
      deps: [
        'collection',
        'table'
      ],
      cache: false,
      fn: function () {
        return this.collection.indexOf(this) === this.table.y;
      }
    },


    delta: {
      deps: ['collection'],
      cache: false,
      fn: function () {
        return 1 + this.collection.indexOf(this);
      }
    },

    inputCells: {
      deps: ['cells', 'table.inputs'],
      fn: function () {
        return this.cells.models.slice(0, this.table.inputs.length);
      }
    },

    outputCells: {
      deps: ['cells', 'table.inputs'],
      fn: function () {
        return this.cells.models.slice(this.table.inputs.length, -1);
      }
    },

    annotation: {
      deps: ['cells'],
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
var ContextMenuView = require('./contextmenu-view');
var contextMenu = ContextMenuView.instance();


var RuleView = View.extend({
  template: '<tr><td class="number"></td></tr>',

  bindings: {
    'model.delta': {
      type: 'text',
      selector: '.number'
    }
  },

  derived: {
    inputs: {
      deps: [
        'parent',
        'parent.model',
        'parent.model.inputs'
      ],
      cache: false,
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
      cache: false,
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
    }
  },

  events: {
    'contextmenu .number': '_handleRowContextMenu'
  },

  _handleRowContextMenu: function (evt) {
    var rule = this.model;
    var table = rule.collection.parent;

    contextMenu.open({
      left:     evt.pageX,
      top:      evt.pageY,
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

    evt.preventDefault();
  },

  setFocus: function () {
    if (!this.el) { return; }

    if (this.model.focused) {
      this.el.classList.add('row-focused');
    }
    else {
      this.el.classList.remove('row-focused');
    }
  },

  initialize: function () {
    var table = this.model.table;

    this.listenToAndRun(table, 'change:focus', this.setFocus);
    this.listenToAndRun(table.inputs, 'add remove reset', this.render);
    this.listenToAndRun(table.outputs, 'add remove reset', this.render);
  },

  render: function () {
    this.renderWithTemplate();

    this.cacheElements({
      numberEl: '.number'
    });

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


    this.setFocus();
    return this;
  }
});

module.exports = RuleView;

},{"./cell-view":2,"./contextmenu-view":6}],13:[function(require,module,exports){
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

},{"./input-data":9,"./output-data":10,"./rule-data":11}]},{},[8])(8)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzL2NlbGwtZGF0YS5qcyIsInNjcmlwdHMvY2VsbC12aWV3LmpzIiwic2NyaXB0cy9jaG9pY2Utdmlldy5qcyIsInNjcmlwdHMvY2xhdXNlLWRhdGEuanMiLCJzY3JpcHRzL2NsYXVzZS12aWV3LmpzIiwic2NyaXB0cy9jb250ZXh0bWVudS12aWV3LmpzIiwic2NyaXB0cy9kZWNpc2lvbi10YWJsZS12aWV3LmpzIiwic2NyaXB0cy9pbmRleC5qcyIsInNjcmlwdHMvaW5wdXQtZGF0YS5qcyIsInNjcmlwdHMvb3V0cHV0LWRhdGEuanMiLCJzY3JpcHRzL3J1bGUtZGF0YS5qcyIsInNjcmlwdHMvcnVsZS12aWV3LmpzIiwic2NyaXB0cy9zdWdnZXN0aW9ucy12aWV3LmpzIiwic2NyaXB0cy90YWJsZS1kYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbGNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UqL1xuXG52YXIgU3RhdGUgPSBkZXBzKCdhbXBlcnNhbmQtc3RhdGUnKTtcbnZhciBDb2xsZWN0aW9uID0gZGVwcygnYW1wZXJzYW5kLWNvbGxlY3Rpb24nKTtcblxudmFyIENlbGxNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIHByb3BzOiB7XG4gICAgdmFsdWU6ICdzdHJpbmcnXG4gIH0sXG5cbiAgc2Vzc2lvbjoge1xuICAgIGVkaXRhYmxlOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfVxuICB9LFxuXG4gIGRlcml2ZWQ6IHtcbiAgICBydWxlOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50J1xuICAgICAgXSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgICAgfVxuICAgIH0sXG5cblxuICAgIHRhYmxlOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdydWxlLmNvbGxlY3Rpb24nLFxuICAgICAgICAncnVsZS5jb2xsZWN0aW9uLnBhcmVudCdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ydWxlLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB4OiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdjb2xsZWN0aW9uJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjZWxsID0gdGhpcztcbiAgICAgICAgdmFyIGNlbGxzID0gY2VsbC5jb2xsZWN0aW9uO1xuICAgICAgICByZXR1cm4gY2VsbHMuaW5kZXhPZihjZWxsKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgeToge1xuICAgICAgZGVwczogW1xuICAgICAgICAncnVsZScsXG4gICAgICAgICdydWxlLmNvbGxlY3Rpb24nXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJ1bGVzID0gdGhpcy5ydWxlLmNvbGxlY3Rpb247XG4gICAgICAgIHJldHVybiBydWxlcy5pbmRleE9mKHRoaXMucnVsZSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGZvY3VzZWQ6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgJ3RhYmxlLngnLFxuICAgICAgICAndGFibGUueScsXG4gICAgICAgICd4JyxcbiAgICAgICAgJ3knXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PT0gdGhpcy50YWJsZS54ICYmIHRoaXMueSA9PT0gdGhpcy50YWJsZS55O1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGF1c2VEZWx0YToge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICd0YWJsZS5pbnB1dHMnLFxuICAgICAgICAndGFibGUub3V0cHV0cydcbiAgICAgIF0sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVsdGEgPSB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKTtcbiAgICAgICAgdmFyIGlucHV0cyA9IHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aDtcbiAgICAgICAgdmFyIG91dHB1dHMgPSB0aGlzLnRhYmxlLmlucHV0cy5sZW5ndGggKyB0aGlzLnRhYmxlLm91dHB1dHMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChkZWx0YSA8IGlucHV0cykge1xuICAgICAgICAgIHJldHVybiBkZWx0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZWx0YSA8IG91dHB1dHMpIHtcbiAgICAgICAgICByZXR1cm4gZGVsdGEgLSBpbnB1dHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdHlwZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICd0YWJsZS5pbnB1dHMnLFxuICAgICAgICAndGFibGUub3V0cHV0cydcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVsdGEgPSB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKTtcbiAgICAgICAgdmFyIGlucHV0cyA9IHRoaXMudGFibGUuaW5wdXRzLmxlbmd0aDtcbiAgICAgICAgdmFyIG91dHB1dHMgPSB0aGlzLnRhYmxlLmlucHV0cy5sZW5ndGggKyB0aGlzLnRhYmxlLm91dHB1dHMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChkZWx0YSA8IGlucHV0cykge1xuICAgICAgICAgIHJldHVybiAnaW5wdXQnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRlbHRhIDwgb3V0cHV0cykge1xuICAgICAgICAgIHJldHVybiAnb3V0cHV0JztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAnYW5ub3RhdGlvbic7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNsYXVzZToge1xuICAgICAgZGVwczogW1xuICAgICAgICAndGFibGUnLFxuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICdjb2xsZWN0aW9uLmxlbmd0aCcsXG4gICAgICAgICd0eXBlJyxcbiAgICAgICAgJ2NsYXVzZURlbHRhJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmNsYXVzZURlbHRhIDwgMCB8fCB0aGlzLnR5cGUgPT09ICdhbm5vdGF0aW9uJykgeyByZXR1cm47IH1cbiAgICAgICAgdmFyIGNsYXVzZSA9IHRoaXMudGFibGVbdGhpcy50eXBlICsncyddLmF0KHRoaXMuY2xhdXNlRGVsdGEpO1xuICAgICAgICByZXR1cm4gY2xhdXNlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjaG9pY2VzOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICd0YWJsZScsXG4gICAgICAgICdjb2xsZWN0aW9uLmxlbmd0aCcsXG4gICAgICAgICd0eXBlJyxcbiAgICAgICAgJ2NsYXVzZScsXG4gICAgICAgICdjbGF1c2VEZWx0YSdcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2xhdXNlKSB7IHJldHVybjsgfVxuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UuY2hvaWNlcztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IENlbGxNb2RlbCxcbiAgQ29sbGVjdGlvbjogQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBDZWxsTW9kZWxcbiAgfSlcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgcmVxdWlyZTogZmFsc2UsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlICovXG5cbnZhciBWaWV3ID0gZGVwcygnYW1wZXJzYW5kLXZpZXcnKTtcbnZhciBtZXJnZSA9IGRlcHMoJ2xvZGFzaC5tZXJnZScpO1xuXG5cbnZhciBDaG9pY2VWaWV3ID0gcmVxdWlyZSgnLi9jaG9pY2UtdmlldycpO1xudmFyIFJ1bGVDZWxsVmlldyA9IFZpZXcuZXh0ZW5kKG1lcmdlKHt9LCBDaG9pY2VWaWV3LnByb3RvdHlwZSwge1xuICB0ZW1wbGF0ZTogJzx0ZD48L3RkPicsXG5cbiAgYmluZGluZ3M6IG1lcmdlKHt9LCBDaG9pY2VWaWV3LnByb3RvdHlwZS5iaW5kaW5ncywge1xuICAgICdtb2RlbC52YWx1ZSc6IHtcbiAgICAgIHR5cGU6ICd0ZXh0J1xuICAgIH0sXG5cbiAgICAnbW9kZWwuZWRpdGFibGUnOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkF0dHJpYnV0ZScsXG4gICAgICBuYW1lOiAnY29udGVudGVkaXRhYmxlJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwuc3BlbGxjaGVja2VkJzoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW5BdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ3NwZWxsY2hlY2snXG4gICAgfSxcblxuICAgICdtb2RlbC50eXBlJzoge1xuICAgICAgdHlwZTogJ2NsYXNzJ1xuICAgIH1cbiAgfSksXG5cbiAgZXZlbnRzOiBtZXJnZSh7fSwgQ2hvaWNlVmlldy5wcm90b3R5cGUuZXZlbnRzLCB7XG4gICAgJ2NvbnRleHRtZW51JzogICdfaGFuZGxlQ29udGV4dE1lbnUnLFxuICAgICdjbGljayc6ICAgICAgICAnX2hhbmRsZUNsaWNrJ1xuICB9KSxcblxuICBfaGFuZGxlRm9jdXM6IGZ1bmN0aW9uICgpIHtcbiAgICBDaG9pY2VWaWV3LnByb3RvdHlwZS5faGFuZGxlRm9jdXMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHZhciB0YWJsZSA9IHRoaXMubW9kZWwudGFibGU7XG4gICAgdmFyIGNlbGwgPSB0aGlzLm1vZGVsO1xuICAgIHZhciBjZWxscyA9IGNlbGwuY29sbGVjdGlvbjtcbiAgICB2YXIgcnVsZSA9IGNlbGxzLnBhcmVudDtcbiAgICB2YXIgcnVsZXMgPSB0YWJsZS5ydWxlcztcblxuICAgIHZhciB4ID0gY2VsbHMuaW5kZXhPZihjZWxsKTtcbiAgICB2YXIgeSA9IHJ1bGVzLmluZGV4T2YocnVsZSk7XG5cbiAgICBpZiAodGFibGUueCAhPT0geCB8fCB0YWJsZS55ICE9PSB5KSB7XG4gICAgICB0YWJsZS5zZXQoe1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5XG4gICAgICB9LCB7XG4gICAgICAgIC8vIHNpbGVudDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB0YWJsZS50cmlnZ2VyKCdjaGFuZ2U6Zm9jdXMnKTtcbiAgICB9XG5cbiAgICB0aGlzLnBhcmVudC5wYXJlbnQuaGlkZUNvbnRleHRNZW51KCk7XG4gIH0sXG5cbiAgX2hhbmRsZUNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wYXJlbnQucGFyZW50LmhpZGVDb250ZXh0TWVudSgpO1xuICB9LFxuXG4gIF9oYW5kbGVDb250ZXh0TWVudTogZnVuY3Rpb24gKGV2dCkge1xuICAgIHRoaXMucGFyZW50LnBhcmVudC5zaG93Q29udGV4dE1lbnUodGhpcy5tb2RlbCwgZXZ0KTtcbiAgfSxcblxuICBzZXRGb2N1czogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5lbCkgeyByZXR1cm47IH1cblxuICAgIGlmICh0aGlzLm1vZGVsLmZvY3VzZWQpIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnZm9jdXNlZCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnZm9jdXNlZCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1vZGVsLnggPT09IHRoaXMubW9kZWwudGFibGUueCkge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdjb2wtZm9jdXNlZCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sLWZvY3VzZWQnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tb2RlbC55ID09PSB0aGlzLm1vZGVsLnRhYmxlLnkpIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgncm93LWZvY3VzZWQnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3Jvdy1mb2N1c2VkJyk7XG4gICAgfVxuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm9uKCdjaGFuZ2U6ZWwnLCB0aGlzLnNldEZvY3VzKTtcbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWwudGFibGUsICdjaGFuZ2U6Zm9jdXMnLCB0aGlzLnNldEZvY3VzKTtcbiAgfVxufSkpO1xuXG5cblxudmFyIFJ1bGVJbnB1dENlbGxWaWV3ID0gUnVsZUNlbGxWaWV3LmV4dGVuZCh7fSk7XG5cbnZhciBSdWxlT3V0cHV0Q2VsbFZpZXcgPSBSdWxlQ2VsbFZpZXcuZXh0ZW5kKHt9KTtcblxudmFyIFJ1bGVBbm5vdGF0aW9uQ2VsbFZpZXcgPSBSdWxlQ2VsbFZpZXcuZXh0ZW5kKHt9KTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDZWxsOiAgICAgICBSdWxlQ2VsbFZpZXcsXG4gIElucHV0OiAgICAgIFJ1bGVJbnB1dENlbGxWaWV3LFxuICBPdXRwdXQ6ICAgICBSdWxlT3V0cHV0Q2VsbFZpZXcsXG4gIEFubm90YXRpb246IFJ1bGVBbm5vdGF0aW9uQ2VsbFZpZXdcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgZGVwczogZmFsc2UsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlICovXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG5cbnZhciBTdWdnZXN0aW9uc1ZpZXcgPSByZXF1aXJlKCcuL3N1Z2dlc3Rpb25zLXZpZXcnKTtcblxudmFyIHN1Z2dlc3Rpb25zVmlldyA9IFN1Z2dlc3Rpb25zVmlldy5pbnN0YW5jZSgpO1xuXG52YXIgc3BlY2lhbEtleXMgPSBbXG4gIDggLy8gYmFja3NwYWNlXG5dO1xuXG52YXIgQ2hvaWNlVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgY29sbGVjdGlvbnM6IHtcbiAgICBjaG9pY2VzOiBTdWdnZXN0aW9uc1ZpZXcuQ29sbGVjdGlvblxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgIGlucHV0OiAnX2hhbmRsZUlucHV0JyxcbiAgICBmb2N1czogJ19oYW5kbGVGb2N1cycsXG4gICAgYmx1cjogICdfaGFuZGxlQmx1cidcbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgdmFsaWQ6ICAgICAgICAgIHtcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICB9LFxuXG4gICAgb3JpZ2luYWxWYWx1ZTogICdzdHJpbmcnXG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIGlzT3JpZ2luYWw6IHtcbiAgICAgIGRlcHM6IFsnbW9kZWwudmFsdWUnLCAnb3JpZ2luYWxWYWx1ZSddLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWwudmFsdWUgPT09IHRoaXMub3JpZ2luYWxWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwudmFsdWUnOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbHVlKSB7XG4gICAgICAgIGlmICghdmFsdWUgfHwgIXZhbHVlLnRyaW0oKSkgeyByZXR1cm47IH1cbiAgICAgICAgdGhpcy5lbC50ZXh0Q29udGVudCA9IHZhbHVlLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ21vZGVsLmZvY3VzZWQnOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkNsYXNzJyxcbiAgICAgIG5hbWU6ICdmb2N1c2VkJ1xuICAgIH0sXG5cbiAgICBpc09yaWdpbmFsOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkNsYXNzJyxcbiAgICAgIG5hbWU6ICd1bnRvdWNoZWQnXG4gICAgfVxuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKHRoaXMuZWwpIHtcbiAgICAgIHRoaXMuZWwuY29udGVudEVkaXRhYmxlID0gdHJ1ZTtcbiAgICAgIHRoaXMuZWwuc3BlbGxjaGVjayA9IGZhbHNlO1xuICAgICAgdGhpcy5vcmlnaW5hbFZhbHVlID0gdGhpcy52YWx1ZSA9IHRoaXMuZWwudGV4dENvbnRlbnQudHJpbSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMub3JpZ2luYWxWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgfVxuXG5cbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWwsICdjaGFuZ2U6Y2hvaWNlcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjaG9pY2VzID0gdGhpcy5tb2RlbC5jaG9pY2VzO1xuICAgICAgaWYgKCF0aGlzLmNob2ljZXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFjaG9pY2VzKSB7XG4gICAgICAgIGNob2ljZXMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jaG9pY2VzLnJlc2V0KGNob2ljZXMubWFwKGZ1bmN0aW9uIChjaG9pY2UpIHtcbiAgICAgICAgcmV0dXJuIHt2YWx1ZTogY2hvaWNlfTtcbiAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3VnZ2VzdGlvbnMgPSBuZXcgU3VnZ2VzdGlvbnNWaWV3LkNvbGxlY3Rpb24oe1xuICAgICAgcGFyZW50OiB0aGlzLmNob2ljZXNcbiAgICB9KTtcblxuXG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiByZXNldFN1Z2dlc3Rpb25zKCkge1xuICAgICAgc2VsZi5zdWdnZXN0aW9ucy5yZXNldChzZWxmLl9maWx0ZXIoc2VsZi52YWx1ZSkpO1xuICAgIH1cbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWwsICdjaGFuZ2U6dmFsdWUnLCByZXNldFN1Z2dlc3Rpb25zKTtcblxuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5jaG9pY2VzLCAnY2hhbmdlJywgcmVzZXRTdWdnZXN0aW9ucyk7XG5cbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMuc3VnZ2VzdGlvbnMsICdyZXNldCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghc3VnZ2VzdGlvbnNWaWV3KSB7IHJldHVybjsgfVxuICAgICAgc3VnZ2VzdGlvbnNWaWV3LmVsLnN0eWxlLmRpc3BsYXkgPSB0aGlzLnN1Z2dlc3Rpb25zLmxlbmd0aCA8IDIgPyAnbm9uZScgOiAnYmxvY2snO1xuICAgIH0pO1xuXG5cbiAgICBmdW5jdGlvbiBfaGFuZGxlUmVzaXplKCkge1xuICAgICAgc2VsZi5faGFuZGxlUmVzaXplKCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5lbCkge1xuICAgICAgdGhpcy5vbmNlKCdjaGFuZ2U6ZWwnLCBfaGFuZGxlUmVzaXplKTtcbiAgICB9XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIF9oYW5kbGVSZXNpemUpO1xuICAgIHRoaXMuX2hhbmRsZVJlc2l6ZSgpO1xuICB9LFxuXG4gIF9maWx0ZXI6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICB2YXIgZmlsdGVyZWQgPSB0aGlzLmNob2ljZXNcbiAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChjaG9pY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBjaG9pY2UudmFsdWUuaW5kZXhPZih2YWwpID09PSAwO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLm1hcChmdW5jdGlvbiAoY2hvaWNlKSB7XG4gICAgICAgICAgICB2YXIgY2hhcnMgPSB0aGlzLmVsLnRleHRDb250ZW50Lmxlbmd0aDtcbiAgICAgICAgICAgIHZhciB2YWwgPSBjaG9pY2UuZXNjYXBlKCd2YWx1ZScpO1xuICAgICAgICAgICAgdmFyIGh0bWxTdHIgPSAnPHNwYW4gY2xhc3M9XCJoaWdobGlnaHRlZFwiPicgKyB2YWwuc2xpY2UoMCwgY2hhcnMpICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgaHRtbFN0ciArPSB2YWwuc2xpY2UoY2hhcnMpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdmFsdWU6IGNob2ljZS52YWx1ZSxcbiAgICAgICAgICAgICAgaHRtbDogaHRtbFN0clxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gZmlsdGVyZWQ7XG4gIH0sXG5cbiAgX2hhbmRsZUZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5faGFuZGxlSW5wdXQoKTtcbiAgICAvLyB0aGlzLm1vZGVsLmZvY3VzZWQgPSB0cnVlO1xuICB9LFxuXG4gIF9oYW5kbGVCbHVyOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gdGhpcy5tb2RlbC5mb2N1c2VkID0gZmFsc2U7XG4gIH0sXG5cbiAgX2hhbmRsZVJlc2l6ZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5lbCB8fCAhc3VnZ2VzdGlvbnNWaWV3KSB7IHJldHVybjsgfVxuICAgIHZhciBub2RlID0gdGhpcy5lbDtcbiAgICB2YXIgdG9wID0gbm9kZS5vZmZzZXRUb3A7XG4gICAgdmFyIGxlZnQgPSBub2RlLm9mZnNldExlZnQ7XG4gICAgdmFyIGhlbHBlciA9IHN1Z2dlc3Rpb25zVmlldy5lbDtcblxuICAgIHdoaWxlICgobm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50KSkge1xuICAgICAgaWYgKG5vZGUub2Zmc2V0VG9wKSB7XG4gICAgICAgIHRvcCArPSBwYXJzZUludChub2RlLm9mZnNldFRvcCwgMTApO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUub2Zmc2V0TGVmdCkge1xuICAgICAgICBsZWZ0ICs9IHBhcnNlSW50KG5vZGUub2Zmc2V0TGVmdCwgMTApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRvcCAtPSBoZWxwZXIuY2xpZW50SGVpZ2h0O1xuICAgIGhlbHBlci5zdHlsZS50b3AgPSB0b3A7XG4gICAgaGVscGVyLnN0eWxlLmxlZnQgPSBsZWZ0O1xuICB9LFxuXG4gIF9oYW5kbGVJbnB1dDogZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmIChldnQgJiYgKHNwZWNpYWxLZXlzLmluZGV4T2YoZXZ0LmtleUNvZGUpID4gLTEgfHwgZXZ0LmN0cmxLZXkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB2YWwgPSB0aGlzLmVsLnRleHRDb250ZW50O1xuXG4gICAgdmFyIGZpbHRlcmVkID0gdGhpcy5fZmlsdGVyKHZhbCk7XG4gICAgLy8gdGhpcy5zdWdnZXN0aW9ucy5yZXNldChmaWx0ZXJlZCk7XG4gICAgc3VnZ2VzdGlvbnNWaWV3LnNob3coZmlsdGVyZWQsIHRoaXMpO1xuICAgIHRoaXMuX2hhbmRsZVJlc2l6ZSgpO1xuXG4gICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKGV2dCkge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG1hdGNoaW5nID0gZmlsdGVyZWRbMF0udmFsdWU7XG4gICAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICAgIHZhbHVlOiBtYXRjaGluZ1xuICAgICAgfSwge1xuICAgICAgICBzaWxlbnQ6IHRydWVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5lbC50ZXh0Q29udGVudCA9IG1hdGNoaW5nO1xuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hvaWNlVmlldztcbiIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIG1vZHVsZTogZmFsc2UsIGRlcHM6IGZhbHNlKi9cblxudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG52YXIgQ29sbGVjdGlvbiA9IGRlcHMoJ2FtcGVyc2FuZC1jb2xsZWN0aW9uJyk7XG5cbnZhciBDbGF1c2VNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIHByb3BzOiB7XG4gICAgbGFiZWw6ICAgICdzdHJpbmcnLFxuICAgIGNob2ljZXM6ICAnYXJyYXknLFxuICAgIG1hcHBpbmc6ICAnc3RyaW5nJyxcbiAgICBkYXRhdHlwZTogJ3N0cmluZydcbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgZWRpdGFibGU6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IENsYXVzZU1vZGVsLFxuICBDb2xsZWN0aW9uOiBDb2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IENsYXVzZU1vZGVsXG4gIH0pXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgbWVyZ2UgPSBkZXBzKCdsb2Rhc2gubWVyZ2UnKTtcblxudmFyIENvbnRleHRNZW51VmlldyA9IHJlcXVpcmUoJy4vY29udGV4dG1lbnUtdmlldycpO1xudmFyIGNvbnRleHRNZW51ID0gQ29udGV4dE1lbnVWaWV3Lmluc3RhbmNlKCk7XG5cblxudmFyIExhYmVsVmlldyA9IFZpZXcuZXh0ZW5kKG1lcmdlKHtcbiAgZXZlbnRzOiB7XG4gICAgJ2ZvY3VzJzogICAgICAgICdfaGFuZGxlRm9jdXMnLFxuICAgICdpbnB1dCc6ICAgICAgICAnX2hhbmRsZUlucHV0JyxcbiAgICAnY29udGV4dG1lbnUnOiAgJ19oYW5kbGVDb250ZXh0TWVudScsXG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwubGFiZWwnOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZWwpIHsgcmV0dXJuOyB9XG4gICAgICAgIGVsLnRleHRDb250ZW50ID0gKHZhbCB8fCAnJykudHJpbSgpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuXG4gIF9oYW5kbGVGb2N1czogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQueCA9IHRoaXMubW9kZWwueDtcbiAgICB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50LnRyaWdnZXIoJ2NoYW5nZTpmb2N1cycpO1xuICB9LFxuXG4gIF9oYW5kbGVJbnB1dDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2hhbmRsZUZvY3VzKCk7XG4gICAgdGhpcy5tb2RlbC5sYWJlbCA9IHRoaXMuZWwudGV4dENvbnRlbnQudHJpbSgpO1xuICB9LFxuXG4gIF9oYW5kbGVDb250ZXh0TWVudTogZnVuY3Rpb24gKGV2dCkge1xuICAgIHZhciB0eXBlID0gdGhpcy5tb2RlbC5jbGF1c2VUeXBlO1xuICAgIHZhciB0YWJsZSA9IHRoaXMubW9kZWwuY29sbGVjdGlvbi5wYXJlbnQ7XG4gICAgdGhpcy5faGFuZGxlRm9jdXMoKTtcblxuICAgIHZhciBhZGRNZXRob2QgPSB0eXBlID09PSAnaW5wdXQnID8gJ2FkZElucHV0JyA6ICdhZGRPdXRwdXQnO1xuXG4gICAgY29udGV4dE1lbnUub3Blbih7XG4gICAgICB0b3A6IGV2dC5wYWdlWSxcbiAgICAgIGxlZnQ6IGV2dC5wYWdlWCxcbiAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogdHlwZSA9PT0gJ2lucHV0JyA/ICdJbnB1dCcgOiAnT3V0cHV0JyxcbiAgICAgICAgICBpY29uOiB0eXBlLFxuICAgICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxhYmVsOiAnYWRkJyxcbiAgICAgICAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRhYmxlW2FkZE1ldGhvZF0oKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2JlZm9yZScsXG4gICAgICAgICAgICAgICAgICBpY29uOiAnbGVmdCcsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVthZGRNZXRob2RdKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2FmdGVyJyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVthZGRNZXRob2RdKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsYWJlbDogJ2NvcHknLFxuICAgICAgICAgICAgICAvLyBpY29uOiAncGx1cycsXG4gICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2JlZm9yZScsXG4gICAgICAgICAgICAgICAgICBpY29uOiAnbGVmdCcsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge31cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiAnYWZ0ZXInLFxuICAgICAgICAgICAgICAgICAgaWNvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdtb3ZlJyxcbiAgICAgICAgICAgICAgLy8gaWNvbjogJ3BsdXMnLFxuICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge30sXG4gICAgICAgICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdiZWZvcmUnLFxuICAgICAgICAgICAgICAgICAgaWNvbjogJ2xlZnQnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHt9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2FmdGVyJyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxhYmVsOiAncmVtb3ZlJyxcbiAgICAgICAgICAgICAgaWNvbjogJ21pbnVzJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHt9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsIHRydWUpO1xuICAgIHRoaXMuZWwudGV4dENvbnRlbnQgPSAodGhpcy5tb2RlbC5sYWJlbCB8fCAnJykudHJpbSgpO1xuICB9XG59KSk7XG5cblxuXG5cbnZhciBNYXBwaW5nVmlldyA9IFZpZXcuZXh0ZW5kKG1lcmdlKHtcbiAgZXZlbnRzOiB7XG4gICAgJ2lucHV0JzogJ19oYW5kbGVJbnB1dCcsXG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwubWFwcGluZyc6IHtcbiAgICAgIHR5cGU6IGZ1bmN0aW9uIChlbCwgdmFsKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBlbCkgeyByZXR1cm47IH1cbiAgICAgICAgZWwudGV4dENvbnRlbnQgPSAodmFsIHx8ICcnKS50cmltKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIF9oYW5kbGVJbnB1dDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwubWFwcGluZyA9IHRoaXMuZWwudGV4dENvbnRlbnQudHJpbSgpO1xuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJywgdHJ1ZSk7XG4gICAgdGhpcy5lbC50ZXh0Q29udGVudCA9ICh0aGlzLm1vZGVsLm1hcHBpbmcgfHwgJycpLnRyaW0oKTtcbiAgfVxufSkpO1xuXG5cblxuXG52YXIgVmFsdWVWaWV3ID0gVmlldy5leHRlbmQobWVyZ2Uoe1xuICBldmVudHM6IHtcbiAgICAnaW5wdXQnOiAnX2hhbmRsZUlucHV0JyxcbiAgICAnZm9jdXMnOiAnX2hhbmRsZUZvY3VzJ1xuICB9LFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLmNob2ljZXMnOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZWwpIHsgcmV0dXJuOyB9XG4gICAgICAgIHZhciBzdHIgPSAnJztcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSAmJiB2YWwubGVuZ3RoKSB7XG4gICAgICAgICAgc3RyID0gJygnICsgdmFsLmpvaW4oJywgJykgKyAnKSc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgc3RyID0gdGhpcy5tb2RlbC5kYXRhdHlwZTtcbiAgICAgICAgfVxuICAgICAgICBlbC50ZXh0Q29udGVudCA9IHN0cjtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgX2hhbmRsZUlucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbnRlbnQgPSB0aGlzLmVsLnRleHRDb250ZW50LnRyaW0oKTtcblxuICAgIGlmIChjb250ZW50WzBdID09PSAnKCcgJiYgY29udGVudC5zbGljZSgtMSkgPT09ICcpJykge1xuICAgICAgdGhpcy5tb2RlbC5jaG9pY2VzID0gY29udGVudFxuICAgICAgICAuc2xpY2UoMSwgLTEpXG4gICAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgIHJldHVybiBzdHIudHJpbSgpO1xuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICByZXR1cm4gISFzdHI7XG4gICAgICAgIH0pXG4gICAgICAgIDtcbiAgICAgIHRoaXMubW9kZWwuZGF0YXR5cGUgPSBudWxsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMubW9kZWwuY2hvaWNlcyA9IG51bGw7XG4gICAgICB0aGlzLm1vZGVsLmRhdGF0eXBlID0gY29udGVudDtcbiAgICB9XG4gIH0sXG5cbiAgX2hhbmRsZUZvY3VzOiBmdW5jdGlvbiAoKSB7XG5cbiAgfSxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsIHRydWUpO1xuICAgIHZhciBzdHIgPSAnJztcbiAgICBpZiAodGhpcy5tb2RlbC5jaG9pY2VzICYmIHRoaXMubW9kZWwuY2hvaWNlcy5sZW5ndGgpIHtcbiAgICAgIHN0ciA9ICcoJyArIHRoaXMubW9kZWwuY2hvaWNlcy5qb2luKCcsICcpICsgJyknO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHN0ciA9IHRoaXMubW9kZWwuZGF0YXR5cGU7XG4gICAgfVxuICAgIHRoaXMuZWwudGV4dENvbnRlbnQgPSBzdHI7XG4gIH1cbn0pKTtcblxuXG5cblxuXG52YXIgcmVxdWlyZWRFbGVtZW50ID0ge1xuICB0eXBlOiAnZWxlbWVudCcsXG4gIHJlcXVpcmVkOiB0cnVlXG59O1xuXG52YXIgQ2xhdXNlVmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgc2Vzc2lvbjoge1xuICAgIGxhYmVsRWw6ICAgIHJlcXVpcmVkRWxlbWVudCxcbiAgICBtYXBwaW5nRWw6ICByZXF1aXJlZEVsZW1lbnQsXG4gICAgdmFsdWVFbDogICAgcmVxdWlyZWRFbGVtZW50XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjbGF1c2UgPSB0aGlzLm1vZGVsO1xuXG4gICAgdmFyIHN1YnZpZXdzID0ge1xuICAgICAgbGFiZWw6ICAgIExhYmVsVmlldyxcbiAgICAgIG1hcHBpbmc6ICBNYXBwaW5nVmlldyxcbiAgICAgIHZhbHVlOiAgICBWYWx1ZVZpZXdcbiAgICB9O1xuXG4gICAgT2JqZWN0LmtleXMoc3Vidmlld3MpLmZvckVhY2goZnVuY3Rpb24gKGtpbmQpIHtcbiAgICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbCwgJ2NoYW5nZTonICsga2luZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpc1traW5kICsgJ1ZpZXcnXSkge1xuICAgICAgICAgIHRoaXMuc3RvcExpc3RlbmluZyh0aGlzW2tpbmQgKyAnVmlldyddKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXNba2luZCArICdWaWV3J10gPSBuZXcgc3Vidmlld3Nba2luZF0oe1xuICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICBtb2RlbDogIGNsYXVzZSxcbiAgICAgICAgICBlbDogICAgIHRoaXNba2luZCArICdFbCddXG4gICAgICAgIH0pOy8vLnJlbmRlcigpO1xuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB2YXIgdGFibGUgPSB0aGlzLm1vZGVsLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGFibGUsICdjaGFuZ2U6Zm9jdXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5tb2RlbC5mb2N1c2VkKSB7XG4gICAgICAgIHRoaXMubGFiZWxFbC5jbGFzc0xpc3QuYWRkKCdjb2wtZm9jdXNlZCcpO1xuICAgICAgICB0aGlzLm1hcHBpbmdFbC5jbGFzc0xpc3QuYWRkKCdjb2wtZm9jdXNlZCcpO1xuICAgICAgICB0aGlzLnZhbHVlRWwuY2xhc3NMaXN0LmFkZCgnY29sLWZvY3VzZWQnKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmxhYmVsRWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sLWZvY3VzZWQnKTtcbiAgICAgICAgdGhpcy5tYXBwaW5nRWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sLWZvY3VzZWQnKTtcbiAgICAgICAgdGhpcy52YWx1ZUVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbC1mb2N1c2VkJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENsYXVzZVZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG5cbnZhciBkZWZhdWx0Q29tbWFuZHMgPSBbXG4gIC8vIHtcbiAgLy8gICBsYWJlbDogJ0FjdGlvbnMnLFxuICAvLyAgIHN1YmNvbW1hbmRzOiBbXG4gIC8vICAgICB7XG4gIC8vICAgICAgIGxhYmVsOiAndW5kbycsXG4gIC8vICAgICAgIGljb246ICd1bmRvJyxcbiAgLy8gICAgICAgZm46IGZ1bmN0aW9uICgpIHt9XG4gIC8vICAgICB9LFxuICAvLyAgICAge1xuICAvLyAgICAgICBsYWJlbDogJ3JlZG8nLFxuICAvLyAgICAgICBpY29uOiAncmVkbycsXG4gIC8vICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fVxuICAvLyAgICAgfVxuICAvLyAgIF1cbiAgLy8gfSxcbiAge1xuICAgIGxhYmVsOiAnQ2VsbCcsXG4gICAgc3ViY29tbWFuZHM6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdjbGVhcicsXG4gICAgICAgIGljb246ICdjbGVhcicsXG4gICAgICAgIGhpbnQ6ICdDbGVhciB0aGUgY29udGVudCBvZiB0aGUgZm9jdXNlZCBjZWxsJyxcbiAgICAgICAgcG9zc2libGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmluZm8oJ2NsZWFyIHBvc3NpYmxlPycsIGFyZ3VtZW50cywgdGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7fVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGxhYmVsOiAnUnVsZScsXG4gICAgaWNvbjogJycsXG4gICAgc3ViY29tbWFuZHM6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuYWRkUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdjb3B5JyxcbiAgICAgICAgaWNvbjogJ2NvcHknLFxuICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmNvcHlSdWxlKHRoaXMuc2NvcGUpO1xuICAgICAgICB9LFxuICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYWJvdmUnLFxuICAgICAgICAgICAgaWNvbjogJ2Fib3ZlJyxcbiAgICAgICAgICAgIGhpbnQ6ICdDb3B5IHRoZSBydWxlIGFib3ZlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5jb3B5UnVsZSh0aGlzLnNjb3BlLCAtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2JlbG93JyxcbiAgICAgICAgICAgIGljb246ICdiZWxvdycsXG4gICAgICAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBiZWxvdyB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuY29weVJ1bGUodGhpcy5zY29wZSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgIGhpbnQ6ICdSZW1vdmUgdGhlIGZvY3VzZWQgcnVsZScsXG4gICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwucmVtb3ZlUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdjbGVhcicsXG4gICAgICAgIGljb246ICdjbGVhcicsXG4gICAgICAgIGhpbnQ6ICdDbGVhciB0aGUgZm9jdXNlZCBydWxlJyxcbiAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5jbGVhclJ1bGUodGhpcy5zY29wZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBsYWJlbDogJ0lucHV0JyxcbiAgICBpY29uOiAnaW5wdXQnLFxuICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnYWRkJyxcbiAgICAgICAgaWNvbjogJ3BsdXMnLFxuICAgICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYmVmb3JlJyxcbiAgICAgICAgICAgIGljb246ICdsZWZ0JyxcbiAgICAgICAgICAgIGhpbnQ6ICdBZGQgYW4gaW5wdXQgY2xhdXNlIGJlZm9yZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuYWRkSW5wdXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnYWZ0ZXInLFxuICAgICAgICAgICAgaWNvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgIGhpbnQ6ICdBZGQgYW4gaW5wdXQgY2xhdXNlIGFmdGVyIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGlzLnBhcmVudC5tb2RlbC5hZGRJbnB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdyZW1vdmUnLFxuICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLnJlbW92ZUlucHV0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBsYWJlbDogJ091dHB1dCcsXG4gICAgaWNvbjogJ291dHB1dCcsXG4gICAgc3ViY29tbWFuZHM6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdiZWZvcmUnLFxuICAgICAgICAgICAgaWNvbjogJ2xlZnQnLFxuICAgICAgICAgICAgaGludDogJ0FkZCBhbiBvdXRwdXQgY2xhdXNlIGJlZm9yZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnQubW9kZWwuYWRkT3V0cHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2FmdGVyJyxcbiAgICAgICAgICAgIGljb246ICdyaWdodCcsXG4gICAgICAgICAgICBoaW50OiAnQWRkIGFuIG91dHB1dCBjbGF1c2UgYWZ0ZXIgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLmFkZE91dHB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdyZW1vdmUnLFxuICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucGFyZW50Lm1vZGVsLnJlbW92ZU91dHB1dCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9XG5dO1xuXG5cblxuXG5cblxuXG5cblxudmFyIENvbW1hbmRNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIHByb3BzOiB7XG4gICAgbGFiZWw6ICdzdHJpbmcnLFxuICAgIGhpbnQ6ICdzdHJpbmcnLFxuICAgIGljb246ICdzdHJpbmcnLFxuICAgIGhyZWY6ICdzdHJpbmcnLFxuXG4gICAgcG9zc2libGU6IHtcbiAgICAgIHR5cGU6ICdhbnknLFxuICAgICAgZGVmYXVsdDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZnVuY3Rpb24gKCkge307IH0sXG4gICAgICB0ZXN0OiBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSAhPT0gJ2Z1bmN0aW9uJyAmJiBuZXdWYWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gJ211c3QgYmUgZWl0aGVyIGEgZnVuY3Rpb24gb3IgZmFsc2UnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGZuOiB7XG4gICAgICB0eXBlOiAnYW55JyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgdGVzdDogZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgIT09ICdmdW5jdGlvbicgJiYgbmV3VmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuICdtdXN0IGJlIGVpdGhlciBhIGZ1bmN0aW9uIG9yIGZhbHNlJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgZGlzYWJsZWQ6IHtcbiAgICAgIGRlcHM6IFsncG9zc2libGUnXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdGhpcy5wb3NzaWJsZSA9PT0gJ2Z1bmN0aW9uJyA/ICF0aGlzLnBvc3NpYmxlKCkgOiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgc3ViY29tbWFuZHM6IG51bGwsXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLnN1YmNvbW1hbmRzID0gbmV3IENvbW1hbmRzQ29sbGVjdGlvbihhdHRyaWJ1dGVzLnN1YmNvbW1hbmRzIHx8IFtdLCB7XG4gICAgICBwYXJlbnQ6IHRoaXNcbiAgICB9KTtcbiAgfVxufSk7XG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBDb21tYW5kc0NvbGxlY3Rpb24gPSBDb2xsZWN0aW9uLmV4dGVuZCh7XG4gIG1vZGVsOiBDb21tYW5kTW9kZWxcbn0pO1xuXG5cblxuXG5cblxuXG5cblxuXG52YXIgQ29udGV4dE1lbnVJdGVtID0gVmlldy5leHRlbmQoe1xuICBhdXRvUmVuZGVyOiB0cnVlLFxuXG4gIHRlbXBsYXRlOiAnPGxpPicgK1xuICAgICAgICAgICAgICAnPGE+JyArXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiaWNvblwiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJsYWJlbFwiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgJzwvYT4nICtcbiAgICAgICAgICAgICAgJzx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj48L3VsPicgK1xuICAgICAgICAgICAgJzwvbGk+JyxcblxuICBiaW5kaW5nczoge1xuICAgICdtb2RlbC5sYWJlbCc6IHtcbiAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgIHNlbGVjdG9yOiAnLmxhYmVsJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwuaGludCc6IHtcbiAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxuICAgICAgbmFtZTogJ3RpdGxlJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwuZm4nOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkNsYXNzJyxcbiAgICAgIHNlbGVjdG9yOiAnYScsXG4gICAgICBubzogJ2Rpc2FibGVkJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwuZGlzYWJsZWQnOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbkNsYXNzJyxcbiAgICAgIG5hbWU6ICdkaXNhYmxlZCdcbiAgICB9LFxuXG4gICAgJ21vZGVsLnN1YmNvbW1hbmRzLmxlbmd0aCc6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuQ2xhc3MnLFxuICAgICAgbmFtZTogJ2Ryb3Bkb3duJ1xuICAgIH0sXG5cbiAgICAnbW9kZWwuaHJlZic6IHtcbiAgICAgIHNlbGVjdG9yOiAnYScsXG4gICAgICBuYW1lOiAnaHJlZicsXG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbHVlKSB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ21vZGVsLmljb24nOiB7XG4gICAgICB0eXBlOiBmdW5jdGlvbiAoZWwsIHZhbHVlKSB7XG4gICAgICAgIGVsLmNsYXNzTmFtZSA9ICdpY29uICcgKyB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBzZWxlY3RvcjogJy5pY29uJ1xuICAgIH1cbiAgfSxcblxuICBldmVudHM6IHtcbiAgICBjbGljazogICAgICAnX2hhbmRsZUNsaWNrJyxcbiAgICBtb3VzZW92ZXI6ICAnX2hhbmRsZU1vdXNlb3ZlcicsXG4gICAgbW91c2VvdXQ6ICAgJ19oYW5kbGVNb3VzZW91dCdcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlbmRlcldpdGhUZW1wbGF0ZSgpO1xuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGhpcy5tb2RlbCwgJ2NoYW5nZTpzdWJjb21tYW5kcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLm1vZGVsLnN1YmNvbW1hbmRzLCBDb250ZXh0TWVudUl0ZW0sIHRoaXMucXVlcnkoJ3VsJykpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKGV2dCkge1xuICAgIGlmICh0aGlzLm1vZGVsLmZuKSB7XG4gICAgICB0aGlzLnBhcmVudC50cmlnZ2VyQ29tbWFuZCh0aGlzLm1vZGVsLCBldnQpO1xuICAgIH1cbiAgICBlbHNlIGlmICghdGhpcy5tb2RlbC5ocmVmKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH0sXG5cbiAgX2hhbmRsZU1vdXNlb3ZlcjogZnVuY3Rpb24gKCkge1xuXG4gIH0sXG5cblxuXG4gIF9oYW5kbGVNb3VzZW91dDogZnVuY3Rpb24gKCkge1xuXG4gIH0sXG5cblxuXG4gIHRyaWdnZXJDb21tYW5kOiBmdW5jdGlvbiAoY29tbWFuZCwgZXZ0KSB7XG4gICAgdGhpcy5wYXJlbnQudHJpZ2dlckNvbW1hbmQoY29tbWFuZCwgZXZ0KTtcbiAgfVxufSk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIENvbnRleHRNZW51VmlldyA9IFZpZXcuZXh0ZW5kKHtcbiAgYXV0b1JlbmRlcjogdHJ1ZSxcblxuICB0ZW1wbGF0ZTogJzxuYXYgY2xhc3M9XCJkbW4tY29udGV4dC1tZW51XCI+JyArXG4gICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY29vcmRpbmF0ZXNcIj4nICtcbiAgICAgICAgICAgICAgICAnPGxhYmVsPkNvb3Jkczo8L2xhYmVsPicgK1xuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInhcIj48L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwieVwiPjwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAnPHVsPjwvdWw+JyArXG4gICAgICAgICAgICAnPC9uYXY+JyxcblxuICBjb2xsZWN0aW9uczoge1xuICAgIGNvbW1hbmRzOiBDb21tYW5kc0NvbGxlY3Rpb25cbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgaXNPcGVuOiAnYm9vbGVhbicsXG4gICAgc2NvcGU6ICAnc3RhdGUnXG4gIH0sXG5cbiAgYmluZGluZ3M6IHtcbiAgICBpc09wZW46IHtcbiAgICAgIHR5cGU6ICd0b2dnbGUnXG4gICAgfSxcbiAgICAncGFyZW50Lm1vZGVsLngnOiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBzZWxlY3RvcjogJ2RpdiBzcGFuLngnXG4gICAgfSxcbiAgICAncGFyZW50Lm1vZGVsLnknOiB7XG4gICAgICB0eXBlOiAndGV4dCcsXG4gICAgICBzZWxlY3RvcjogJ2RpdiBzcGFuLnknXG4gICAgfVxuICB9LFxuXG4gIG9wZW46IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIHN0eWxlID0gdGhpcy5lbC5zdHlsZTtcblxuICAgIHN0eWxlLmxlZnQgPSBvcHRpb25zLmxlZnQgKyAncHgnO1xuICAgIHN0eWxlLnRvcCA9IG9wdGlvbnMudG9wICsgJ3B4JztcblxuICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcblxuICAgIHRoaXMuc2NvcGUgPSBvcHRpb25zLnNjb3BlO1xuICAgIHZhciBjb21tYW5kcyA9IG9wdGlvbnMuY29tbWFuZHMgfHwgZGVmYXVsdENvbW1hbmRzO1xuXG4gICAgdGhpcy5jb21tYW5kcy5yZXNldChjb21tYW5kcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgdHJpZ2dlckNvbW1hbmQ6IGZ1bmN0aW9uIChjb21tYW5kLCBldnQpIHtcbiAgICBjb21tYW5kLmZuLmNhbGwodGhpcywgZXZ0KTtcbiAgICBpZiAoIWNvbW1hbmQua2VlcE9wZW4pIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVuZGVyV2l0aFRlbXBsYXRlKCk7XG4gICAgdGhpcy5jYWNoZUVsZW1lbnRzKHtcbiAgICAgIGNvbW1hbmRzRWw6ICd1bCdcbiAgICB9KTtcbiAgICB0aGlzLmNvbW1hbmRzVmlldyA9IHRoaXMucmVuZGVyQ29sbGVjdGlvbih0aGlzLmNvbW1hbmRzLCBDb250ZXh0TWVudUl0ZW0sIHRoaXMuY29tbWFuZHNFbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBpbnN0YW5jZTtcbkNvbnRleHRNZW51Vmlldy5pbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCFpbnN0YW5jZSkge1xuICAgIGluc3RhbmNlID0gbmV3IENvbnRleHRNZW51VmlldygpO1xuICB9XG5cbiAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGluc3RhbmNlLmVsKSkge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5zdGFuY2UuZWwpO1xuICB9XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufTtcblxuQ29udGV4dE1lbnVWaWV3LkNvbGxlY3Rpb24gPSBDb21tYW5kc0NvbGxlY3Rpb247XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGV4dE1lbnVWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBkZXBzOiBmYWxzZSAqL1xuXG52YXIgVmlldyA9IGRlcHMoJ2FtcGVyc2FuZC12aWV3Jyk7XG52YXIgRGVjaXNpb25UYWJsZSA9IHJlcXVpcmUoJy4vdGFibGUtZGF0YScpO1xudmFyIFJ1bGVWaWV3ID0gcmVxdWlyZSgnLi9ydWxlLXZpZXcnKTtcblxuXG5cblxudmFyIENsYXVzZUhlYWRlclZpZXcgPSByZXF1aXJlKCcuL2NsYXVzZS12aWV3Jyk7XG5cbnZhciBDb250ZXh0TWVudVZpZXcgPSByZXF1aXJlKCcuL2NvbnRleHRtZW51LXZpZXcnKTtcbnZhciBjb250ZXh0TWVudSA9IENvbnRleHRNZW51Vmlldy5pbnN0YW5jZSgpO1xuXG5mdW5jdGlvbiB0b0FycmF5KGVscykge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGVscyk7XG59XG5cblxuZnVuY3Rpb24gbWFrZVRkKHR5cGUpIHtcbiAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgZWwuY2xhc3NOYW1lID0gdHlwZTtcbiAgcmV0dXJuIGVsO1xufVxuXG5cbmZ1bmN0aW9uIG1ha2VBZGRCdXR0b24oY2xhdXNlVHlwZSwgdGFibGUpIHtcbiAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBlbC5jbGFzc05hbWUgPSAnaWNvbi1kbW4gaWNvbi1wbHVzJztcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdGFibGVbY2xhdXNlVHlwZSA9PT0gJ2lucHV0JyA/ICdhZGRJbnB1dCcgOiAnYWRkT3V0cHV0J10oKTtcbiAgfSk7XG4gIHJldHVybiBlbDtcbn1cblxuXG5cblxudmFyIERlY2lzaW9uVGFibGVWaWV3ID0gVmlldy5leHRlbmQoe1xuICBhdXRvUmVuZGVyOiB0cnVlLFxuXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImRtbi10YWJsZVwiPicgK1xuICAgICAgICAgICAgICAnPGRpdiBkYXRhLWhvb2s9XCJjb250cm9sc1wiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAnPGhlYWRlcj4nICtcbiAgICAgICAgICAgICAgICAnPGgzIGRhdGEtaG9vaz1cInRhYmxlLW5hbWVcIj48L2gzPicgK1xuICAgICAgICAgICAgICAnPC9oZWFkZXI+JyArXG4gICAgICAgICAgICAgICc8dGFibGU+JyArXG4gICAgICAgICAgICAgICAgJzx0aGVhZD4nICtcbiAgICAgICAgICAgICAgICAgICc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJoaXRcIiBydWxlc3Bhbj1cIjRcIj48L3RoPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHRoIGNsYXNzPVwiaW5wdXQgZG91YmxlLWJvcmRlci1yaWdodFwiIGNvbHNwYW49XCIyXCI+SW5wdXQ8L3RoPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHRoIGNsYXNzPVwib3V0cHV0XCIgY29sc3Bhbj1cIjJcIj5PdXRwdXQ8L3RoPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHRoIGNsYXNzPVwiYW5ub3RhdGlvblwiIHJ1bGVzcGFuPVwiNFwiPkFubm90YXRpb248L3RoPicgK1xuICAgICAgICAgICAgICAgICAgJzwvdHI+JyArXG4gICAgICAgICAgICAgICAgICAnPHRyIGNsYXNzPVwibGFiZWxzXCI+PC90cj4nICtcbiAgICAgICAgICAgICAgICAgICc8dHIgY2xhc3M9XCJ2YWx1ZXNcIj48L3RyPicgK1xuICAgICAgICAgICAgICAgICAgJzx0ciBjbGFzcz1cIm1hcHBpbmdzXCI+PC90cj4nICtcbiAgICAgICAgICAgICAgICAnPC90aGVhZD4nICtcbiAgICAgICAgICAgICAgICAnPHRib2R5PjwvdGJvZHk+JyArXG4gICAgICAgICAgICAgICc8L3RhYmxlPicgK1xuICAgICAgICAgICAgJzwvZGl2PicsXG5cbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIC5hZGQtcnVsZSBhJzogJ19oYW5kbGVBZGRSdWxlQ2xpY2snXG4gIH0sXG5cbiAgX2hhbmRsZUFkZFJ1bGVDbGljazogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW9kZWwuYWRkUnVsZSgpO1xuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vZGVsID0gdGhpcy5tb2RlbCB8fCBuZXcgRGVjaXNpb25UYWJsZS5Nb2RlbCgpO1xuICB9LFxuXG4gIGhpZGVDb250ZXh0TWVudTogZnVuY3Rpb24gKCkge1xuICAgIGNvbnRleHRNZW51LmNsb3NlKCk7XG4gIH0sXG5cbiAgc2hvd0NvbnRleHRNZW51OiBmdW5jdGlvbiAoY2VsbE1vZGVsLCBldnQpIHtcbiAgICAvLyB2YXIgb3B0aW9ucyA9IHV0aWxzLmVsT2Zmc2V0KGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIGxlZnQ6IGV2dC5wYWdlWCxcbiAgICAgIHRvcDogZXZ0LnBhZ2VZXG4gICAgfTtcbiAgICAvLyBvcHRpb25zLmxlZnQgKz0gZXZ0LmN1cnJlbnRUYXJnZXQuY2xpZW50V2lkdGg7XG5cbiAgICBvcHRpb25zLnNjb3BlID0gY2VsbE1vZGVsO1xuICAgIHZhciB0YWJsZSA9IHRoaXMubW9kZWw7XG5cbiAgICBvcHRpb25zLmNvbW1hbmRzID0gW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ1J1bGUnLFxuICAgICAgICBpY29uOiAnJyxcbiAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ2FkZCcsXG4gICAgICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0YWJsZS5hZGRSdWxlKHRoaXMuc2NvcGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1YmNvbW1hbmRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ2Fib3ZlJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnYWJvdmUnLFxuICAgICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYSBydWxlIGFib3ZlIHRoZSBmb2N1c2VkIG9uZScsXG4gICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHRhYmxlLmFkZFJ1bGUodGhpcy5zY29wZSwgLTEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnYmVsb3cnLFxuICAgICAgICAgICAgICAgIGljb246ICdiZWxvdycsXG4gICAgICAgICAgICAgICAgaGludDogJ0FkZCBhIHJ1bGUgYmVsb3cgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdGFibGUuYWRkUnVsZSh0aGlzLnNjb3BlLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIC8vIHtcbiAgICAgICAgICAvLyAgIGxhYmVsOiAnY29weScsXG4gICAgICAgICAgLy8gICBpY29uOiAnY29weScsXG4gICAgICAgICAgLy8gICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vICAgICB0YWJsZS5jb3B5UnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgICAvLyAgIH0sXG4gICAgICAgICAgLy8gICBzdWJjb21tYW5kczogW1xuICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgLy8gICAgICAgbGFiZWw6ICdhYm92ZScsXG4gICAgICAgICAgLy8gICAgICAgaWNvbjogJ2Fib3ZlJyxcbiAgICAgICAgICAvLyAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBhYm92ZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgIC8vICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gICAgICAgICB0YWJsZS5jb3B5UnVsZSh0aGlzLnNjb3BlLCAtMSk7XG4gICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgIC8vICAgICB9LFxuICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgLy8gICAgICAgbGFiZWw6ICdiZWxvdycsXG4gICAgICAgICAgLy8gICAgICAgaWNvbjogJ2JlbG93JyxcbiAgICAgICAgICAvLyAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBiZWxvdyB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgIC8vICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gICAgICAgICB0YWJsZS5jb3B5UnVsZSh0aGlzLnNjb3BlLCAxKTtcbiAgICAgICAgICAvLyAgICAgICB9XG4gICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAvLyAgIF1cbiAgICAgICAgICAvLyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAncmVtb3ZlJyxcbiAgICAgICAgICAgIGljb246ICdtaW51cycsXG4gICAgICAgICAgICBoaW50OiAnUmVtb3ZlIHRoZSBmb2N1c2VkIHJ1bGUnLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGFibGUucmVtb3ZlUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnY2xlYXInLFxuICAgICAgICAgICAgaWNvbjogJ2NsZWFyJyxcbiAgICAgICAgICAgIGhpbnQ6ICdDbGVhciB0aGUgZm9jdXNlZCBydWxlJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHRhYmxlLmNsZWFyUnVsZSh0aGlzLnNjb3BlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdO1xuXG4gICAgdmFyIHR5cGUgPSBjZWxsTW9kZWwudHlwZTtcbiAgICB2YXIgYWRkTWV0aG9kID0gdHlwZSA9PT0gJ2lucHV0JyA/ICdhZGRJbnB1dCcgOiAnYWRkT3V0cHV0JztcblxuICAgIG9wdGlvbnMuY29tbWFuZHMudW5zaGlmdCh7XG4gICAgICBsYWJlbDogdHlwZSA9PT0gJ2lucHV0JyA/ICdJbnB1dCcgOiAnT3V0cHV0JyxcbiAgICAgIGljb246IHR5cGUsXG4gICAgICBzdWJjb21tYW5kczogW1xuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGFibGVbYWRkTWV0aG9kXSgpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdiZWZvcmUnLFxuICAgICAgICAgICAgICBpY29uOiAnbGVmdCcsXG4gICAgICAgICAgICAgIGhpbnQ6ICdBZGQgYW4gJyArIHR5cGUgKyAnIGNsYXVzZSBiZWZvcmUgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0YWJsZVthZGRNZXRob2RdKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxhYmVsOiAnYWZ0ZXInLFxuICAgICAgICAgICAgICBpY29uOiAncmlnaHQnLFxuICAgICAgICAgICAgICBoaW50OiAnQWRkIGFuICcgKyB0eXBlICsgJyBjbGF1c2UgYWZ0ZXIgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0YWJsZVthZGRNZXRob2RdKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBsYWJlbDogJ3JlbW92ZScsXG4gICAgICAgICAgaWNvbjogJ21pbnVzJyxcbiAgICAgICAgICBoaW50OiAnUmVtb3ZlIHRoZSAnICsgdHlwZSArICcgY2xhdXNlJyxcbiAgICAgICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNsYXVzZSA9IGNlbGxNb2RlbC5jbGF1c2U7XG4gICAgICAgICAgICB2YXIgZGVsdGEgPSBjbGF1c2UuY29sbGVjdGlvbi5pbmRleE9mKGNsYXVzZSk7XG4gICAgICAgICAgICBjbGF1c2UuY29sbGVjdGlvbi5yZW1vdmUoY2xhdXNlKTtcblxuICAgICAgICAgICAgaWYgKGNsYXVzZS5jbGF1c2VUeXBlID09PSAnb3V0cHV0Jykge1xuICAgICAgICAgICAgICBkZWx0YSArPSB0YWJsZS5pbnB1dHMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWJsZS5ydWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgICAgIHZhciBjZWxsID0gcnVsZS5jZWxscy5hdChkZWx0YSk7XG4gICAgICAgICAgICAgIHJ1bGUuY2VsbHMucmVtb3ZlKGNlbGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0YWJsZS5ydWxlcy50cmlnZ2VyKCdyZXNldCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgY29udGV4dE1lbnUub3BlbihvcHRpb25zKTtcblxuICAgIHRyeSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9LFxuXG5cbiAgcGFyc2VDaG9pY2VzOiBmdW5jdGlvbiAoZWwpIHtcbiAgICBpZiAoIWVsKSB7XG4gICAgICByZXR1cm4gJ01JU1NJTkcnO1xuICAgIH1cbiAgICB2YXIgY29udGVudCA9IGVsLnRleHRDb250ZW50LnRyaW0oKTtcblxuICAgIGlmIChjb250ZW50WzBdID09PSAnKCcgJiYgY29udGVudC5zbGljZSgtMSkgPT09ICcpJykge1xuICAgICAgcmV0dXJuIGNvbnRlbnRcbiAgICAgICAgLnNsaWNlKDEsIC0xKVxuICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgICByZXR1cm4gc3RyLnRyaW0oKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgICAgcmV0dXJuICEhc3RyO1xuICAgICAgICB9KVxuICAgICAgICA7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9LFxuXG4gIHBhcnNlUnVsZXM6IGZ1bmN0aW9uIChydWxlRWxzKSB7XG4gICAgcmV0dXJuIHJ1bGVFbHMubWFwKGZ1bmN0aW9uIChlbCkge1xuICAgICAgcmV0dXJuIGVsLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICB9KTtcbiAgfSxcblxuICBwYXJzZVRhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlucHV0cyA9IFtdO1xuICAgIHZhciBvdXRwdXRzID0gW107XG4gICAgdmFyIHJ1bGVzID0gW107XG5cbiAgICB0aGlzLnF1ZXJ5QWxsKCd0aGVhZCAubGFiZWxzIC5pbnB1dCcpLmZvckVhY2goZnVuY3Rpb24gKGVsLCBudW0pIHtcbiAgICAgIHZhciBjaG9pY2VFbHMgPSB0aGlzLnF1ZXJ5KCd0aGVhZCAudmFsdWVzIC5pbnB1dDpudGgtY2hpbGQoJyArIChudW0gKyAxKSArICcpJyk7XG5cbiAgICAgIGlucHV0cy5wdXNoKHtcbiAgICAgICAgbGFiZWw6ICAgIGVsLnRleHRDb250ZW50LnRyaW0oKSxcbiAgICAgICAgY2hvaWNlczogIHRoaXMucGFyc2VDaG9pY2VzKGNob2ljZUVscylcbiAgICAgIH0pO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdGhpcy5xdWVyeUFsbCgndGhlYWQgLmxhYmVscyAub3V0cHV0JykuZm9yRWFjaChmdW5jdGlvbiAoZWwsIG51bSkge1xuICAgICAgdmFyIGNob2ljZUVscyA9IHRoaXMucXVlcnkoJ3RoZWFkIC52YWx1ZXMgLm91dHB1dDpudGgtY2hpbGQoJyArIChudW0gKyBpbnB1dHMubGVuZ3RoICsgMSkgKyAnKScpO1xuXG4gICAgICBvdXRwdXRzLnB1c2goe1xuICAgICAgICBsYWJlbDogICAgZWwudGV4dENvbnRlbnQudHJpbSgpLFxuICAgICAgICBjaG9pY2VzOiAgdGhpcy5wYXJzZUNob2ljZXMoY2hvaWNlRWxzKVxuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0aGlzLnF1ZXJ5QWxsKCd0Ym9keSB0cicpLmZvckVhY2goZnVuY3Rpb24gKHJvdykge1xuICAgICAgdmFyIGNlbGxzID0gW107XG4gICAgICB2YXIgY2VsbEVscyA9IHJvdy5xdWVyeVNlbGVjdG9yQWxsKCd0ZCcpO1xuXG4gICAgICBmb3IgKHZhciBjID0gMTsgYyA8IGNlbGxFbHMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgdmFyIGNob2ljZXMgPSBudWxsO1xuICAgICAgICB2YXIgdmFsdWUgPSBjZWxsRWxzW2NdLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICAgICAgdmFyIHR5cGUgPSBjIDw9IGlucHV0cy5sZW5ndGggPyAnaW5wdXQnIDogKGMgPCAoY2VsbEVscy5sZW5ndGggLSAxKSA/ICdvdXRwdXQnIDogJ2Fubm90YXRpb24nKTtcbiAgICAgICAgdmFyIG9jID0gYyAtIChpbnB1dHMubGVuZ3RoICsgMSk7XG5cbiAgICAgICAgaWYgKHR5cGUgPT09ICdpbnB1dCcgJiYgaW5wdXRzW2MgLSAxXSkge1xuICAgICAgICAgIGNob2ljZXMgPSBpbnB1dHNbYyAtIDFdLmNob2ljZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ291dHB1dCcgJiYgb3V0cHV0c1tvY10pIHtcbiAgICAgICAgICBjaG9pY2VzID0gb3V0cHV0c1tvY10uY2hvaWNlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbGxzLnB1c2goe1xuICAgICAgICAgIHZhbHVlOiAgICB2YWx1ZSxcbiAgICAgICAgICBjaG9pY2VzOiAgY2hvaWNlc1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcnVsZXMucHVzaCh7XG4gICAgICAgIGNlbGxzOiBjZWxsc1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm1vZGVsLm5hbWUgPSB0aGlzLnF1ZXJ5KCdoMycpLnRleHRDb250ZW50LnRyaW0oKTtcbiAgICB0aGlzLm1vZGVsLmlucHV0cy5yZXNldChpbnB1dHMpO1xuICAgIHRoaXMubW9kZWwub3V0cHV0cy5yZXNldChvdXRwdXRzKTtcbiAgICB0aGlzLm1vZGVsLnJ1bGVzLnJlc2V0KHJ1bGVzKTtcblxuICAgIHJldHVybiB0aGlzLnRvSlNPTigpO1xuICB9LFxuXG4gIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsLnRvSlNPTigpO1xuICB9LFxuXG4gIGlucHV0Q2xhdXNlVmlld3M6IFtdLFxuICBvdXRwdXRDbGF1c2VWaWV3czogW10sXG5cbiAgX2hlYWRlckNsZWFyOiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHRvQXJyYXkodGhpcy5sYWJlbHNSb3dFbC5xdWVyeVNlbGVjdG9yQWxsKCcuJysgdHlwZSkpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICB0aGlzLmxhYmVsc1Jvd0VsLnJlbW92ZUNoaWxkKGVsKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRvQXJyYXkodGhpcy52YWx1ZXNSb3dFbC5xdWVyeVNlbGVjdG9yQWxsKCcuJysgdHlwZSkpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICB0aGlzLnZhbHVlc1Jvd0VsLnJlbW92ZUNoaWxkKGVsKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHRvQXJyYXkodGhpcy5tYXBwaW5nc1Jvd0VsLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nKyB0eXBlKSkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHRoaXMubWFwcGluZ3NSb3dFbC5yZW1vdmVDaGlsZChlbCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5lbCkge1xuICAgICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnBhcnNlVGFibGUoKTtcbiAgICAgIHRoaXMudHJpZ2dlcignY2hhbmdlOmVsJyk7XG4gICAgfVxuXG4gICAgdmFyIHRhYmxlID0gdGhpcy5tb2RlbDtcblxuICAgIGlmICghdGhpcy5oZWFkZXJFbCkge1xuICAgICAgdGhpcy5jYWNoZUVsZW1lbnRzKHtcbiAgICAgICAgdGFibGVFbDogICAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgbGFiZWxFbDogICAgICAgICAgJ2hlYWRlciBoMycsXG4gICAgICAgIGhlYWRlckVsOiAgICAgICAgICd0aGVhZCcsXG4gICAgICAgIGJvZHlFbDogICAgICAgICAgICd0Ym9keScsXG4gICAgICAgIGlucHV0c0hlYWRlckVsOiAgICd0aGVhZCB0cjpudGgtY2hpbGQoMSkgdGguaW5wdXQnLFxuICAgICAgICBvdXRwdXRzSGVhZGVyRWw6ICAndGhlYWQgdHI6bnRoLWNoaWxkKDEpIHRoLm91dHB1dCcsXG4gICAgICAgIGxhYmVsc1Jvd0VsOiAgICAgICd0aGVhZCB0ci5sYWJlbHMnLFxuICAgICAgICB2YWx1ZXNSb3dFbDogICAgICAndGhlYWQgdHIudmFsdWVzJyxcbiAgICAgICAgbWFwcGluZ3NSb3dFbDogICAgJ3RoZWFkIHRyLm1hcHBpbmdzJ1xuICAgICAgfSk7XG5cblxuICAgICAgdGhpcy5pbnB1dHNIZWFkZXJFbC5hcHBlbmRDaGlsZChtYWtlQWRkQnV0dG9uKCdpbnB1dCcsIHRhYmxlKSk7XG4gICAgICB0aGlzLm91dHB1dHNIZWFkZXJFbC5hcHBlbmRDaGlsZChtYWtlQWRkQnV0dG9uKCdvdXRwdXQnLCB0YWJsZSkpO1xuICAgIH1cblxuXG4gICAgWydpbnB1dCcsICdvdXRwdXQnXS5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRoaXMubW9kZWxbdHlwZSArICdzJ10sICdhZGQgcmVzZXQgcmVtb3ZlJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBjb2xzID0gdGhpcy5tb2RlbFt0eXBlICsgJ3MnXS5sZW5ndGg7XG4gICAgICAgIGlmIChjb2xzID4gMSkge1xuICAgICAgICAgIHRoaXNbdHlwZSArICdzSGVhZGVyRWwnXS5zZXRBdHRyaWJ1dGUoJ2NvbHNwYW4nLCBjb2xzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzW3R5cGUgKyAnc0hlYWRlckVsJ10ucmVtb3ZlQXR0cmlidXRlKCdjb2xzcGFuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9oZWFkZXJDbGVhcih0eXBlKTtcbiAgICAgICAgdGhpc1t0eXBlICsgJ0NsYXVzZVZpZXdzJ10uZm9yRWFjaChmdW5jdGlvbiAodmlldykge1xuICAgICAgICAgIHZpZXcucmVtb3ZlKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMubW9kZWxbdHlwZSArICdzJ10uZm9yRWFjaChmdW5jdGlvbiAoY2xhdXNlKSB7XG4gICAgICAgICAgdmFyIGxhYmVsRWwgPSBtYWtlVGQodHlwZSk7XG4gICAgICAgICAgdmFyIHZhbHVlRWwgPSBtYWtlVGQodHlwZSk7XG4gICAgICAgICAgdmFyIG1hcHBpbmdFbCA9IG1ha2VUZCh0eXBlKTtcblxuICAgICAgICAgIHZhciB2aWV3ID0gbmV3IENsYXVzZUhlYWRlclZpZXcoe1xuICAgICAgICAgICAgbGFiZWxFbDogICAgbGFiZWxFbCxcbiAgICAgICAgICAgIHZhbHVlRWw6ICAgIHZhbHVlRWwsXG4gICAgICAgICAgICBtYXBwaW5nRWw6ICBtYXBwaW5nRWwsXG5cbiAgICAgICAgICAgIG1vZGVsOiAgICAgIGNsYXVzZSxcbiAgICAgICAgICAgIHBhcmVudDogICAgIHRoaXNcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIFsnbGFiZWwnLCAndmFsdWUnLCAnbWFwcGluZyddLmZvckVhY2goZnVuY3Rpb24gKGtpbmQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnaW5wdXQnKSB7XG4gICAgICAgICAgICAgIHRoaXNba2luZCArJ3NSb3dFbCddLmluc2VydEJlZm9yZSh2aWV3W2tpbmQgKyAnRWwnXSwgdGhpc1traW5kICsnc1Jvd0VsJ10ucXVlcnlTZWxlY3RvcignLm91dHB1dCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzW2tpbmQgKydzUm93RWwnXS5hcHBlbmRDaGlsZCh2aWV3W2tpbmQgKyAnRWwnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyU3Vidmlldyh2aWV3KTtcblxuICAgICAgICAgIHRoaXNbdHlwZSArICdDbGF1c2VWaWV3cyddLnB1c2godmlldyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cblxuICAgIHRoaXMuYm9keUVsLmlubmVySFRNTCA9ICcnO1xuICAgIHRoaXMucnVsZXNWaWV3ID0gdGhpcy5yZW5kZXJDb2xsZWN0aW9uKHRoaXMubW9kZWwucnVsZXMsIFJ1bGVWaWV3LCB0aGlzLmJvZHlFbCk7XG5cblxuICAgIGlmICghdGhpcy5mb290RWwpIHtcbiAgICAgIHZhciBmb290RWwgPSB0aGlzLmZvb3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rmb290Jyk7XG4gICAgICBmb290RWwuY2xhc3NOYW1lID0gICdydWxlcy1jb250cm9scyc7XG4gICAgICBmb290RWwuaW5uZXJIVE1MID0gICc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImFkZC1ydWxlXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGEgdGl0bGU9XCJBZGQgYSBydWxlXCIgY2xhc3M9XCJpY29uLWRtbiBpY29uLXBsdXNcIj48L2E+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvdGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZCBjb2xzcGFuPVwiM1wiPjwvdGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8L3RyPic7XG4gICAgICB0aGlzLnRhYmxlRWwuYXBwZW5kQ2hpbGQoZm9vdEVsKTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZnVuY3Rpb24gbWFrZUNvbHNwYW4oKSB7XG4gICAgICB2YXIgY291bnQgPSAxICsgc2VsZi5tb2RlbC5pbnB1dHMubGVuZ3RoICsgc2VsZi5tb2RlbC5vdXRwdXRzLmxlbmd0aDtcbiAgICAgIHZhciB0ZHMgPSBbc2VsZi5xdWVyeSgndGZvb3QgLmFkZC1ydWxlJykub3V0ZXJIVE1MXTtcbiAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgY291bnQ7IGMrKykge1xuICAgICAgICB0ZHMucHVzaCgnPHRkPjwvdGQ+Jyk7XG4gICAgICB9XG4gICAgICBzZWxmLmZvb3RFbC5pbm5lckhUTUwgPSB0ZHMuam9pbignJyk7XG4gICAgfVxuICAgIHRoaXMubW9kZWwuaW5wdXRzLm9uKCdhZGQgcmVtb3ZlIHJlc2V0JywgbWFrZUNvbHNwYW4pO1xuICAgIHRoaXMubW9kZWwub3V0cHV0cy5vbignYWRkIHJlbW92ZSByZXNldCcsIG1ha2VDb2xzcGFuKTtcbiAgICBtYWtlQ29sc3BhbigpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlY2lzaW9uVGFibGVWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIHJlcXVpcmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlICovXG5cbnZhciBEZWNpc2lvblRhYmxlVmlldyA9IHJlcXVpcmUoJy4vZGVjaXNpb24tdGFibGUtdmlldycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRGVjaXNpb25UYWJsZVZpZXc7XG5cbmZ1bmN0aW9uIG5vZGVMaXN0YXJyYXkoZWxzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGVscykpIHtcbiAgICByZXR1cm4gZWxzO1xuICB9XG4gIHZhciBhcnIgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbHMubGVuZ3RoOyBpKyspIHtcbiAgICBhcnIucHVzaChlbHNbaV0pO1xuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdEFsbChzZWxlY3RvciwgY3R4KSB7XG4gIGN0eCA9IGN0eCB8fCBkb2N1bWVudDtcbiAgcmV0dXJuIG5vZGVMaXN0YXJyYXkoY3R4LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbn1cbndpbmRvdy5zZWxlY3RBbGwgPSBzZWxlY3RBbGw7XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6IGZhbHNlLCByZXF1aXJlOiBmYWxzZSovXG5cbnZhciBDbGF1c2UgPSByZXF1aXJlKCcuL2NsYXVzZS1kYXRhJyk7XG5cbnZhciBJbnB1dE1vZGVsID0gQ2xhdXNlLk1vZGVsLmV4dGVuZCh7XG4gIGNsYXVzZVR5cGU6ICdpbnB1dCcsXG5cbiAgZGVyaXZlZDoge1xuICAgIHg6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ2NvbGxlY3Rpb24nXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5pbmRleE9mKHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBmb2N1c2VkOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50J1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24ucGFyZW50LnggPT09IHRoaXMueDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IElucHV0TW9kZWwsXG4gIENvbGxlY3Rpb246IENsYXVzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgbW9kZWw6IElucHV0TW9kZWxcbiAgfSlcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKmdsb2JhbCBtb2R1bGU6IGZhbHNlLCByZXF1aXJlOiBmYWxzZSwgZGVwczogZmFsc2UqL1xuXG52YXIgQ2xhdXNlID0gcmVxdWlyZSgnLi9jbGF1c2UtZGF0YScpO1xuXG52YXIgT3V0cHV0TW9kZWwgPSBDbGF1c2UuTW9kZWwuZXh0ZW5kKHtcbiAgY2xhdXNlVHlwZTogJ291dHB1dCcsXG5cbiAgZGVyaXZlZDoge1xuICAgIHg6IHtcbiAgICAgIGRlcHM6IFtcbiAgICAgICAgJ2NvbGxlY3Rpb24nLFxuICAgICAgICAnY29sbGVjdGlvbi5wYXJlbnQnLFxuICAgICAgICAnY29sbGVjdGlvbi5wYXJlbnQuaW5wdXRzJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKSArIHRoaXMuY29sbGVjdGlvbi5wYXJlbnQuaW5wdXRzLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZm9jdXNlZDoge1xuICAgICAgZGVwczogW1xuICAgICAgICAnY29sbGVjdGlvbicsXG4gICAgICAgICdjb2xsZWN0aW9uLnBhcmVudCcsXG4gICAgICAgICdjb2xsZWN0aW9uLnBhcmVudC5pbnB1dHMnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRhYmxlID0gdGhpcy5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICAgICAgcmV0dXJuIHRhYmxlLnggPT09IHRoaXMuY29sbGVjdGlvbi5pbmRleE9mKHRoaXMpICsgdGFibGUuaW5wdXRzLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTW9kZWw6IE91dHB1dE1vZGVsLFxuICBDb2xsZWN0aW9uOiBDbGF1c2UuQ29sbGVjdGlvbi5leHRlbmQoe1xuICAgIG1vZGVsOiBPdXRwdXRNb2RlbFxuICB9KVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qZ2xvYmFsIG1vZHVsZTogZmFsc2UsIHJlcXVpcmU6IGZhbHNlLCBkZXBzOiBmYWxzZSovXG5cbnZhciBTdGF0ZSA9IGRlcHMoJ2FtcGVyc2FuZC1zdGF0ZScpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xudmFyIENlbGwgPSByZXF1aXJlKCcuL2NlbGwtZGF0YScpO1xuXG52YXIgUnVsZU1vZGVsID0gU3RhdGUuZXh0ZW5kKHtcbiAgY29sbGVjdGlvbnM6IHtcbiAgICBjZWxsczogQ2VsbC5Db2xsZWN0aW9uXG4gIH0sXG5cbiAgZGVyaXZlZDoge1xuICAgIHRhYmxlOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ2NvbGxlY3Rpb24ucGFyZW50J1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24ucGFyZW50O1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBmb2N1c2VkOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdjb2xsZWN0aW9uJyxcbiAgICAgICAgJ3RhYmxlJ1xuICAgICAgXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKSA9PT0gdGhpcy50YWJsZS55O1xuICAgICAgfVxuICAgIH0sXG5cblxuICAgIGRlbHRhOiB7XG4gICAgICBkZXBzOiBbJ2NvbGxlY3Rpb24nXSxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAxICsgdGhpcy5jb2xsZWN0aW9uLmluZGV4T2YodGhpcyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGlucHV0Q2VsbHM6IHtcbiAgICAgIGRlcHM6IFsnY2VsbHMnLCAndGFibGUuaW5wdXRzJ10sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxscy5tb2RlbHMuc2xpY2UoMCwgdGhpcy50YWJsZS5pbnB1dHMubGVuZ3RoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgb3V0cHV0Q2VsbHM6IHtcbiAgICAgIGRlcHM6IFsnY2VsbHMnLCAndGFibGUuaW5wdXRzJ10sXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxscy5tb2RlbHMuc2xpY2UodGhpcy50YWJsZS5pbnB1dHMubGVuZ3RoLCAtMSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFubm90YXRpb246IHtcbiAgICAgIGRlcHM6IFsnY2VsbHMnXSxcbiAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNlbGxzLm1vZGVsc1t0aGlzLmNlbGxzLmxlbmd0aCAtIDFdO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogUnVsZU1vZGVsLFxuXG4gIENvbGxlY3Rpb246IENvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICBtb2RlbDogUnVsZU1vZGVsLFxuICB9KVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCByZXF1aXJlOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIENlbGxWaWV3cyA9IHJlcXVpcmUoJy4vY2VsbC12aWV3Jyk7XG52YXIgQ29udGV4dE1lbnVWaWV3ID0gcmVxdWlyZSgnLi9jb250ZXh0bWVudS12aWV3Jyk7XG52YXIgY29udGV4dE1lbnUgPSBDb250ZXh0TWVudVZpZXcuaW5zdGFuY2UoKTtcblxuXG52YXIgUnVsZVZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiAnPHRyPjx0ZCBjbGFzcz1cIm51bWJlclwiPjwvdGQ+PC90cj4nLFxuXG4gIGJpbmRpbmdzOiB7XG4gICAgJ21vZGVsLmRlbHRhJzoge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgc2VsZWN0b3I6ICcubnVtYmVyJ1xuICAgIH1cbiAgfSxcblxuICBkZXJpdmVkOiB7XG4gICAgaW5wdXRzOiB7XG4gICAgICBkZXBzOiBbXG4gICAgICAgICdwYXJlbnQnLFxuICAgICAgICAncGFyZW50Lm1vZGVsJyxcbiAgICAgICAgJ3BhcmVudC5tb2RlbC5pbnB1dHMnXG4gICAgICBdLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lm1vZGVsLmlucHV0cztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgb3V0cHV0czoge1xuICAgICAgZGVwczogW1xuICAgICAgICAncGFyZW50JyxcbiAgICAgICAgJ3BhcmVudC5tb2RlbCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwub3V0cHV0cydcbiAgICAgIF0sXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBmbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQubW9kZWwub3V0cHV0cztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYW5ub3RhdGlvbjoge1xuICAgICAgZGVwczogW1xuICAgICAgICAncGFyZW50JyxcbiAgICAgICAgJ3BhcmVudC5tb2RlbCcsXG4gICAgICAgICdwYXJlbnQubW9kZWwuYW5ub3RhdGlvbnMnXG4gICAgICBdLFxuICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50Lm1vZGVsLmFubm90YXRpb25zLmF0KDApO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBldmVudHM6IHtcbiAgICAnY29udGV4dG1lbnUgLm51bWJlcic6ICdfaGFuZGxlUm93Q29udGV4dE1lbnUnXG4gIH0sXG5cbiAgX2hhbmRsZVJvd0NvbnRleHRNZW51OiBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIHJ1bGUgPSB0aGlzLm1vZGVsO1xuICAgIHZhciB0YWJsZSA9IHJ1bGUuY29sbGVjdGlvbi5wYXJlbnQ7XG5cbiAgICBjb250ZXh0TWVudS5vcGVuKHtcbiAgICAgIGxlZnQ6ICAgICBldnQucGFnZVgsXG4gICAgICB0b3A6ICAgICAgZXZ0LnBhZ2VZLFxuICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnUnVsZScsXG4gICAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdhZGQnLFxuICAgICAgICAgICAgICBpY29uOiAncGx1cycsXG4gICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGFibGUuYWRkUnVsZShydWxlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2Fib3ZlJyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdhYm92ZScsXG4gICAgICAgICAgICAgICAgICBoaW50OiAnQWRkIGEgcnVsZSBhYm92ZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGUuYWRkUnVsZShydWxlLCAtMSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ2JlbG93JyxcbiAgICAgICAgICAgICAgICAgIGljb246ICdiZWxvdycsXG4gICAgICAgICAgICAgICAgICBoaW50OiAnQWRkIGEgcnVsZSBiZWxvdyB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFibGUuYWRkUnVsZShydWxlLCAxKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgIGxhYmVsOiAnY29weScsXG4gICAgICAgICAgICAvLyAgIGljb246ICdjb3B5JyxcbiAgICAgICAgICAgIC8vICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vICAgICB0YWJsZS5jb3B5UnVsZShydWxlKTtcbiAgICAgICAgICAgIC8vICAgfSxcbiAgICAgICAgICAgIC8vICAgc3ViY29tbWFuZHM6IFtcbiAgICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgICAvLyAgICAgICBsYWJlbDogJ2Fib3ZlJyxcbiAgICAgICAgICAgIC8vICAgICAgIGljb246ICdhYm92ZScsXG4gICAgICAgICAgICAvLyAgICAgICBoaW50OiAnQ29weSB0aGUgcnVsZSBhYm92ZSB0aGUgZm9jdXNlZCBvbmUnLFxuICAgICAgICAgICAgLy8gICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgdGFibGUuY29weVJ1bGUocnVsZSwgLTEpO1xuICAgICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH0sXG4gICAgICAgICAgICAvLyAgICAge1xuICAgICAgICAgICAgLy8gICAgICAgbGFiZWw6ICdiZWxvdycsXG4gICAgICAgICAgICAvLyAgICAgICBpY29uOiAnYmVsb3cnLFxuICAgICAgICAgICAgLy8gICAgICAgaGludDogJ0NvcHkgdGhlIHJ1bGUgYmVsb3cgdGhlIGZvY3VzZWQgb25lJyxcbiAgICAgICAgICAgIC8vICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIHRhYmxlLmNvcHlSdWxlKHJ1bGUsIDEpO1xuICAgICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vICAgXVxuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdyZW1vdmUnLFxuICAgICAgICAgICAgICBpY29uOiAnbWludXMnLFxuICAgICAgICAgICAgICBoaW50OiAnUmVtb3ZlIHRoaXMgcnVsZScsXG4gICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcnVsZS5jb2xsZWN0aW9uLnJlbW92ZShydWxlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGFiZWw6ICdjbGVhcicsXG4gICAgICAgICAgICAgIGljb246ICdjbGVhcicsXG4gICAgICAgICAgICAgIGhpbnQ6ICdDbGVhciB0aGUgZm9jdXNlZCBydWxlJyxcbiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0YWJsZS5jbGVhclJ1bGUocnVsZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KTtcblxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuXG4gIHNldEZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmVsKSB7IHJldHVybjsgfVxuXG4gICAgaWYgKHRoaXMubW9kZWwuZm9jdXNlZCkge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdyb3ctZm9jdXNlZCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgncm93LWZvY3VzZWQnKTtcbiAgICB9XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0YWJsZSA9IHRoaXMubW9kZWwudGFibGU7XG5cbiAgICB0aGlzLmxpc3RlblRvQW5kUnVuKHRhYmxlLCAnY2hhbmdlOmZvY3VzJywgdGhpcy5zZXRGb2N1cyk7XG4gICAgdGhpcy5saXN0ZW5Ub0FuZFJ1bih0YWJsZS5pbnB1dHMsICdhZGQgcmVtb3ZlIHJlc2V0JywgdGhpcy5yZW5kZXIpO1xuICAgIHRoaXMubGlzdGVuVG9BbmRSdW4odGFibGUub3V0cHV0cywgJ2FkZCByZW1vdmUgcmVzZXQnLCB0aGlzLnJlbmRlcik7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcblxuICAgIHRoaXMuY2FjaGVFbGVtZW50cyh7XG4gICAgICBudW1iZXJFbDogJy5udW1iZXInXG4gICAgfSk7XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgc3VidmlldztcblxuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgc3VidmlldyA9IG5ldyBDZWxsVmlld3MuSW5wdXQoe1xuICAgICAgICBtb2RlbDogIHRoaXMubW9kZWwuY2VsbHMuYXQoaSksXG4gICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHN1YnZpZXcucmVuZGVyKCkpO1xuICAgICAgdGhpcy5lbC5hcHBlbmRDaGlsZChzdWJ2aWV3LmVsKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5vdXRwdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdWJ2aWV3ID0gbmV3IENlbGxWaWV3cy5PdXRwdXQoe1xuICAgICAgICBtb2RlbDogIHRoaXMubW9kZWwuY2VsbHMuYXQodGhpcy5pbnB1dHMubGVuZ3RoICsgaSksXG4gICAgICAgIHBhcmVudDogdGhpc1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHN1YnZpZXcucmVuZGVyKCkpO1xuICAgICAgdGhpcy5lbC5hcHBlbmRDaGlsZChzdWJ2aWV3LmVsKTtcbiAgICB9XG4gICAgc3VidmlldyA9IG5ldyBDZWxsVmlld3MuQW5ub3RhdGlvbih7XG4gICAgICBtb2RlbDogIHRoaXMubW9kZWwuYW5ub3RhdGlvbixcbiAgICAgIHBhcmVudDogdGhpc1xuICAgIH0pO1xuICAgIHRoaXMucmVnaXN0ZXJTdWJ2aWV3KHN1YnZpZXcucmVuZGVyKCkpO1xuICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQoc3Vidmlldy5lbCk7XG5cblxuICAgIHRoaXMuc2V0Rm9jdXMoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUnVsZVZpZXc7XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UgKi9cblxudmFyIFZpZXcgPSBkZXBzKCdhbXBlcnNhbmQtdmlldycpO1xudmFyIENvbGxlY3Rpb24gPSBkZXBzKCdhbXBlcnNhbmQtY29sbGVjdGlvbicpO1xudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG5cblxuXG52YXIgU3VnZ2VzdGlvbnNDb2xsZWN0aW9uID0gQ29sbGVjdGlvbi5leHRlbmQoe1xuICBtb2RlbDogU3RhdGUuZXh0ZW5kKHtcbiAgICBwcm9wczoge1xuICAgICAgdmFsdWU6ICdzdHJpbmcnLFxuICAgICAgaHRtbDogJ3N0cmluZydcbiAgICB9XG4gIH0pXG59KTtcblxuXG5cbnZhciBTdWdnZXN0aW9uc0l0ZW1WaWV3ID0gVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogJzxsaT48L2xpPicsXG5cbiAgYmluZGluZ3M6IHtcbiAgICAnbW9kZWwuaHRtbCc6IHtcbiAgICAgIHR5cGU6ICdpbm5lckhUTUwnXG4gICAgfVxuICB9LFxuXG4gIGV2ZW50czoge1xuICAgIGNsaWNrOiAnX2hhbmRsZUNsaWNrJ1xuICB9LFxuXG4gIF9oYW5kbGVDbGljazogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5wYXJlbnQgfHwgIXRoaXMucGFyZW50LnBhcmVudCkgeyByZXR1cm47IH1cbiAgICB0aGlzLnBhcmVudC5wYXJlbnQubW9kZWwudmFsdWUgPSB0aGlzLm1vZGVsLnZhbHVlO1xuICB9XG59KTtcblxuXG5cbnZhciBTdWdnZXN0aW9uc1ZpZXcgPSBWaWV3LmV4dGVuZCh7XG4gIHNlc3Npb246IHtcbiAgICB2aXNpYmxlOiAnYm9vbGVhbidcbiAgfSxcblxuICBiaW5kaW5nczoge1xuICAgIHZpc2libGU6IHtcbiAgICAgIHR5cGU6ICd0b2dnbGUnXG4gICAgfVxuICB9LFxuXG4gIHRlbXBsYXRlOiAnPHVsIGNsYXNzPVwiZG1uLXN1Z2dlc3Rpb25zLWhlbHBlclwiPjwvdWw+JyxcblxuICBjb2xsZWN0aW9uczoge1xuICAgIHN1Z2dlc3Rpb25zOiBTdWdnZXN0aW9uc0NvbGxlY3Rpb25cbiAgfSxcblxuICBzaG93OiBmdW5jdGlvbiAoc3VnZ2VzdGlvbnMsIHBhcmVudCkge1xuICAgIGlmIChzdWdnZXN0aW9ucykge1xuICAgICAgaWYgKHN1Z2dlc3Rpb25zLmlzQ29sbGVjdGlvbiAmJiBzdWdnZXN0aW9ucy5pc0NvbGxlY3Rpb24oKSkge1xuICAgICAgICBpbnN0YW5jZS5zdWdnZXN0aW9ucyA9IHN1Z2dlc3Rpb25zO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGluc3RhbmNlLnN1Z2dlc3Rpb25zLnJlc2V0KHN1Z2dlc3Rpb25zKTtcbiAgICAgIH1cbiAgICAgIGluc3RhbmNlLnZpc2libGUgPSBzdWdnZXN0aW9ucy5sZW5ndGggPiAxO1xuICAgIH1cbiAgICBpZiAocGFyZW50KSB7XG4gICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZW5kZXJXaXRoVGVtcGxhdGUoKTtcbiAgICB0aGlzLnJlbmRlckNvbGxlY3Rpb24odGhpcy5zdWdnZXN0aW9ucywgU3VnZ2VzdGlvbnNJdGVtVmlldywgdGhpcy5lbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5cblxudmFyIGluc3RhbmNlO1xuU3VnZ2VzdGlvbnNWaWV3Lmluc3RhbmNlID0gZnVuY3Rpb24gKHN1Z2dlc3Rpb25zLCBwYXJlbnQpIHtcbiAgaWYgKCFpbnN0YW5jZSkge1xuICAgIGluc3RhbmNlID0gbmV3IFN1Z2dlc3Rpb25zVmlldyh7fSk7XG4gICAgaW5zdGFuY2UucmVuZGVyKCk7XG4gIH1cblxuICBpZiAoIWRvY3VtZW50LmJvZHkuY29udGFpbnMoaW5zdGFuY2UuZWwpKSB7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnN0YW5jZS5lbCk7XG4gIH1cblxuICBpbnN0YW5jZS5zaG93KHN1Z2dlc3Rpb25zLCBwYXJlbnQpO1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn07XG5cblxuU3VnZ2VzdGlvbnNWaWV3LkNvbGxlY3Rpb24gPSBTdWdnZXN0aW9uc0NvbGxlY3Rpb247XG5cbm1vZHVsZS5leHBvcnRzID0gU3VnZ2VzdGlvbnNWaWV3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLypnbG9iYWwgbW9kdWxlOiBmYWxzZSwgZGVwczogZmFsc2UsIHJlcXVpcmU6IGZhbHNlKi9cblxudmFyIFN0YXRlID0gZGVwcygnYW1wZXJzYW5kLXN0YXRlJyk7XG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0LWRhdGEnKTtcbnZhciBPdXRwdXQgPSByZXF1aXJlKCcuL291dHB1dC1kYXRhJyk7XG5cbnZhciBSdWxlID0gcmVxdWlyZSgnLi9ydWxlLWRhdGEnKTtcblxudmFyIERlY2lzaW9uVGFibGVNb2RlbCA9IFN0YXRlLmV4dGVuZCh7XG4gIGNvbGxlY3Rpb25zOiB7XG4gICAgaW5wdXRzOiAgIElucHV0LkNvbGxlY3Rpb24sXG4gICAgb3V0cHV0czogIE91dHB1dC5Db2xsZWN0aW9uLFxuICAgIHJ1bGVzOiAgICBSdWxlLkNvbGxlY3Rpb25cbiAgfSxcblxuICBwcm9wczoge1xuICAgIG5hbWU6ICdzdHJpbmcnXG4gIH0sXG5cbiAgc2Vzc2lvbjoge1xuICAgIHg6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogMFxuICAgIH0sXG5cbiAgICB5OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICB9XG4gIH0sXG5cblxuICBfcnVsZUNsaXBib2FyZDogbnVsbCxcblxuXG4gIGFkZFJ1bGU6IGZ1bmN0aW9uIChzY29wZUNlbGwsIGJlZm9yZUFmdGVyKSB7XG4gICAgdmFyIGNlbGxzID0gW107XG4gICAgdmFyIGM7XG5cbiAgICBmb3IgKGMgPSAwOyBjIDwgdGhpcy5pbnB1dHMubGVuZ3RoOyBjKyspIHtcbiAgICAgIGNlbGxzLnB1c2goe1xuICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgIGNob2ljZXM6IHRoaXMuaW5wdXRzLmF0KGMpLmNob2ljZXMsXG4gICAgICAgIGZvY3VzZWQ6IGMgPT09IDBcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZvciAoYyA9IDA7IGMgPCB0aGlzLm91dHB1dHMubGVuZ3RoOyBjKyspIHtcbiAgICAgIGNlbGxzLnB1c2goe1xuICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgIGNob2ljZXM6IHRoaXMub3V0cHV0cy5hdChjKS5jaG9pY2VzXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjZWxscy5wdXNoKHtcbiAgICAgIHZhbHVlOiAnJ1xuICAgIH0pO1xuXG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICBpZiAoYmVmb3JlQWZ0ZXIpIHtcbiAgICAgIHZhciBydWxlRGVsdGEgPSB0aGlzLnJ1bGVzLmluZGV4T2Yoc2NvcGVDZWxsLmNvbGxlY3Rpb24ucGFyZW50KTtcbiAgICAgIG9wdGlvbnMuYXQgPSBydWxlRGVsdGEgKyAoYmVmb3JlQWZ0ZXIgPiAwID8gcnVsZURlbHRhIDogKHJ1bGVEZWx0YSAtIDEpKTtcbiAgICB9XG5cbiAgICB0aGlzLnJ1bGVzLmFkZCh7XG4gICAgICBjZWxsczogY2VsbHNcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHJlbW92ZVJ1bGU6IGZ1bmN0aW9uIChzY29wZUNlbGwpIHtcbiAgICB0aGlzLnJ1bGVzLnJlbW92ZShzY29wZUNlbGwuY29sbGVjdGlvbi5wYXJlbnQpO1xuICAgIHRoaXMucnVsZXMudHJpZ2dlcigncmVzZXQnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIGNvcHlSdWxlOiBmdW5jdGlvbiAoc2NvcGVDZWxsLCB1cERvd24pIHtcbiAgICB2YXIgcnVsZSA9IHNjb3BlQ2VsbC5jb2xsZWN0aW9uLnBhcmVudDtcbiAgICBpZiAoIXJ1bGUpIHsgcmV0dXJuIHRoaXM7IH1cbiAgICB0aGlzLl9ydWxlQ2xpcGJvYXJkID0gcnVsZTtcblxuICAgIGlmICh1cERvd24pIHtcbiAgICAgIHZhciBydWxlRGVsdGEgPSB0aGlzLnJ1bGVzLmluZGV4T2YocnVsZSk7XG4gICAgICB0aGlzLnBhc3RlUnVsZShydWxlRGVsdGEgKyAodXBEb3duID4gMSA/IDAgOiAxKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICBwYXN0ZVJ1bGU6IGZ1bmN0aW9uIChkZWx0YSkge1xuICAgIGlmICghdGhpcy5fcnVsZUNsaXBib2FyZCkgeyByZXR1cm4gdGhpczsgfVxuICAgIHZhciBkYXRhID0gdGhpcy5fcnVsZUNsaXBib2FyZC50b0pTT04oKTtcbiAgICB0aGlzLnJ1bGVzLmFkZChkYXRhLCB7XG4gICAgICBhdDogZGVsdGFcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIGNsZWFyUnVsZTogZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICB2YXIgcnVsZURlbHRhID0gdGhpcy5ydWxlcy5pbmRleE9mKHJ1bGUpO1xuICAgIHRoaXMucnVsZXMuYXQocnVsZURlbHRhKS5jZWxscy5mb3JFYWNoKGZ1bmN0aW9uIChjZWxsKSB7XG4gICAgICBjZWxsLnZhbHVlID0gJyc7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICBfcnVsZXNDZWxsczogZnVuY3Rpb24gKGFkZGVkLCBkZWx0YSkge1xuICAgIHRoaXMucnVsZXMuZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgICAgcnVsZS5jZWxscy5hZGQoe1xuICAgICAgICBjaG9pY2VzOiBhZGRlZC5jaG9pY2VzXG4gICAgICB9LCB7XG4gICAgICAgIGF0OiBkZWx0YSxcbiAgICAgICAgc2lsZW50OiB0cnVlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLnJ1bGVzLnRyaWdnZXIoJ3Jlc2V0Jyk7XG4gIH0sXG5cbiAgYWRkSW5wdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGVsdGEgPSB0aGlzLmlucHV0cy5sZW5ndGg7XG4gICAgdGhpcy5fcnVsZXNDZWxscyh0aGlzLmlucHV0cy5hZGQoe1xuICAgICAgbGFiZWw6ICAgIG51bGwsXG4gICAgICBjaG9pY2VzOiAgbnVsbCxcbiAgICAgIG1hcHBpbmc6ICBudWxsLFxuICAgICAgZGF0YXR5cGU6ICdzdHJpbmcnXG4gICAgfSksIGRlbHRhKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHJlbW92ZUlucHV0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuXG4gIGFkZE91dHB1dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWx0YSA9IHRoaXMuaW5wdXRzLmxlbmd0aCArIHRoaXMuaW5wdXRzLmxlbmd0aCAtIDE7XG4gICAgdGhpcy5fcnVsZXNDZWxscyh0aGlzLm91dHB1dHMuYWRkKHtcbiAgICAgIGxhYmVsOiAgICBudWxsLFxuICAgICAgY2hvaWNlczogIG51bGwsXG4gICAgICBtYXBwaW5nOiAgbnVsbCxcbiAgICAgIGRhdGF0eXBlOiAnc3RyaW5nJ1xuICAgIH0pLCBkZWx0YSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICByZW1vdmVPdXRwdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cbndpbmRvdy5EZWNpc2lvblRhYmxlTW9kZWwgPSBEZWNpc2lvblRhYmxlTW9kZWw7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBNb2RlbDogRGVjaXNpb25UYWJsZU1vZGVsXG59O1xuIl19
