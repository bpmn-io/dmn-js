// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

export default class TextareaComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this._viewer = context.injector.get('viewer');
  }

  render() {
    const { text } = this._viewer._decision.literalExpression;

    return  (
      <div className="textarea">
        { text }
      </div>
    );
  }
}