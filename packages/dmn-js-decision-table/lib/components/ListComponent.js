
// eslint-disable-next-line
import Inferno from 'inferno';
import Component from 'inferno-component';

import { groupBy, toPairs } from 'lodash';

const RADIO = 'radio';

const REMOVE_BTN_CLS =
  'remove dmn-icon-clear ' +
  'no-margin-right small-margin-left float-right ' +
  'cursor-pointer';

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
      'list-component'
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
              <div className="group margin-bottom-medium">

                <div className="title margin-bottom-medium">{ groupTitle }</div>

                {
                  groupItems.map(item => {

                    return (
                      <div
                        className="item margin-bottom-medium no-wrap">
                        {
                          type
                            && <input
                              type={ type }
                              checked={ item.isChecked }
                              className="cursor-pointer margin-right-medium"
                              onClick={ () => this.toggleItem(item) } />
                        }
                        { item.value }
                        {
                          item.isRemovable
                            && (<span
                              title="Remove item"
                              onMouseup={ () => this.removeItem(item) }
                              className={ REMOVE_BTN_CLS }>
                            </span>)
                        }
                      </div>
                    );

                  })
                }

              </div>
            );

          })
        }

      </div>
    );
  }
}