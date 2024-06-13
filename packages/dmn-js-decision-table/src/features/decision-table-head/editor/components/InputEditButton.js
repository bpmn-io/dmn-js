import { Component } from 'inferno';

export class InputEditButton extends Component {

  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');
    this._eventBus = context.injector.get('eventBus');
  }

  onClick = (event) => {
    const { col: input } = this.props;

    this._eventBus.fire('input.edit', {
      event,
      input
    });
  };

  render() {
    return <button
      aria-label={ this._translate('Edit input') }
      type="button"
      className="edit-button dmn-icon-edit"
      onClick={ this.onClick }
    />;
  }
}
