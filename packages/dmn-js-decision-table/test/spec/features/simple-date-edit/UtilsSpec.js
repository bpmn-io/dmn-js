import {
  validateISOString,
  getDateString,
  parseString
} from 'lib/features/simple-date-edit/Utils';


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
      expect(validateISOString('2000-01-01T12:00:00')).to.not.exist;
    });


    it('should not be ISO date string', function() {

      // then
      expect(validateISOString('foo'))
        .to.equal('Dates must match pattern yyyy-MM-ddTHH:mm:ss.');
    });

    it('empty string should not be ISO date string', function() {

      // then
      expect(validateISOString(''))
        .to.equal('Dates must match pattern yyyy-MM-ddTHH:mm:ss.');
    });

  });


  describe('getDateString', function() {

    it('exact date', expectDateString(
      'exact',
      [ '2000-01-01T12:00:00', '' ],
      'date and time("2000-01-01T12:00:00")'
    ));


    it('before date', expectDateString(
      'before',
      [ '2000-01-01T12:00:00', '' ],
      '< date and time("2000-01-01T12:00:00")'
    ));


    it('after date', expectDateString(
      'after',
      [ '2000-01-01T12:00:00', '' ],
      '> date and time("2000-01-01T12:00:00")'
    ));


    it('between dates', expectDateString(
      'between',
      [ '2000-01-01T12:00:00', '2001-01-01T12:00:00' ],
      '[date and time("2000-01-01T12:00:00")..date and time("2001-01-01T12:00:00")]'
    ));

  });


  describe('parseString', function() {

    it('exact', expectParsed('date and time("2000-01-01T12:00:00")', {
      type: 'exact',
      date: '2000-01-01T12:00:00'
    }));


    it('before', expectParsed('<date and time("2000-01-01T12:00:00")', {
      type: 'before',
      date: '2000-01-01T12:00:00'
    }));


    it('after', expectParsed('>date and time("2000-01-01T12:00:00")', {
      type: 'after',
      date: '2000-01-01T12:00:00'
    }));

    // eslint-disable-next-line
    it('between', expectParsed('[date and time("2000-01-01T12:00:00")..date and time("2000-01-02T12:00:00")]', {
      type: 'between',
      dates: [ '2000-01-01T12:00:00', '2000-01-02T12:00:00' ]
    }));


    it('invalid string', expectParsed('foo', undefined));

  });

});