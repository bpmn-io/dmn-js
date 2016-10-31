'use strict';

require('../../../TestHelper');

/* global bootstrapModeler, inject */

var is = require('../../../../../lib/util/ModelUtil').is,
    find = require('lodash/collection/find');

var modelingModule = require('../../../../../lib/features/modeling'),
    coreModule = require('../../../../../lib/core');


function getConnection(source, target, connectionOrType) {
  return find(source.outgoing, function(c) {
    return c.target === target &&
      (typeof connectionOrType === 'string' ? is(c, connectionOrType) : c === connectionOrType);
  });
}

function expectConnected(source, target, connectionOrType) {
  expect(getConnection(source, target, connectionOrType)).to.exist;
}

function expectNotConnected(source, target, connectionOrType) {
  expect(getConnection(source, target, connectionOrType)).not.to.exist;
}


describe('features/modeling - replace connection', function() {

  var testModules = [ coreModule, modelingModule ];

  var diagramXML = require('../../../../fixtures/dmn/reconnect.dmn');

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules
  }));

  var element;

  beforeEach(inject(function(elementRegistry) {
    element = function(id) {
      return elementRegistry.get(id);
    };
  }));

  it('should update target', inject(function(modeling) {

    // given
    var source = element('host_ks'),
        oldTarget = element('guestCount'),
        newTarget = element('decision2'),
        connection = getConnection(source, oldTarget, 'dmn:AuthorityRequirement'),

        newTargetBounds = newTarget.businessObject.extensionElements.values[0],

        newWaypoints = [ connection.waypoints[0], { x: newTargetBounds.x, y: newTargetBounds.y }];


    // when
    modeling.reconnectEnd(connection, newTarget, newWaypoints);

    // then
    expectNotConnected(source, oldTarget, 'dmn:AuthorityRequirement');
    expectConnected(source, newTarget, 'dmn:AuthorityRequirement');
  }));

  it('should update source', inject(function(modeling) {

    // given
    var oldSource = element('host_ks'),
        newSource = element('elMenu'),
        target = element('guestCount'),
        connection = getConnection(oldSource, target, 'dmn:AuthorityRequirement'),

        newSourceBounds = newSource.businessObject.extensionElements.values[0],

        newWaypoints = [ { x: newSourceBounds.x, y: newSourceBounds.y }, connection.waypoints[1]];


    // when
    modeling.reconnectStart(connection, newSource, newWaypoints);

    // then
    expectNotConnected(oldSource, target, 'dmn:AuthorityRequirement');
    expectConnected(newSource, target, 'dmn:KnowledgeRequirement');
  }));

  it('should replace Association with InformationRequirement', inject(function(modeling) {

    // given
    var source = element('dayType_id'),
        oldTarget = element('annotation_1'),
        newTarget = element('guestCount'),
        connection = element('Association_1'),

        newTargetBounds = newTarget.businessObject.extensionElements.values[0],

        newWaypoints = [ connection.waypoints[0], { x: newTargetBounds.x, y: newTargetBounds.y }];

    // when
    modeling.reconnectEnd(connection, newTarget, newWaypoints);

    // then
    expectNotConnected(source, oldTarget, 'dmn:Association');
    expectConnected(source, newTarget, 'dmn:InformationRequirement');
  }));

  it('should replace AuthorityRequirement with Association', inject(function(modeling) {

    // given
    var source = element('host_ks'),
        oldTarget = element('guestCount'),
        newTarget = element('annotation_1'),
        connection = getConnection(source, oldTarget, 'dmn:AuthorityRequirement'),

        newTargetBounds = newTarget.businessObject.extensionElements.values[0],

        newWaypoints = [ connection.waypoints[0], { x: newTargetBounds.x, y: newTargetBounds.y }];

    // when
    modeling.reconnectEnd(connection, newTarget, newWaypoints);

    // then
    expectNotConnected(source, oldTarget, 'dmn:AuthorityRequirement');
    expectConnected(source, newTarget, 'dmn:Association');
  }));

  it('should undo', inject(function(modeling, commandStack) {

    // given
    var source = element('host_ks'),
        oldTarget = element('guestCount'),
        newTarget = element('decision2'),
        connection = getConnection(source, oldTarget, 'dmn:AuthorityRequirement'),

        newTargetBounds = newTarget.businessObject.extensionElements.values[0],

        newWaypoints = [ connection.waypoints[0], { x: newTargetBounds.x, y: newTargetBounds.y }];

    modeling.reconnectEnd(connection, newTarget, newWaypoints);

    // when
    commandStack.undo();

    // then
    expectNotConnected(source, newTarget, 'dmn:AuthorityRequirement');
    expectConnected(source, oldTarget, 'dmn:AuthorityRequirement');
  }));

  it('should redo', inject(function(modeling, commandStack) {

    // given
    var source = element('host_ks'),
        oldTarget = element('guestCount'),
        newTarget = element('decision2'),
        connection = getConnection(source, oldTarget, 'dmn:AuthorityRequirement'),

        newTargetBounds = newTarget.businessObject.extensionElements.values[0],

        newWaypoints = [ connection.waypoints[0], { x: newTargetBounds.x, y: newTargetBounds.y }];

    modeling.reconnectEnd(connection, newTarget, newWaypoints);

    // when
    commandStack.undo();
    commandStack.redo();

    // then
    expectNotConnected(source, oldTarget, 'dmn:AuthorityRequirement');
    expectConnected(source, newTarget, 'dmn:AuthorityRequirement');
  }));

});
