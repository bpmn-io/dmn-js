import { Component } from 'inferno';

/**
 *
 *
 * @param {*} WrappedComponent
 * @param {() => []} selectDependencies
 * @returns
 */
export function withChangeSupport(WrappedComponent, selectDependencies) {
  return function(props) {
    return <Wrapper
      { ...props }
      _component={ WrappedComponent }
      _selectDependencies={ selectDependencies }
    />;
  };
}

class Wrapper extends Component {
  constructor(props, context) {
    super(props, context);

    this._eventBus = context.injector.get('eventBus');
  }

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe() {
    this._eventBus.on('elements.changed', this.onChange);
  }

  _unsubscribe() {
    this._eventBus.off('elements.changed', this.onChange);
  }

  onChange = ({ elements }) => {
    const dependencies = this.props._selectDependencies(this.props);

    if (dependencies.some(dep => elements.includes(dep))) {
      this.forceUpdate();
    }
  };

  render() {
    const WrappedComponent = this.props._component;

    return <WrappedComponent { ...this.props } />;
  }
}