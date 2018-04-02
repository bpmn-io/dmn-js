import { Component } from 'inferno';


export default class DiContainer extends Component {

  getChildContext() {

    return {
      injector: this.props.injector
    };

  }

  render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }

}