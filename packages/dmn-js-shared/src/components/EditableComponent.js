import { Component } from 'inferno';

import ContentEditable from './ContentEditable';


/**
 * A base component for interactivity.
 *
 * @example
 *
 * class Foo extends EditableComponent {
 *
 *   render() {
 *     return (
 *       <div>{ this.getEditor() }</div>
 *     );
 *   }
 * }
 *
 * And in use:
 *
 * <Foo value={ blub }
 *      onChange={ (newValue) => { ... }
 *      onFocus={ () => { ... } }
 *      onBlur={ () => { ... } }
 *      validate={ (newValue) => { return 'some-error'; } }
 *      className="..." } />
 *
 * Special classes added:
 *
 * * focused
 * * invalid
 *
 */
export default class EditableComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      changing: false,
      focussed: false
    };


    const { injector } = context;

    const debounceInput = injector.get('debounceInput');

    this.inputChanged = debounceInput((value) => {
      const { onChange } = this.props;

      if (typeof onChange === 'function') {
        onChange(value);
      }

      // only unset changed if user input and
      // committed changed value equal. This prevents the
      // input jumping back to the saved, good value.
      const currentValue = this.state.changing;

      this.setState({
        changing: currentValue === value ? false : currentValue
      });
    });

    this.onInput = (value) => {

      var validate = this.props.validate || function() {};

      var invalid = validate(value);

      this.setState({
        changing: value,
        invalid: invalid
      });

      if (!invalid) {
        this.inputChanged(value);
      }
    };
  }

  onFocus = () => {
    this.setState({
      focussed: true
    });

    var { onFocus } = this.props;

    if (typeof onFocus === 'function') {
      onFocus();
    }
  }

  onBlur = (property) => {
    this.setState({
      focussed: false
    });

    const { invalid } = this.state;

    if (invalid) {
      this.setState({
        changing: false,
        invalid: false
      });
    }

    const { onBlur } = this.props;

    if (typeof onBlur === 'function') {
      onBlur();
    }
  }

  getClassName() {
    var {
      className
    } = this.props;

    var {
      focussed,
      invalid
    } = this.state;

    className += ' editable';

    if (focussed) {
      className += ' focussed';
    }

    if (invalid) {
      className += ' invalid';
    }

    return className;
  }

  getDisplayValue() {

    var {
      value,
      placeholder
    } = this.props;

    var {
      focussed,
      changing
    } = this.state;

    if (typeof changing === 'string') {
      value = changing;
    }

    if (!value) {
      value = focussed ? '' : (placeholder || '');
    }

    return value;
  }

  getEditor(props = {}) {

    return (
      <ContentEditable
        className={ props.className }
        ctrlForNewline={ props.ctrlForNewline }
        onFocus={ this.onFocus }
        onBlur={ this.onBlur }
        onInput={ this.onInput }
        value={ this.getDisplayValue() } />
    );
  }

}
