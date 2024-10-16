import {
  validateISOString,
  getDateString,
  parseString
} from 'src/features/simple-date-edit/Utils';


function expectDateString(type, dates, result) {
  return function() {
    return expect(getDateString(type, dates)).to.eql(result);
  };
}

function expectParsed(string, result) {
  return function() {
    return expect(parseString(string)).to.eql(result);
  };
}

describe('simple date edit - utils', function() {

  describe('validateISOString', function() {

    it('should be ISO date string', function() {

      // then
      expect(validateISOString('2000-01-01')).to.not.exist;
    });


    it('should not be ISO date string', function() {

      // then
      expect(validateISOString('foo'))
        .to.equal('Date must match pattern yyyy-MM-dd');
    });

    it('empty string should not be ISO date string', function() {

      // then
      expect(validateISOString(''))
        .to.equal('Date must match pattern yyyy-MM-dd');
    });

  });


  describe('getDateString', function() {

    it('exact date', expectDateString(
      'exact',
      [ '2000-01-01', '' ],
      'date("2000-01-01")'
    ));


    it('before date', expectDateString(
      'before',
      [ '2000-01-01', '' ],
      '< date("2000-01-01")'
    ));


    it('after date', expectDateString(
      'after',
      [ '2000-01-01', '' ],
      '> date("2000-01-01")'
    ));


    it('between dates', expectDateString(
      'between',
      [ '2000-01-01', '2001-01-01' ],
      '[date("2000-01-01")..date("2001-01-01")]'
    ));

  });


  describe('parseString', function() {

    it('exact', expectParsed('date("2000-01-01")', {
      type: 'exact',
      date: '2000-01-01'
    }));


    it('before', expectParsed('<date("2000-01-01")', {
      type: 'before',
      date: '2000-01-01'
    }));


    it('after', expectParsed('>date("2000-01-01")', {
      type: 'after',
      date: '2000-01-01'
    }));


    it('between', expectParsed('[date("2000-01-01")..date("2000-01-02")]', {
      type: 'between',
      dates: [ '2000-01-01', '2000-01-02' ]
    }));


    it('invalid string', expectParsed('foo', undefined));

  });

});