import { Component } from 'inferno';

import { groupBy } from 'min-dash';

const RADIO = 'radio';

const REMOVE_BTN_CLS =
  'remove dmn-icon-clear';

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
export default class List extends Component {

  constructor(props, context) {
    super(props, context);

    const { items } = props;

    this.state = {
      items
    };
  }

  componentWillReceiveProps(props) {
    const { items } = props;

    this.setState({
      items
    });
  }

  getRemoveClickHandler = (item) => {
    return (e) => {
      e.stopPropagation();

      this.removeItem(item);
    };
  }

  getToggleClickHandler = (item) => {
    return (e) => {
      e.stopPropagation();

      this.toggleItem(item);
    };
  }

  removeItem = (item) => {
    const { onChange } = this.props;

    // remove item
    const newItems = this.state.items.filter(i => i !== item);

    this.setState({
      items: newItems
    });

    onChange && onChange(newItems);
  }

  toggleItem = (item) => {
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
    const { className, items, type, labelComponent } = this.props;

    const classes = [
      'dms-list-component'
    ];

    if (className) {
      classes.push(className);
    }

    // group items by group title
    const groupedItems = groupBy(items, 'group');

    const asPairs = toPairs(groupedItems);

    return (
      <div className={ classes.join(' ') }>
        {
          asPairs.map(pair => {

            const groupTitle = pair[0],
                  groupItems = pair[1];

            return (
              <div className="group">

                { labelComponent && labelComponent(groupTitle) ||
                  <h4 className="dms-heading">{ groupTitle }</h4> }

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
                                className="item-toggle"
                                onClick={ this.getToggleClickHandler(item) } />
                          }
                          &nbsp;
                          { item.value }
                          {
                            item.isRemovable
                              && (<span
                                title="Remove item"
                                onClick={ this.getRemoveClickHandler(item) }
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


// helpers ////////////

function toPairs(object) {
  const entrys = [];

  for (let key in object) {
    entrys.push([key, object[key]]);
  }

  return entrys;
}