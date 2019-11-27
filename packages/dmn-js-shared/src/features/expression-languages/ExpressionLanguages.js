import { assign } from 'min-dash';


const EXPRESSION_LANGUAGE_OPTIONS = [{
  label: 'FEEL',
  value: 'feel'
}, {
  label: 'JUEL',
  value: 'juel'
}, {
  label: 'JavaScript',
  value: 'javascript'
}, {
  label: 'Groovy',
  value: 'groovy'
}, {
  label: 'Python',
  value: 'python'
}, {
  label: 'JRuby',
  value: 'jruby'
}];

/**
 * @typedef ExpressionLanguageDescriptor
 * @property {string} value - value inserted into XML
 * @property {string} label - human-readable label
 */

/**
 * Provide options and defaults of expression languages via config.
 *
 * @example
 *
 * // there will be two languages available with FEEL as default
 * const editor = new DmnJS({
 *   expressionLanguages: {
 *     options: [{
 *       value: 'feel',
 *       label: 'FEEL'
 *     }, {
 *       value: 'juel',
 *       label: 'JUEL'
 *     }],
 *     defaults: {
 *       editor: 'feel'
 *     }
 *   }
 * })
 */
export default class ExpressionLanguages {
  constructor(injector) {
    this._injector = injector;

    const config = injector.get('config.expressionLanguages') || {};

    this._config = {
      options: EXPRESSION_LANGUAGE_OPTIONS,
      defaults: {
        editor: 'juel',
        inputCell: 'feel'
      }
    };

    // first assign the list of languages as it might be required for the legacy defaults
    if (config.options) {
      this._config.options = config.options;
    }

    const legacyDefaults = this._getLegacyDefaults();

    assign(this._config.defaults, legacyDefaults, config.defaults);
  }

  /**
   * Get default expression language for a component or the editor if `componentName`
   * is not provided.
   *
   * @param {string} [componentName]
   * @returns {ExpressionLanguageDescriptor}
   */
  getDefault(componentName) {
    const { defaults } = this._config;
    const defaultFromConfig = defaults[componentName] || defaults.editor;

    return this._getLanguageByValue(defaultFromConfig) || this.getAll()[0];
  }

  /**
   * Get label for provided expression language.
   *
   * @param {string} expressionLanguageValue - value from XML
   * @returns {string}
   */
  getLabel(expressionLanguageValue) {
    const langauge = this._getLanguageByValue(expressionLanguageValue);

    return langauge ? langauge.label : expressionLanguageValue;
  }

  /**
   * Get list of configured expression languages.
   *
   * @returns {ExpressionLanguageDescriptor[]}
   */
  getAll() {
    return this._config.options;
  }

  _getLegacyDefaults() {
    const defaults = {},
          injector = this._injector;

    const inputCellValue = injector.get('config.defaultInputExpressionLanguage');
    const outputCellValue = injector.get('config.defaultOutputExpressionLanguage');

    if (inputCellValue) {
      defaults.inputCell = inputCellValue;
    }

    if (outputCellValue) {
      defaults.outputCell = outputCellValue;
    }

    return defaults;
  }

  _getLanguageByValue(value) {
    return this.getAll().find(language => value === language.value);
  }
}

ExpressionLanguages.$inject = [ 'injector' ];
