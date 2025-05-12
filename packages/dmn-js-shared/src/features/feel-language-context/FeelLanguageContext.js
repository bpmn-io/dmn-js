export default class FeelLanguageContext {
  constructor(feelLanguageContext) {
    this._feelLanguageContext = feelLanguageContext;
  }

  getConfig()
  {
    return this._feelLanguageContext;
  }
}

FeelLanguageContext.$inject = [ 'config.feelLanguageContext' ];