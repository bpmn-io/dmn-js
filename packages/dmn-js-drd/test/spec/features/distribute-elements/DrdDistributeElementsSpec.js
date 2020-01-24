import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import modelingModule from 'src/features/modeling';
import distributeElementsModule from 'src/features/distribute-elements';
import coreModule from 'src/core';


describe('features/distribute-elements', function() {

  var testModules = [
    coreModule,
    distributeElementsModule,
    modelingModule
  ];

  var diagramXML = require('./DrdDistributeElements.dmn');


  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

  var elements;

  beforeEach(inject(function(elementRegistry, canvas) {
    elements = elementRegistry.filter(function(element) {
      return element.parent;
    });
  }));


  it('should align horizontally', inject(function(distributeElements) {

    // when
    var rangeGroups = distributeElements.trigger(elements, 'horizontal'),
        margin = rangeGroups[1].range.min - rangeGroups[0].range.max;

    // then
    expect(rangeGroups).to.have.length(3);

    expect(margin).to.equal(-17.5);

    expect(rangeGroups[0].range).to.eql({ min: -22.5, max: 157.5 });

    expect(last(rangeGroups).range).to.eql({ min: 477.5, max: 612.5 });

  }));


  it('should align vertically', inject(function(distributeElements) {

    // when
    var rangeGroups = distributeElements.trigger(elements, 'vertical'),
        margin = rangeGroups[1].range.min - rangeGroups[0].range.max;

    // then
    expect(rangeGroups).to.have.length(3);

    expect(margin).to.equal(56.5);

    expect(rangeGroups[0].range).to.eql({ min: -4.5, max: 75.5 });

    expect(last(rangeGroups).range).to.eql({ min: 269.5, max: 315.5 });

  }));

});


// helpers ////////////////

function last(arr) {
  return arr[arr.length - 1];
}
