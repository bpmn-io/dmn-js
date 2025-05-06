/**
 * @typedef {object} FeelLanguageContextConfig
 * @property {string} [parserDialect] - The parser dialect for FEEL, e.g. `camunda`
 * @property {import('@bpmn-io/feel-editor').Variable[]} [builtins] - The built-in functions for FEEL
 */

export default class FeelLanguageContext {

  /**
   * Provide parser dialect and built-in functions for FEEL editor.
   *
   * @param {FeelLanguageContextConfig} feelLanguageContext
   */
  constructor(feelLanguageContext) {
    this._feelLanguageContext = feelLanguageContext;
  }

  getConfig()
  {
    return this._feelLanguageContext;
  }
}

FeelLanguageContext.$inject = [ 'config.feelLanguageContext' ];
