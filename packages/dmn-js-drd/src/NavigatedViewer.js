import inherits from 'inherits-browser';

import Viewer from './Viewer';

import ZoomScroll from 'diagram-js/lib/navigation/zoomscroll';
import MoveCanvas from 'diagram-js/lib/navigation/movecanvas';

import DmnSearchModule from './features/search';

/**
 * A viewer that includes mouse navigation facilities
 *
 * @param {Object} options
 */
export default function NavigatedViewer(options) {
  Viewer.call(this, options);
}

inherits(NavigatedViewer, Viewer);


NavigatedViewer.prototype._navigationModules = [
  ZoomScroll,
  MoveCanvas,
  DmnSearchModule
];

NavigatedViewer.prototype._modules = [].concat(
  NavigatedViewer.prototype._modules,
  NavigatedViewer.prototype._navigationModules
);
