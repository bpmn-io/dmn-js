import {
  validateISOString,
  getTimeString,
  parseString
} from 'src/features/simple-time-edit/Utils';


function expectTimeString(type, times, result) {
  return function() {
    return expect(getTimeString(type, times)).to.eql(result);
  };
}

function expectParsed(string, result) {
  return function() {
    return expect(parseString(string)).to.eql(result);
  };
}

describe('simple time edit - utils', function() {

  describe('validateISOString', function() {

    it('should be ISO time string', function() {

      // then
      expect(validateISOString('08:00:00Z')).to.not.exist;
    });


    it('should not be ISO time string', function() {

      // then
      expect(validateISOString('foo'))
        .to.equal('Time must match pattern hh:mm:ssZ.');
    });

    it('empty string should not be ISO time string', function() {

      // then
      expect(validateISOString(''))
        .to.equal('Time must match pattern hh:mm:ssZ.');
    });

  });


  describe('getTimeString', function() {

    it('exact time', expectTimeString(
      'exact',
      [ '08:00:00Z', '' ],
      'time("08:00:00Z")'
    ));


    it('before time', expectTimeString(
      'before',
      [ '08:00:00Z', '' ],
      '< time("08:00:00Z")'
    ));


    it('after time', expectTimeString(
      'after',
      [ '08:00:00Z', '' ],
      '> time("08:00:00Z")'
    ));


    it('between times', expectTimeString(
      'between',
      [ '08:00:00Z', '08:00:00Z' ],
      '[time("08:00:00Z")..time("08:00:00Z")]'
    ));

  });


  describe('parseString', function() {

    it('exact', expectParsed('time("08:00:00Z")', {
      type: 'exact',
      time: '08:00:00Z'
    }));


    it('before', expectParsed('<time("08:00:00Z")', {
      type: 'before',
      time: '08:00:00Z'
    }));


    it('after', expectParsed('>time("08:00:00Z")', {
      type: 'after',
      time: '08:00:00Z'
    }));

    // eslint-disable-next-line
    it('between', expectParsed('[time("08:00:00Z")..time("08:00:00Z")]', {
      type: 'between',
      times: [ '08:00:00Z', '08:00:00Z' ]
    }));


    it('invalid string', expectParsed('foo', undefined));

  });

});