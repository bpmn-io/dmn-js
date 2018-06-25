import { parseString } from 'src/features/simple-boolean-edit/Utils';

function expectParsed(string, result) {
  return function() {
    return expect(parseString(string)).to.eql(result);
  };
}

describe('simple boolean edit - utils', function() {

  describe('parseString', function() {

    it('true', expectParsed('true', 'true'));


    it(' true ', expectParsed(' true ', 'true'));


    it('false', expectParsed('false', 'false'));


    it(' false ', expectParsed(' false ', 'false'));


    it('invalid string', expectParsed('foo', undefined));

  });

});