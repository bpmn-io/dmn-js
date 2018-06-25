import {
  getInputOrOutputValues,
  parseString
} from 'src/features/simple-string-edit/Utils';

function expectParsed(string, result) {
  return function() {
    return expect(parseString(string)).to.eql(result);
  };
}

describe('simple string edit - utils', function() {

  describe('parseString', function() {

    it('"foo"', expectParsed('"foo"', {
      type: 'disjunction',
      values: [ '"foo"' ]
    }));


    it('"foo", "bar"', expectParsed('"foo", "bar"', {
      type: 'disjunction',
      values: [ '"foo"', '"bar"' ]
    }));


    it('not("foo")', expectParsed('not("foo")', {
      type: 'negation',
      values: [ '"foo"' ]
    }));


    it('not("foo", "bar")', expectParsed('not("foo", "bar")', {
      type: 'negation',
      values: [ '"foo"', '"bar"' ]
    }));


    it('empty string', expectParsed('', {
      type: 'disjunction',
      values: []
    }));


    it('invalid string', expectParsed('"foo', undefined));

  });


  // TODO(philippfromme): refactor method when refactoring simple string edit component
  describe('getInputOrOutputValues', function() {

    it('should return empty array if no values', function() {

      // given
      const businessObject = {};

      // then
      expect(getInputOrOutputValues(businessObject)).to.eql([]);
    });

  });

});