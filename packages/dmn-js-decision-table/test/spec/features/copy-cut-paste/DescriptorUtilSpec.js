import { bootstrapModeler, inject } from 'test/helper';

import { keys } from 'min-dash';

import {
  createDescriptor,
  reviveDescriptor
} from 'src/features/copy-cut-paste/DescriptorUtil';

import {
  Row,
  Col,
  Cell
} from 'table-js/lib/model';

import TestDiagram from './copy-cut-paste.dmn';

import CoreModule from 'src/core';
import ModelingModule from 'src/features/modeling';


describe('DescriptorUtil', function() {

  beforeEach(bootstrapModeler(TestDiagram, {
    modules: [
      CoreModule,
      ModelingModule
    ]
  }));


  describe('#createDescriptor', function() {

    it('should create Cell descriptor', inject(function(elementRegistry) {

      // given
      const cell = elementRegistry.get('inputEntry1');

      // when
      const descriptor = createDescriptor(cell);

      // then

      // business object
      const inputEntry1Bo = {
        $type: 'dmn:UnaryTests',
        id: 'inputEntry1',
        text: '"bronze"'
      };

      // table element
      const inputEntry1 = {
        id: 'inputEntry1',
        type: 'cell',
        businessObject: inputEntry1Bo
      };

      expect(descriptor).to.deep.eql({
        root: inputEntry1,
        descriptorCache: {
          elements: {
            inputEntry1
          },
          boCache: {
            inputEntry1: inputEntry1Bo
          }
        }
      });

    }));


    it('should create Row descriptor', inject(function(elementRegistry) {

      // given
      const row = elementRegistry.get('rule1');

      // when
      const descriptor = createDescriptor(row);

      // then

      // business objects
      const inputEntry1Bo = {
        $type: 'dmn:UnaryTests',
        id: 'inputEntry1',
        text: '"bronze"'
      };

      const inputEntry2Bo = {
        $type: 'dmn:UnaryTests',
        id: 'inputEntry2'
      };

      const outputEntry1Bo = {
        $type: 'dmn:LiteralExpression',
        id: 'outputEntry1',
        text: '"notok"'
      };

      const outputEntry2Bo = {
        $type: 'dmn:LiteralExpression',
        id: 'outputEntry2',
        text: '"work on your status first, as bronze you\'re not going to get anything"'
      };

      const rule1Bo = {
        $type: 'dmn:DecisionRule',
        id: 'rule1',
        description: 'Bronze is really not that good',
        inputEntry: [
          inputEntry1Bo,
          inputEntry2Bo
        ],
        outputEntry: [
          outputEntry1Bo,
          outputEntry2Bo
        ]
      };

      // table elements
      const inputEntry1 = {
        id: 'inputEntry1',
        type: 'cell',
        businessObject: inputEntry1Bo
      };

      const inputEntry2 = {
        id: 'inputEntry2',
        type: 'cell',
        businessObject: inputEntry2Bo
      };

      const outputEntry1 = {
        id: 'outputEntry1',
        type: 'cell',
        businessObject: outputEntry1Bo
      };

      const outputEntry2 = {
        id: 'outputEntry2',
        type: 'cell',
        businessObject: outputEntry2Bo
      };

      const rule1 = {
        id: 'rule1',
        type: 'row',
        cells: [
          inputEntry1,
          inputEntry2,
          outputEntry1,
          outputEntry2
        ],
        businessObject: rule1Bo
      };

      expect(descriptor).to.deep.eql({
        root: rule1,
        descriptorCache: {
          elements: {
            inputEntry1,
            inputEntry2,
            outputEntry1,
            outputEntry2,
            rule1: rule1
          },
          boCache: {
            inputEntry1: inputEntry1Bo,
            inputEntry2: inputEntry2Bo,
            outputEntry1: outputEntry1Bo,
            outputEntry2: outputEntry2Bo,
            rule1: rule1Bo
          }
        }
      });
    }));


    it('should create Row descriptor', inject(function(elementRegistry) {

      // given
      const col = elementRegistry.get('input1');

      // when
      const descriptor = createDescriptor(col);

      // then

      // business objects
      const inputEntry1Bo = {
        $type: 'dmn:UnaryTests',
        id: 'inputEntry1',
        text: '"bronze"'
      };

      const inputEntry3Bo = {
        $type: 'dmn:UnaryTests',
        id: 'inputEntry3',
        text: '"silver"'
      };

      const inputEntry5Bo = {
        $type: 'dmn:UnaryTests',
        id: 'inputEntry5',
        text: '"silver"'
      };

      const inputEntry7Bo = {
        $type: 'dmn:UnaryTests',
        id: 'inputEntry7',
        text: '"gold"'
      };

      const inputExpression1Bo = {
        $type: 'dmn:LiteralExpression',
        id: 'inputExpression1',
        typeRef: 'string',
        text: 'status'
      };

      const inputValuesBo = {
        $type: 'dmn:UnaryTests',
        id: 'inputValues1',
        text: '"bronze","silver","gold"'
      };

      const input1Bo = {
        $type: 'dmn:InputClause',
        id: 'input1',
        label: 'Customer Status',
        inputExpression: inputExpression1Bo,
        inputValues: inputValuesBo
      };

      // table elements
      const inputEntry1 = {
        id: 'inputEntry1',
        type: 'cell',
        businessObject: inputEntry1Bo
      };

      const inputEntry3 = {
        id: 'inputEntry3',
        type: 'cell',
        businessObject: inputEntry3Bo
      };

      const inputEntry5 = {
        id: 'inputEntry5',
        type: 'cell',
        businessObject: inputEntry5Bo
      };

      const inputEntry7 = {
        id: 'inputEntry7',
        type: 'cell',
        businessObject: inputEntry7Bo
      };

      const input1 = {
        id: 'input1',
        type: 'col',
        cells: [
          inputEntry1,
          inputEntry3,
          inputEntry5,
          inputEntry7
        ],
        businessObject: input1Bo
      };

      expect(descriptor).to.deep.eql({
        root: input1,
        descriptorCache: {
          elements: {
            inputEntry1,
            inputEntry3,
            inputEntry5,
            inputEntry7,
            input1
          },
          boCache: {
            inputEntry1: inputEntry1Bo,
            inputEntry3: inputEntry3Bo,
            inputEntry5: inputEntry5Bo,
            inputEntry7: inputEntry7Bo,
            input1: input1Bo,
            inputExpression1: inputExpression1Bo,
            inputValues1: inputValuesBo
          }
        }
      });

    }));

  });


  describe('#reviveDescriptor', function() {

    it('should revive Cell and keep ID', inject(
      function(dmnFactory, elementRegistry, moddle) {

        // given
        const cell = elementRegistry.get('inputEntry1');

        const descriptor = createDescriptor(cell);

        // when
        const revivedCell = reviveDescriptor(descriptor, {
          _dmnFactory: dmnFactory,
          _keepIds: true,
          _model: getModelMock()
        });

        // then
        expectTableElement(revivedCell.root, Cell, {
          id: 'inputEntry1',
          row: undefined,
          col: undefined
        });

        expectBusinessObject(revivedCell.root.businessObject, {
          $type: 'dmn:UnaryTests',
          $parent: undefined,
          id: 'inputEntry1',
          text: '"bronze"'
        });
      }
    ));


    it('should revive Cell and NOT keep ID', inject(
      function(dmnFactory, elementRegistry, moddle) {

        // given
        const cell = elementRegistry.get('inputEntry1');

        const descriptor = createDescriptor(cell);

        // when
        const revivedCell = reviveDescriptor(descriptor, {
          _dmnFactory: dmnFactory,
          _keepIds: true,
          _model: getModelMock([ 'inputEntry1' ])
        });

        // then
        const revivedCellId = revivedCell.root.id;

        expect(revivedCellId).to.not.equal('inputEntry1');
      }
    ));


    it('should revive Row and keep IDs', inject(
      function(dmnFactory, elementRegistry, moddle) {

        // given
        const row = elementRegistry.get('rule1');

        const descriptor = createDescriptor(row);

        // when
        const revivedRow = reviveDescriptor(descriptor, {
          _dmnFactory: dmnFactory,
          _keepIds: true,
          _model: getModelMock()
        });

        // then
        expectTableElement(revivedRow.root, Row, {
          id: 'rule1',
          root: undefined
        });

        const { cells } = revivedRow.root;

        expectTableElement(cells[0], Cell, {
          id: 'inputEntry1',
          row: revivedRow.root,
          col: undefined
        });

        expectTableElement(cells[1], Cell, {
          id: 'inputEntry2',
          row: revivedRow.root,
          col: undefined
        });

        expectTableElement(cells[2], Cell, {
          id: 'outputEntry1',
          row: revivedRow.root,
          col: undefined
        });

        expectTableElement(cells[3], Cell, {
          id: 'outputEntry2',
          row: revivedRow.root,
          col: undefined
        });

        expectBusinessObject(revivedRow.root.businessObject, {
          $type: 'dmn:DecisionRule',
          $parent: undefined,
          id: 'rule1'
        });

        expectBusinessObject(cells[0].businessObject, {
          $type: 'dmn:UnaryTests',
          $parent: revivedRow.root.businessObject,
          id: 'inputEntry1',
          text: '"bronze"'
        });

        expectBusinessObject(cells[1].businessObject, {
          $type: 'dmn:UnaryTests',
          $parent: revivedRow.root.businessObject,
          id: 'inputEntry2',
          text: ''
        });

        expectBusinessObject(cells[2].businessObject, {
          $type: 'dmn:LiteralExpression',
          $parent: revivedRow.root.businessObject,
          id: 'outputEntry1',
          text: '"notok"'
        });

        expectBusinessObject(cells[3].businessObject, {
          $type: 'dmn:LiteralExpression',
          $parent: revivedRow.root.businessObject,
          id: 'outputEntry2',
          text: '"work on your status first, as bronze you\'re not going to get anything"'
        });
      }
    ));


    it('should revive Row and NOT keep IDs', inject(
      function(dmnFactory, elementRegistry, moddle) {

        // given
        const row = elementRegistry.get('rule1');

        const descriptor = createDescriptor(row);

        // when
        const revivedRow = reviveDescriptor(descriptor, {
          _dmnFactory: dmnFactory,
          _keepIds: true,
          _model: getModelMock([
            'rule1',
            'inputEntry1',
            'inputEntry2',
            'outputEntry1',
            'outputEntry2'
          ])
        });

        // then
        const revivedRowId = revivedRow.root.id;

        expect(revivedRowId).to.not.equal('rule1');

        const { cells } = revivedRow.root;

        const revivedCell1Id = cells[0].id,
              revivedCell2Id = cells[1].id,
              revivedCell3Id = cells[2].id,
              revivedCell4Id = cells[3].id;

        expect(revivedCell1Id).to.not.equal('inputEntry1');
        expect(revivedCell2Id).to.not.equal('inputEntry2');
        expect(revivedCell3Id).to.not.equal('outputEntry1');
        expect(revivedCell4Id).to.not.equal('outputEntry2');
      }
    ));


    it('should revive Col and keep IDs', inject(
      function(dmnFactory, elementRegistry, moddle) {

        // given
        const col = elementRegistry.get('input1');

        const descriptor = createDescriptor(col);

        // when
        const revivedCol = reviveDescriptor(descriptor, {
          _dmnFactory: dmnFactory,
          _keepIds: true,
          _model: getModelMock()
        });

        // then
        expectTableElement(revivedCol.root, Col, {
          id: 'input1',
          root: undefined
        });

        const { cells } = revivedCol.root;

        expectTableElement(cells[0], Cell, {
          id: 'inputEntry1',
          row: undefined,
          col: revivedCol.root
        });

        expectTableElement(cells[1], Cell, {
          id: 'inputEntry3',
          row: undefined,
          col: revivedCol.root
        });

        expectTableElement(cells[2], Cell, {
          id: 'inputEntry5',
          row: undefined,
          col: revivedCol.root
        });

        expectTableElement(cells[3], Cell, {
          id: 'inputEntry7',
          row: undefined,
          col: revivedCol.root
        });

        expectBusinessObject(revivedCol.root.businessObject, {
          $type: 'dmn:InputClause',
          $parent: undefined,
          id: 'input1'
        });

        expectBusinessObject(revivedCol.root.businessObject.inputExpression, {
          $type: 'dmn:LiteralExpression',
          $parent: revivedCol.root.businessObject,
          id: 'inputExpression1',
          text: 'status',
          typeRef: 'string'
        });

        expectBusinessObject(revivedCol.root.businessObject.inputValues, {
          $type: 'dmn:UnaryTests',
          $parent: revivedCol.root.businessObject,
          id: 'inputValues1',
          text: '"bronze","silver","gold"'
        });

        expectBusinessObject(cells[0].businessObject, {
          $type: 'dmn:UnaryTests',
          $parent: undefined,
          id: 'inputEntry1',
          text: '"bronze"'
        });

        expectBusinessObject(cells[1].businessObject, {
          $type: 'dmn:UnaryTests',
          $parent: undefined,
          id: 'inputEntry3',
          text: '"silver"'
        });

        expectBusinessObject(cells[2].businessObject, {
          $type: 'dmn:UnaryTests',
          $parent: undefined,
          id: 'inputEntry5',
          text: '"silver"'
        });

        expectBusinessObject(cells[3].businessObject, {
          $type: 'dmn:UnaryTests',
          $parent: undefined,
          id: 'inputEntry7',
          text: '"gold"'
        });
      }
    ));


    it('should revive Col and NOT keep IDs', inject(
      function(dmnFactory, elementRegistry, moddle) {

        // given
        const col = elementRegistry.get('input1');

        const descriptor = createDescriptor(col);

        // when
        const revivedCol = reviveDescriptor(descriptor, {
          _dmnFactory: dmnFactory,
          _keepIds: true,
          _model: getModelMock([
            'input1',
            'inputExpression1',
            'inputValues1',
            'inputEntry1',
            'inputEntry3',
            'inputEntry5',
            'inputEntry7'
          ])
        });

        // then
        const revivedColId = revivedCol.root.id,
              revivedColInputExpressionId =
                revivedCol.root.businessObject.inputExpression.id,
              revivedColInputValuesId =
                revivedCol.root.businessObject.inputValues.id;

        expect(revivedColId).to.not.equal('input1');
        expect(revivedColInputExpressionId).to.not.equal('inputExpression1');
        expect(revivedColInputValuesId).to.not.equal('inputValues1');

        const { cells } = revivedCol.root;

        const revivedCell1Id = cells[0].id,
              revivedCell2Id = cells[1].id,
              revivedCell3Id = cells[2].id,
              revivedCell4Id = cells[3].id;

        expect(revivedCell1Id).to.not.equal('inputEntry1');
        expect(revivedCell2Id).to.not.equal('inputEntry3');
        expect(revivedCell3Id).to.not.equal('inputEntry5');
        expect(revivedCell4Id).to.not.equal('inputEntry7');
      }
    ));

  });

});

// helpers //////////

/**
 * Returns a mock for model.
 *
 * @param {Array} idsAssigned - Array of IDs that have been assigned.
 */
function getModelMock(idsAssigned = []) {
  return {
    ids: {
      assigned(id) {
        return idsAssigned.indexOf(id) !== -1;
      }
    }
  };
}

function expectTableElement(element, Constructor, properties) {
  expect(element).to.be.an.instanceof(Constructor);

  keys(properties).forEach(key => {
    expect(element[key]).to.equal(properties[key]);
  });
}

function expectBusinessObject(businessObject, properties) {
  keys(properties).forEach(key => {
    expect(businessObject[key]).to.equal(properties[key]);
  });
}