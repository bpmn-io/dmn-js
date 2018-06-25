import {
  parseString
} from 'src/features/allowed-values/Utils';

function expectParsed(string, result) {
  return function() {
    return expect(parseString(string)).to.eql(result);
  };
}

describe('decision-table-head/editor/allowed-values - Utils', function() {

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