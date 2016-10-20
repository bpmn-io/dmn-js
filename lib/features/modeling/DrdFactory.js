'use strict';


function DrdFactory(moddle) {
  this._model = moddle;
}

DrdFactory.$inject = [ 'moddle' ];


DrdFactory.prototype._needsId = function(element) {
  return element.$instanceOf('dmn:DRGElement') ||
         element.$instanceOf('dmn:Artifact');
};

DrdFactory.prototype._ensureId = function(element) {

  // generate semantic ids for elements
  // dmn:Decision -> Decision_ID
  var prefix = (element.$type || '').replace(/^[^:]*:/g, '') + '_';

  if (!element.id && this._needsId(element)) {
    element.id = this._model.ids.nextPrefixed(prefix, element);
  }
};

DrdFactory.prototype.create = function(type, attrs) {
  var element = this._model.create(type, attrs || {});

  this._ensureId(element);

  return element;
};

DrdFactory.prototype.createDiShape = function(bounds) {
  var values = [ this.createDiBounds(bounds) ];

  return this.create('dmn:ExtensionElements', { values: values });
};

DrdFactory.prototype.createDiBounds = function(bounds) {
  return this.create('biodi:Bounds', bounds);
};


module.exports = DrdFactory;
