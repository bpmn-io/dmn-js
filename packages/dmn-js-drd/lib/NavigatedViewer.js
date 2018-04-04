import inherits from 'inherits';

import Viewer from './Viewer';


/**
 * A viewer that includes mouse navigation facilities
 *
 * @param {Object} options
 */
export default function NavigatedViewer(options) {
  Viewer.call(this, options);
}

inherits(NavigatedViewer, Viewer);

import ZoomScroll from 'diagram-js/lib/navigation/zoomscroll';
import MoveCanvas from 'diagram-js/lib/navigation/movecanvas';
import TouchModule from 'diagram-js/lib/navigation/touch';

NavigatedViewer.prototype._navigationModules = [
  ZoomScroll,
  MoveCanvas,
  TouchModule
];

NavigatedViewer.prototype._modules = [].concat(
  NavigatedViewer.prototype._modules,
  NavigatedViewer.prototype._navigationModules
);
