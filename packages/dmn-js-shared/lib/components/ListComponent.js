import { Component } from 'inferno';

import { groupBy } from 'min-dash/lib/collection';

const RADIO = 'radio';

const REMOVE_BTN_CLS =
  'remove dmn-icon-clear float-right cursor-pointer';

/**
 * Shows a list of grouped items that can be checked
 * (checkboxes or radio buttons), removed.
 *
 * Example list of items:
 *
 * [
 *   { value: 'foo', isChecked: true, isRemovable: false, group: 'foo' },
 *   { value: 'bar', isChecked: false, isRemovable: true, group: 'bar' },
 *   { value: 'baz', isCheckable: false, group: 'baz' }
 * ]
 */
export default class ListComponent extends Component {

  constructor(props, context) {
    super(props, context);

    const { items } = props;

    this.state = {
      items
    };

    this.removeItem = this.removeItem.bind(this);
    this.toggleItem = this.toggleItem.bind(this);
  }

  componentWillReceiveProps(props) {
    const { items } = props;

    this.setState({
      items
    });
  }

  removeItem(item) {
    const { onChange } = this.props;

    // remove item
    const newItems = this.state.items.filter(i => i !== item);

    this.setState({
      items: newItems
    });

    onChange && onChange(newItems);
  }

  toggleItem(item) {
    const { onChange, type } = this.props;

    // toggle item
    const newItems = this.state.items.map(i => {
      if (i === item) {
        i.isChecked = !i.isChecked;
      } else {

        if (type === RADIO) {
          i.isChecked = false;
        }

      }

      return i;
    });

    this.setState({
      items: newItems
    });

    onChange && onChange(newItems);
  }

  render() {
    const { className, items, type } = this.props;

    const classes = [
      'dms-list-component'
    ];

    if (className) {
      classes.push(className);
    }

    // group items by group title
    const groupedItems = groupBy(items, 'group');

    const asPairs = Object.entries(groupedItems);

    return (
      <div className={ classes.join(' ') }>
        {
          asPairs.map(pair => {

            const groupTitle = pair[0],
                  groupItems = pair[1];

            return (
              <div className="group">

                <h4 className="dms-heading">{ groupTitle }</h4>

                <ul className="items no-wrap">
                  {
                    groupItems.map(item => {

                      return (
                        <li className="item">
                          {
                            type
                              && <input
                                type={ type }
                                checked={ item.isChecked }
                                className="item-toggle cursor-pointer"
                                onClick={ () => this.toggleItem(item) } />
                          }
                          &nbsp;
                          { item.value }
                          {
                            item.isRemovable
                              && (<span
                                title="Remove item"
                                onMouseup={ () => this.removeItem(item) }
                                className={ REMOVE_BTN_CLS }>
                              </span>)
                          }
                        </li>
                      );

                    })
                  }
                </ul>

              </div>
            );

          })
        }

      </div>
    );
  }
}