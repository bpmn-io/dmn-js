import {
  parseDuration,
  validateDuration
} from 'src/features/simple-duration-edit/Utils';

function expectParsed(string, result) {
  return function() {
    return expect(parseDuration(string)).to.eql(result);
  };
}

describe('simple duration edit - utils', function() {

  describe('parseString', function() {

    it('duration("P1D")', expectParsed('duration("P1D")', {
      type: 'comparison',
      values: [ 'P1D' ],
      operator: 'equals'
    }));


    it('= duration("P1D")', expectParsed('= duration("P1D")', {
      type: 'comparison',
      values: [ 'P1D' ],
      operator: 'equals'
    }));


    it('< duration("P1D")', expectParsed('< duration("P1D")', {
      type: 'comparison',
      values: [ 'P1D' ],
      operator: 'less'
    }));


    it('<= duration("P1D")', expectParsed('<= duration("P1D")', {
      type: 'comparison',
      values: [ 'P1D' ],
      operator: 'lessEquals'
    }));


    it('> duration("P1D")', expectParsed('> duration("P1D")', {
      type: 'comparison',
      values: [ 'P1D' ],
      operator: 'greater'
    }));


    it('>= duration("P1D")', expectParsed('>= duration("P1D")', {
      type: 'comparison',
      values: [ 'P1D' ],
      operator: 'greaterEquals'
    }));


    it('>= duration("nonsense")', expectParsed('>= duration("nonsense")', {
      type: 'comparison',
      values: [ 'nonsense' ],
      operator: 'greaterEquals'
    }));


    it('[duration("P1D")..duration("P2D")]', expectParsed(
      '[duration("P1D")..duration("P2D")]', {
        type: 'range',
        values: [ 'P1D', 'P2D' ],
        start: 'include',
        end: 'include'
      }));


    it(']duration("P1D")..duration("P2D")]', expectParsed(
      ']duration("P1D")..duration("P2D")]', {
        type: 'range',
        values: [ 'P1D', 'P2D' ],
        start: 'exclude',
        end: 'include'
      }));


    it('[duration("P1D")..duration("P2D")[', expectParsed(
      '[duration("P1D")..duration("P2D")[', {
        type: 'range',
        values: [ 'P1D', 'P2D' ],
        start: 'include',
        end: 'exclude'
      }));


    it(']duration("P1D")..duration("P2D")[', expectParsed(
      ']duration("P1D")..duration("P2D")[', {
        type: 'range',
        values: [ 'P1D', 'P2D' ],
        start: 'exclude',
        end: 'exclude'
      }));


    it('invalid string', expectParsed('foo', undefined));
  });


  describe('validateDuration', function() {

    it ('should validate dayTimeDuration', function() {

      // given
      const valid = [
        'P1D',
        'P1DT1H',
        'PT1H'
      ];
      const invalid = [
        'P1Y2M3D',
        'invalid'
      ];
      const validate = value => validateDuration('dayTimeDuration', value);

      // then
      for (const value of valid) {
        expect(validate(value)).to.be.true;
      }

      for (const value of invalid) {
        expect(validate(value)).to.be.false;
      }
    });


    it ('should validate yearMonthDuration', function() {

      // given
      const valid = [
        'P1Y',
        'P1Y2M',
        'P2M'
      ];
      const invalid = [
        'P1Y2M3D',
        'invalid'
      ];
      const validate = value => validateDuration('yearMonthDuration', value);

      // then
      for (const value of valid) {
        expect(validate(value)).to.be.true;
      }

      for (const value of invalid) {
        expect(validate(value)).to.be.false;
      }
    });
  });

});