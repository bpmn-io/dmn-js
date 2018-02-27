'use strict';

var inherits = require('inherits');

var forEach = require('lodash/collection/forEach'),
    filter = require('lodash/collection/filter');

var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');

/**
 * Defines the behaviour of what happens to the elements inside a container
 * that morphs into another DRD element
 */
function ReplaceElementBehaviour(eventBus, modeling) {
  CommandInterceptor.call(this, eventBus);

  this._modeling = modeling;

  this.postExecuted([ 'shape.replace' ], 1500, function(e) {
    var context = e.context,
        oldShape = context.oldShape,
        newShape = context.newShape,
        newId = newShape.id;


    modeling.unclaimId(oldShape.businessObject.id, oldShape.businessObject);
    modeling.updateProperties(newShape, { id: oldShape.id });

    // update id of target connection references
    forEach(newShape.outgoing, function(connection) {
      var bo = connection.businessObject,
          extensionElements,
          extension;

      if (bo.$instanceOf('dmn:Association')) {
        bo.sourceRef.href = '#' + oldShape.id;
        extensionElements = bo.extensionElements;
      } else {
        bo.requiredDecision.href = '#' + oldShape.id;
        extensionElements = bo.$parent.extensionElements;
      }

      extension = filter(extensionElements.values, function(extension) {
        return extension.$type === 'biodi:Edge' && extension.source === newId;
      })[0];

      if (extension) {
        extension.source = oldShape.id;
      }
    });
  });
}

inherits(ReplaceElementBehaviour, CommandInterceptor);

ReplaceElementBehaviour.$inject = [ 'eventBus', 'modeling' ];

module.exports = ReplaceElementBehaviour;
