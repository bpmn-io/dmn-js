import { parseString } from 'lib/features/input-output-values/Utils';

function expectParsed(string, result) {
  return function() {
    return expect(parseString(string)).to.eql(result);
  };
}

describe('input output values - utils', function() {

  describe('parseString', function() {

    it('"foo", "bar"', expectParsed('"foo", "bar"', {
      values: [
        '"foo"',
        '"bar"'
      ]
    }));


    it('invalid string', expectParsed('foo', undefined));

  });

});