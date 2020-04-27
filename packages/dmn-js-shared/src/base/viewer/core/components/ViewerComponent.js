import React, { PureComponent } from 'react';


export default class ViewerComponent extends PureComponent {

  constructor(props) {
    super(props);

    const injector = this._injector = props.injector;

    this._changeSupport = injector.get('changeSupport');
    this._components = injector.get('components');
    this._renderer = injector.get('renderer');
  }

  // child components will have access to these things
  getChildContext() {
    return {
      changeSupport: this._changeSupport,
      components: this._components,
      renderer: this._renderer,
      injector: this._injector
    };
  }

  render() {
    const components = this._components.getComponents('viewer');

    return (
      <div className="viewer-container">
        {
          components &&
            components.map((Component, index) => <Component key={ index } />)
        }
      </div>
    );
  }
}