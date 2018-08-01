import { Component } from 'inferno';


export default class DecisionPropertiesComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this._viewer = context.injector.get('viewer');
  }

  render() {

    // there is only one single element
    const { name, id } = this._viewer.getDecision();

    return (
      <div className="decision-properties">
        <h3 className="decision-name">{ name }</h3>
        <h5 className="decision-id">{ id }</h5>
      </div>
    );
  }
}