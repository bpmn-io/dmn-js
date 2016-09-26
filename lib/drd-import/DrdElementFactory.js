'use strict';

var inherits = require('inherits');

var BaseElementFactory = require('diagram-js/lib/core/ElementFactory');

function DrdElementFactory() {
  BaseElementFactory.call(this);
}

inherits(DrdElementFactory, BaseElementFactory);

module.exports = DrdElementFactory;
