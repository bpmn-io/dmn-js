import { Component } from 'inferno';

import Logo from 'dmn-js-shared/lib/components/Logo';

export default class PoweredByLogoComponent extends Component {

  constructor(props, context) {
    super(props, context);

    const { injector } = context;

    this._eventBus = injector.get('eventBus');
  }

  onClick = () => {
    this._eventBus.fire('poweredBy.show');
  }

  render() {
    return (
      <div className='powered-by'>
        <div
          className='powered-by__logo'
          title='Powered by bpmn.io'
          onClick={ this.onClick }
          ref={ node => this.node = node }
        >
          <Logo />
        </div>
      </div>
    );
  }

}