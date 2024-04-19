/**
 * Allows to use modules from `table-js` which depend on `table.*` components.
 * @TODO(barmac): This is a temporary solution until we move context menu out of table-js.
 */
export class TableJsSupport {
  static $inject = [ 'components' ];

  constructor(components) {
    components.onGetComponent('viewer', () => {
      const children = components.getComponents('table.before') || [];

      return () => {
        return (
          <div>
            { children.map((Component, index) => <Component key={ index } />) }
          </div>
        );
      };
    });
  }
}
