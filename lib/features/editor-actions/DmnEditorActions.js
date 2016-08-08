'use strict';

var ids = new (require('diagram-js/lib/util/IdGenerator'))('table');

function DmnEditorActions(modeling, elementRegistry, selection, editorActions, simpleMode) {

  var actions = {
    ruleAdd: function() {
      var newRow = {
        id: ids.next()
      };

      modeling.createRow(newRow);
    },
    ruleAddAbove: function() {
      var selected = selection._selectedElement,
          newRow;

      if (selected) {
        newRow = {
          id: ids.next()
        };
        newRow.next = selected.row;
        modeling.createRow(newRow);
      }
    },
    ruleAddBelow: function() {
      var selected = selection._selectedElement,
          newRow;

      if (selected) {
        newRow = {
          id: ids.next()
        };
        newRow.previous = selected.row;
        modeling.createRow(newRow);
      }

    },
    ruleCopy: function() {
      var selected = selection._selectedElement,
          currRow, newRow;

      if (selected) {
        currRow = selected.row;

        while (currRow.next) {
          currRow = currRow.next;
        }

        newRow = {
          id: ids.next()
        };

        modeling.copyRow(newRow, selected.row);
      }
    },
    ruleCopyAbove: function() {
      var selected = selection._selectedElement,
          newRow;

      if (selected) {
        newRow = {
          id: ids.next()
        };
        newRow.next = selected.row;

        modeling.copyRow(newRow, selected.row);
      }
    },
    ruleCopyBelow: function() {
      var selected = selection._selectedElement,
          newRow;

      if (selected) {
        newRow = {
          id: ids.next()
        };
        newRow.previous = selected.row;

        modeling.copyRow(newRow, selected.row);
      }

    },
    ruleClear: function() {
      var selected = selection._selectedElement;

      if (selected) {
        modeling.clearRow(selected.row);
      }
    },
    ruleRemove: function() {
      var selected = selection._selectedElement;

      if (selected) {
        modeling.deleteRow(selected.row);
      }
    },
    clauseAdd: function(clauseType) {
      var newColumn,
          type,
          col;

      var clauses = {
        input: 'dmn:InputClause',
        output: 'dmn:OutputClause'
      };

      var columns = elementRegistry.filter(function(element) {
        if (element.column && element.column.businessObject &&
            element.column.businessObject.$type === clauses[clauseType]) {
          return true;
        }
        return false;
      });

      col = columns[0].column;
      type = col.businessObject.$type;

      while (col.next && col.next.businessObject && col.next.businessObject.$type === type) {
        col = col.next;
      }

      newColumn = {
        id: ids.next(),
        previous: col,
        name: '',
        isInput: clauses[clauseType] === 'dmn:InputClause'
      };

      modeling.createColumn(newColumn);
    },
    clauseAddLeft: function() {
      var selected = selection._selectedElement,
          isInput, newColumn;

      if (selected) {
        isInput = selected.column.businessObject.$type === 'dmn:InputClause';

        newColumn = {
          id: ids.next(),
          previous: selected.column.previous,
          name: '',
          isInput: isInput
        };

        modeling.createColumn(newColumn);
      }
    },
    clauseAddRight: function() {
      var selected = selection._selectedElement,
          isInput, newColumn;

      if (selected) {
        isInput = selected.column.businessObject.$type === 'dmn:InputClause';

        newColumn = {
          id: ids.next(),
          previous: selected.column,
          name: '',
          isInput: isInput
        };

        modeling.createColumn(newColumn);
      }
    },
    clauseRemove: function() {
      var selected = selection._selectedElement;

      if (selected) {
        modeling.deleteColumn(selected.column);
      }
    },
    toggleEditingMode: function() {
      if (simpleMode.isActive()) {
        simpleMode.deactivate();
      } else {
        simpleMode.activate();
      }
    }
  };

  editorActions.register(actions);
}


DmnEditorActions.$inject = [ 'modeling', 'elementRegistry', 'selection', 'editorActions', 'simpleMode' ];

module.exports = DmnEditorActions;
