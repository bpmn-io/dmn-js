import { render } from 'inferno';
import { Injector } from 'didi';
import { DiContainer } from 'table-js/lib/components';

import InputSelect from './InputSelect';

/**
 * Mount the shared selector outside a table renderer.
 *
 * @param {HTMLElement} node selector host
 * @param {HTMLElement} container untransformed container for the options popup
 * @return {{ update: Function, destroy: Function }}
 */
export default function mountInputSelect(node, container) {
  const listeners = new Map();
  const injector = new Injector([ {
    renderer: [ 'value', { getContainer: () => container } ],
    keyboard: [ 'value', {
      addListener(listener) {
        const handler = event => listener(event.which);
        listeners.set(listener, handler);
        document.addEventListener('keydown', handler);
      },
      removeListener(listener) {
        document.removeEventListener('keydown', listeners.get(listener));
        listeners.delete(listener);
      }
    } ]
  } ]);

  return {
    update(props) {
      render(
        <DiContainer injector={ injector }>
          <InputSelect { ...props } />
        </DiContainer>,
        node
      );
    },
    destroy() {
      render(null, node);
    }
  };
}
