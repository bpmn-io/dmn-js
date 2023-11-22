import {
  validateISOString,
  getDateString,
  parseString
} from 'src/features/simple-date-time-edit/Utils';


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

    it('should be ISO date string (UTC)', function() {

      // then
      expect(validateISOString('2000-01-01T12:00:00Z')).to.not.exist;
    });


    it('should be ISO date string (positive offset)', function() {

      // then
      expect(validateISOString('2000-01-01T12:00:00+01:00')).to.not.exist;
    });


    it('should be ISO date string (negative offset)', function() {

      // then
      expect(validateISOString('2000-01-01T12:00:00-05:30')).to.not.exist;
    });


    it('should be ISO date string (location time zone)', function() {

      // then
      expect(validateISOString('2000-01-01T12:00:00@Europe/Berlin')).to.not.exist;
    });


    it('should be ISO date string (local time)', function() {

      // then
      expect(validateISOString('2000-01-01T12:00:00')).to.not.exist;
    });


    it('should not be ISO date string', function() {

      // then
      expect(validateISOString('foo'))
        .to.equal('Date and time must match pattern yyyy-MM-ddTHH:mm:ss[time zone]');
    });


    it('empty string should not be ISO date string', function() {

      // then
      expect(validateISOString(''))
        .to.equal('Date and time must match pattern yyyy-MM-ddTHH:mm:ss[time zone]');
    });

  });


  describe('getDateString', function() {

    it('exact date', expectDateString(
      'exact',
      [ '2000-01-01T12:00:00Z', '' ],
      'date and time("2000-01-01T12:00:00Z")'
    ));


    it('before date', expectDateString(
      'before',
      [ '2000-01-01T12:00:00Z', '' ],
      '< date and time("2000-01-01T12:00:00Z")'
    ));


    it('after date', expectDateString(
      'after',
      [ '2000-01-01T12:00:00Z', '' ],
      '> date and time("2000-01-01T12:00:00Z")'
    ));


    it('between dates', expectDateString(
      'between',
      [ '2000-01-01T12:00:00Z', '2001-01-01T12:00:00Z' ],
      '[date and time("2000-01-01T12:00:00Z")..date and time("2001-01-01T12:00:00Z")]'
    ));

  });


  describe('parseString', function() {

    it('exact', expectParsed('date and time("2000-01-01T12:00:00Z")', {
      type: 'exact',
      date: '2000-01-01T12:00:00Z'
    }));


    it('before', expectParsed('<date and time("2000-01-01T12:00:00Z")', {
      type: 'before',
      date: '2000-01-01T12:00:00Z'
    }));


    it('after', expectParsed('>date and time("2000-01-01T12:00:00Z")', {
      type: 'after',
      date: '2000-01-01T12:00:00Z'
    }));

    // eslint-disable-next-line
    it('between', expectParsed('[date and time("2000-01-01T12:00:00Z")..date and time("2000-01-02T12:00:00Z")]', {
      type: 'between',
      dates: [ '2000-01-01T12:00:00Z', '2000-01-02T12:00:00Z' ]
    }));


    it('invalid string', expectParsed('foo', undefined));

  });

});