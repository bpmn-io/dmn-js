import axe from 'axe-core';

const DEFAULT_AXE_TAGS = [ 'wcag21a', 'wcag21aa' ];

export function insertCSS(name, css) {
  if (document.querySelector('[data-css-file="' + name + '"]')) {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
  style.setAttribute('data-css-file', name);

  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
}

/**
 * Verify no accessibility rules violations in the container.
 *
 * @param {Element} container
 */
export async function expectToBeAccessible(container) {

  // when
  const results = await axe.run(container, {
    runOnly: {
      type: 'tag',
      values: DEFAULT_AXE_TAGS
    }
  });

  // then
  expect(results.passes).to.be.not.empty;
  expect(results.violations).to.be.empty;
}
