'use strict';

/**
 * Adds a control to the table to add more rows
 *
 * @param {EventBus} eventBus
 */
function AddRow(eventBus, sheet, elementRegistry, modeling, moddle) {

  // add the row control row
  eventBus.on('row.added', function(event) {
    if(!event.element.businessObject && !event.element.isFoot) {
      console.log('will create model element for new row', event);
      // if there is no businessObject assigned for the new row, create a new one
      var newSemantic = moddle.create('dmn:DecisionRule', {
        id: event.element.id,
        condition: [],
        conclusion: []
      });

      newSemantic.$parent = elementRegistry.get('decisionTable').businessObject;
      newSemantic.$parent.rule.push(newSemantic);

      event.element.businessObject = newSemantic;
    }
  });
}

AddRow.$inject = [ 'eventBus', 'sheet', 'elementRegistry', 'modeling', 'moddle' ];

module.exports = AddRow;
