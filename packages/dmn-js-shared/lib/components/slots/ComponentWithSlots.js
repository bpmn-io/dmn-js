import { Component } from 'inferno';


export default class ComponentWithSlots extends Component {

  slotFill(slotProps, DefaultFill) {

    const {
      type,
      context,
      ...props
    } = slotProps;

    const {
      components
    } = this.context;

    const Fill = components.getComponent(type, context) || DefaultFill;

    if (Fill) {
      return <Fill { ...context } { ...props } />;
    }

    return null;
  }

  slotFills(slotProps) {

    const {
      type,
      context,
      ...props
    } = slotProps;

    const {
      components
    } = this.context;

    // FIXME(nikku): properly returns [] in table-js#master
    const fills = components.getComponents(type, context) || [];

    return fills.map(
      Fill => <Fill { ...context } { ...props } />
    );
  }
}