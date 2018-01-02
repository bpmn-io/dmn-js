
// eslint-disable-next-line
import Inferno from 'inferno';

import { findRenderedDOMElementWithClass, renderIntoDocument } from 'inferno-test-utils';

// eslint-disable-next-line
import RuleIndexCellComponent from '../../../../../lib/features/rule-indices/components/RuleIndexCellComponent';


describe('RuleIndexCellComponentSpec', function() {

  it('should render', function() {

    // when
    const renderedTree = renderIntoDocument(<RuleIndexCellComponent rowIndex="0" />);

    // then
    const cell = findRenderedDOMElementWithClass(renderedTree, 'rule-index');

    expect(cell).to.exist;
    expect(cell.textContent).to.equal('0');
  });

});