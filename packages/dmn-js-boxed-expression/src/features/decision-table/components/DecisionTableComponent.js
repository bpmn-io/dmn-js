import { Component } from 'inferno';

import { is } from 'dmn-js-shared/lib/util/ModelUtil';


export class DecisionTableComponentProvider {
  static $inject = [ 'components', 'tableImporter' ];

  constructor(components, tableImporter) {
    components.onGetComponent('expression', ({ expression }) => {

      // there is a single sheet, so only the imported table can be displayed
      if (is(expression, 'dmn:DecisionTable') && tableImporter.getTable() === expression) {
        return DecisionTableComponent;
      }
    });
  }
}

/**
 * Renders the imported decision table. Table parts (head, body, foot) as well as
 * the hit policy are provided via slots.
 */
class DecisionTableComponent extends Component {
  constructor(props, context) {
    super(props, context);

    const { injector } = context;

    this._sheet = injector.get('sheet');
    this._eventBus = injector.get('eventBus');
    this._changeSupport = context.changeSupport;
    this._components = context.components;

    const throttle = injector.get('throttle');

    this.onScroll = throttle(this.onScroll);
  }

  onElementsChanged = () => {
    this.forceUpdate();
  };

  onScroll = () => {
    this._eventBus.fire('sheet.scroll');
  };

  componentWillMount() {
    const { id } = this._sheet.getRoot();

    this._changeSupport.onElementsChanged(id, this.onElementsChanged);
  }

  componentWillUnmount() {
    const { id } = this._sheet.getRoot();

    this._changeSupport.offElementsChanged(id, this.onElementsChanged);
  }

  render() {
    const { rows, cols } = this._sheet.getRoot();

    const HitPolicy = this._components.getComponent('hit-policy');
    const Head = this._components.getComponent('table.head');
    const Body = this._components.getComponent('table.body');
    const Foot = this._components.getComponent('table.foot');

    // `dmn-decision-table-container` scopes the styles and is the
    // drop target of the table-js drag and drop
    return (
      <div className="dmn-decision-table-container">
        <div className="tjs-container">
          {
            HitPolicy && (
              <div className="decision-table-properties">
                <HitPolicy />
              </div>
            )
          }
          <div className="tjs-table-container" onScroll={ this.onScroll }>
            <table className="tjs-table">
              { Head && <Head rows={ rows } cols={ cols } /> }
              { Body && <Body rows={ rows } cols={ cols } /> }
              { Foot && <Foot rows={ rows } cols={ cols } /> }
            </table>
          </div>
        </div>
      </div>
    );
  }
}
