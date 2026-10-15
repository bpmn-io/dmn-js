import { Component } from 'inferno';

export class OutputEditButton extends Component {

  constructor(props, context) {
    super(props, context);

    this._translate = context.injector.get('translate');
    this._eventBus = context.injector.get('eventBus');
  }

  onClick = (event) => {
    const { col: output } = this.props;

    this._eventBus.fire('output.edit', {
      event,
      output
    });
  };

  render() {
    return <button
      aria-label={ this._translate('Edit output') }
      type="button"
      className="edit-button dmn-icon-edit"
      onClick={ this.onClick }
    />;
  }
}
