export function selectNodeContents(node) {
  const selection = window.getSelection();
  const range = document.createRange();

  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function removeSelection() {
  if (window.getSelection) {
    if (window.getSelection().empty) {
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {
    document.selection.empty();
  }
}
