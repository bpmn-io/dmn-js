import { Component } from 'inferno';

import { getBoxedExpression } from 'dmn-js-shared/lib/util/ModelUtil';


export default class TextareaComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this._viewer = context.injector.get('viewer');
  }

  render() {
    const { text } = getBoxedExpression(this._viewer.getDecision());

    return (
      <div className="textarea">
        <div className="content">{ text }</div>
      </div>
    );
  }
}