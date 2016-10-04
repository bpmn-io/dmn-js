'use strict';

var utils = require('../../../../../lib/table/features/string-edit/utils');

describe('features/string-edit/utils', function() {

  describe('parseString', function() {

    describe('empty', function() {

      it('should recognize an empty string', function() {
        var result = utils.parseString('');

        expect(result).to.eql({ type: 'disjunction', values: [] });
      });


      it('should recognize a string only containing whitespace', function() {
        var result = utils.parseString('  ');

        expect(result).to.eql({ type: 'disjunction', values: [] });
      });

    });

    describe('disjunction', function() {
      it('should recognize a simple string as disjunction', function() {
        var result = utils.parseString('"foo"');

        expect(result).to.eql({ type: 'disjunction', values: ['foo'] });
      });


      it('should not recognize a simple string without quotation marks as disjunction', function() {
        var result = utils.parseString('foo');

        expect(result).to.be.undefined;
      });


      it('should not recognize an expression even if it starts and ends with quotes', function() {
        var result = utils.parseString('"foo" + exp + "bar"');

        expect(result).to.be.undefined;
      });


      it('should recognize a simple string with a comma', function() {
        var result = utils.parseString('"foo, bar"');

        expect(result).to.eql({ type: 'disjunction', values: ['foo, bar'] });
      });


      it('should recognize list with nested commas', function() {
        var result = utils.parseString('"foo, bar", "asdf, ghjk"');

        expect(result).to.eql({ type: 'disjunction', values: ['foo, bar', 'asdf, ghjk'] });
      });


      it('should not recognize list with nested commas and expressions', function() {
        var result = utils.parseString('"foo, bar", k + "asdf, ghjk"');

        expect(result).to.be.undefined;
      });


      it('should recognize list of strings as disjunction', function() {
        var result = utils.parseString('"foo", "bar", "baz"');

        expect(result).to.eql({ type: 'disjunction', values: ['foo', 'bar', 'baz'] });
      });


      it('should not recognize a list of strings that contain an expression as disjunction', function() {
        var result = utils.parseString('"foo", "bar", baz');

        expect(result).to.be.undefined;
      });


      it('should ignore leading and trailing whitespace', function() {
        var result = utils.parseString('  "foo", "bar", "baz"  ');

        expect(result).to.eql({ type: 'disjunction', values: ['foo', 'bar', 'baz'] });
      });

    });

    describe('negation', function() {
      it('should recognize a simple negation', function() {
        var result = utils.parseString('not("foo")');

        expect(result).to.eql({ type: 'negation', values: ['foo'] });
      });


      it('should not recognize a negation of an expression', function() {
        var result = utils.parseString('not(foo)');

        expect(result).to.be.undefined;
      });


      it('should recognize a simple string with a comma', function() {
        var result = utils.parseString('not("foo, bar")');

        expect(result).to.eql({ type: 'negation', values: ['foo, bar'] });
      });


      it('should recognize a negation of a string list', function() {
        var result = utils.parseString('not("foo", "bar", "baz")');

        expect(result).to.eql({ type: 'negation', values: ['foo', 'bar', 'baz'] });
      });


      it('should not recognize a negation of a list containing an expression', function() {
        var result = utils.parseString('not("foo", "bar", baz)');

        expect(result).to.be.undefined;
      });


      it('should ignore leading and trailing whitespace', function() {
        var result = utils.parseString('  not("foo", "bar", "baz")   ');

        expect(result).to.eql({ type: 'negation', values: ['foo', 'bar', 'baz'] });
      });

    });

  });

});
