'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */

var templatesModule = require('../../../../lib/features/templates'),
    coreModule = require('../../../../lib/core');


describe('features/templates - parseTemplate', function() {

  var diagramXML = require('../../../fixtures/dmn/connections.dmn');

  var testModules = [ coreModule, templatesModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  it('should translate strings', inject(function(parseTemplate) {

    // given
    var templateStr = [
      '{{ \'YOU\' | translate }}',
      '{{ \'FOO\' | blub }}',
      '{{ \'YES\'|a}}'
    ].join(' ');

    // when
    var parsedStr = parseTemplate(templateStr);

    // then
    expect(parsedStr).to.eql([
      'YOU',
      'FOO',
      'YES'
    ].join(' '));
  }));

});
