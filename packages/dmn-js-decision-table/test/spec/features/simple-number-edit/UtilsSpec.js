import { parseString } from 'src/features/simple-number-edit/Utils';

function expectParsed(string, result) {
  return function() {
    return expect(parseString(string)).to.eql(result);
  };
}

describe('simple number edit - utils', function() {

  describe('parseString', function() {

    it('10', expectParsed('10', {
      type: 'comparison',
      value: 10,
      operator: 'equals'
    }));


    it('10.1', expectParsed('10.1', {
      type: 'comparison',
      value: 10.1,
      operator: 'equals'
    }));


    it('= 10', expectParsed('= 10', {
      type: 'comparison',
      value: 10,
      operator: 'equals'
    }));


    it('< 10', expectParsed('< 10', {
      type: 'comparison',
      value: 10,
      operator: 'less'
    }));


    it('<= 10', expectParsed('<= 10', {
      type: 'comparison',
      value: 10,
      operator: 'lessEquals'
    }));


    it('> 10', expectParsed('> 10', {
      type: 'comparison',
      value: 10,
      operator: 'greater'
    }));


    it('>= 10', expectParsed('>= 10', {
      type: 'comparison',
      value: 10,
      operator: 'greaterEquals'
    }));


    it('[10..20]', expectParsed('[10..20]', {
      type: 'range',
      values: [ 10, 20 ],
      start: 'include',
      end: 'include'
    }));


    it('[10.1..20.1]', expectParsed('[10.1..20.1]', {
      type: 'range',
      values: [ 10.1, 20.1 ],
      start: 'include',
      end: 'include'
    }));


    it(']10..20]', expectParsed(']10..20]', {
      type: 'range',
      values: [ 10, 20 ],
      start: 'exclude',
      end: 'include'
    }));


    it(']10.1..20.1]', expectParsed(']10.1..20.1]', {
      type: 'range',
      values: [ 10.1, 20.1 ],
      start: 'exclude',
      end: 'include'
    }));


    it('[10..20[', expectParsed('[10..20[', {
      type: 'range',
      values: [ 10, 20 ],
      start: 'include',
      end: 'exclude'
    }));


    it('[10.1..20.1[', expectParsed('[10.1..20.1[', {
      type: 'range',
      values: [ 10.1, 20.1 ],
      start: 'include',
      end: 'exclude'
    }));


    it(']10..20[', expectParsed(']10..20[', {
      type: 'range',
      values: [ 10, 20 ],
      start: 'exclude',
      end: 'exclude'
    }));


    it(']10.1..20.1[', expectParsed(']10.1..20.1[', {
      type: 'range',
      values: [ 10.1, 20.1 ],
      start: 'exclude',
      end: 'exclude'
    }));


    it('[0...1]', expectParsed('[0...1]', {
      type: 'range',
      values: [ 0, 0.1 ],
      start: 'include',
      end: 'include'
    }));


    it('invalid string', expectParsed('foo', undefined));

  });

});