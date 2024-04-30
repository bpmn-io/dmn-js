import DmnModdle from 'dmn-moddle';

import { isFeel } from 'src/util/ModelUtil';

describe('ModelUtil', function() {

  describe('#isFeel', function() {

    it('should return true per default', async function() {

      // given
      const moddle = await getModdle(
        '<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" />'
      );

      // then
      expect(isFeel(moddle.rootElement)).to.be.true;
    });


    it('should return true if namespace is FEEL', async function() {

      // given
      const moddle = await getModdle(
        '<definitions ' +
        'expressionLanguage="https://www.omg.org/spec/DMN/20191111/FEEL/" ' +
        'xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" />'
      );

      // then
      expect(isFeel(moddle.rootElement)).to.be.true;
    });


    it('should return true if namespace value matches FEEL', async function() {

      // given
      const moddle = await getModdle(
        '<definitions ' +
        'expressionLanguage="fEeL" ' +
        'xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" />'
      );

      // then
      expect(isFeel(moddle.rootElement)).to.be.true;
    });


    it('should return true if EL is FEEL via function kind', async function() {

      // given
      const moddle = await getModdle(
        '<definitions expressionLanguage="java" ' +
          'xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/">' +
          '<businessKnowledgeModel id="bkm">' +
            '<encapsulatedLogic kind="FEEL">' +
              '<literalExpression id="literalExpression" />' +
            '</encapsulatedLogic>' +
          '</businessKnowledgeModel>' +
        '</definitions>'
      );
      const literalExpression = moddle.elementsById.literalExpression;

      // when
      const language = isFeel(literalExpression);

      // then
      expect(language).to.be.true;
    });


    it('should return true if EL is FEEL via function kind default', async function() {

      // given
      const moddle = await getModdle(
        '<definitions expressionLanguage="java" ' +
          'xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/">' +
          '<businessKnowledgeModel id="bkm">' +
            '<encapsulatedLogic>' +
              '<literalExpression id="literalExpression" />' +
            '</encapsulatedLogic>' +
          '</businessKnowledgeModel>' +
        '</definitions>'
      );
      const literalExpression = moddle.elementsById.literalExpression;

      // when
      const language = isFeel(literalExpression);

      // then
      expect(language).to.be.true;
    });


    it('should return false if expression language is different ', async function() {

      // given
      const moddle = await getModdle(
        `<definitions expressionLanguage="https://example.com/javascript"
        xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" />`
      );

      // when
      const language = isFeel(moddle.rootElement);

      // then
      expect(language).to.be.false;
    });


    it('should return false if EL is different via function kind', async function() {

      // given
      const moddle = await getModdle(
        '<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/">' +
          '<businessKnowledgeModel id="bkm">' +
            '<encapsulatedLogic kind="java">' +
              '<literalExpression id="literalExpression" />' +
            '</encapsulatedLogic>' +
          '</businessKnowledgeModel>' +
        '</definitions>'
      );
      const literalExpression = moddle.elementsById.literalExpression;

      // when
      const language = isFeel(literalExpression);

      // then
      expect(language).to.be.false;
    });
  });
});

function getModdle(xml) {
  const moddle = DmnModdle();
  return moddle.fromXML(xml);
}
