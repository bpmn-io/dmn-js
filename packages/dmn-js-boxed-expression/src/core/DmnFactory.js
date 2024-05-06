export class DmnFactory {
  static $inject = [ 'moddle' ];

  constructor(moddle) {
    this._moddle = moddle;
  }

  create(type, attrs = {}) {
    return this._moddle.create(type, attrs);
  }
}