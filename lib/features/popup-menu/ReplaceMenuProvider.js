'use strict';

var is = require('../../util/ModelUtil').is;

var forEach = require('lodash/collection/forEach'),
    filter = require('lodash/collection/filter');

var replaceOptions = require ('../replace/ReplaceOptions');


/**
 * This module is an element agnostic replace menu provider for the popup menu.
 */
function ReplaceMenuProvider(popupMenu, modeling, moddle, drdReplace, rules) {

  this._popupMenu = popupMenu;
  this._modeling = modeling;
  this._moddle = moddle;
  this._drdReplace = drdReplace;
  this._rules = rules;

  this.register();
}

ReplaceMenuProvider.$inject = [ 'popupMenu', 'modeling', 'moddle', 'drdReplace', 'rules' ];


/**
 * Register replace menu provider in the popup menu
 */
ReplaceMenuProvider.prototype.register = function() {
  this._popupMenu.registerProvider('dmn-replace', this);
};


/**
 * Get all entries from replaceOptions for the given element.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
ReplaceMenuProvider.prototype.getEntries = function(element) {

  var businessObject = element.businessObject;

  var rules = this._rules;

  if (!rules.allowed('shape.replace', { element: element })) {
    return [];
  }

  // start events outside event sub processes
  if (is(businessObject, 'dmn:Decision')) {

    var options = filter(replaceOptions.DECISION, function(option) {
      var notEmpty = option.actionName === 'replace-with-empty-decision' && (businessObject.decisionTable || businessObject.literalExpression);
      var notTable = option.actionName === 'replace-with-decision-table' && !businessObject.decisionTable;
      var notExp = option.actionName === 'replace-with-literal-expression' && !businessObject.literalExpression;

      return notEmpty || notTable || notExp;
    });

    return this._createEntries(element, options);
  }

  return [];
};


/**
 * Creates an array of menu entry objects for a given element.
 *
 * @param  {djs.model.Base} element
 * @param  {Object} replaceOptions
 *
 * @return {Array<Object>} a list of menu items
 */
ReplaceMenuProvider.prototype._createEntries = function(element, replaceOptions) {
  var menuEntries = [];

  var self = this;

  forEach(replaceOptions, function(definition) {
    var entry = self._createMenuEntry(definition, element);

    menuEntries.push(entry);
  });

  return menuEntries;
};


/**
 * Creates and returns a single menu entry item.
 *
 * @param  {Object} definition a single replace options definition object
 * @param  {djs.model.Base} element
 * @param  {Function} [action] an action callback function which gets called when
 *                             the menu entry is being triggered.
 *
 * @return {Object} menu entry item
 */
ReplaceMenuProvider.prototype._createMenuEntry = function(definition, element, action) {
  var replaceElement = this._drdReplace.replaceElement;

  var replaceAction = function() {
    return replaceElement(element, definition.target);
  };

  action = action || replaceAction;

  var menuEntry = {
    label: definition.label,
    className: definition.className,
    id: definition.actionName,
    action: action
  };

  return menuEntry;
};

ReplaceMenuProvider.prototype.getHeaderEntries = function(element) {
  return [];
};


module.exports = ReplaceMenuProvider;
