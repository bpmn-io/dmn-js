'use strict';

var getBusinessObject = require('../../../../util/ModelUtil').getBusinessObject;


function CopyRowHandler(modeling, tableFactory) {
  this._modeling = modeling;
  this._tableFactory = tableFactory;
}

CopyRowHandler.$inject = [ 'modeling', 'tableFactory' ];

module.exports = CopyRowHandler;


CopyRowHandler.prototype.preExecute = function(context) {
  var modeling = this._modeling;

  var row = context.row;

  modeling.createRow(row);
};

CopyRowHandler.prototype.postExecute = function(context) {
  var row = context.row,
      refRow = context.refRow;

  var businessObject = getBusinessObject(row),
      refBusinessObj = getBusinessObject(refRow),
      idx;

  // update input rules
  for (idx = 0; idx < businessObject.inputEntry.length; idx++) {
    businessObject.inputEntry[idx].text = refBusinessObj.inputEntry[idx].text;
  }

  // update output rules
  for (idx = 0; idx < businessObject.outputEntry.length; idx++) {
    businessObject.outputEntry[idx].text = refBusinessObj.outputEntry[idx].text;
  }

  // update annotation
  businessObject.description = refBusinessObj.description;
};

CopyRowHandler.prototype.execute = function(context) {};

CopyRowHandler.prototype.revert = function(context) {};
