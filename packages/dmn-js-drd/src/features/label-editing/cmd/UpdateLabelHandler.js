import {
  getLabel,
  setLabel
} from '../LabelUtil';


/**
 * A handler that updates the name of a DMN element.
 */
export default function UpdateLabelHandler() {

  /**
   * Set the label and return the changed elements.
   *
   * Element parameter can be label itself or connection (i.e. sequence flow).
   *
   * @param {djs.model.Base} element
   * @param {string} text
   */
  function setText(element, text) {

    // external label if present
    var label = element.label || element;

    var labelTarget = element.labelTarget || element;

    setLabel(label, text, labelTarget !== label);

    return [ label, labelTarget ];
  }

  function execute(ctx) {
    ctx.oldLabel = getLabel(ctx.element);
    return setText(ctx.element, ctx.newLabel);
  }

  function revert(ctx) {
    return setText(ctx.element, ctx.oldLabel);
  }

  // API

  this.execute = execute;
  this.revert = revert;
}
