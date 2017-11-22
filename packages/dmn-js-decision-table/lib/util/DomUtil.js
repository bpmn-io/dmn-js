export function selectNodeContents(node) {
  const selection = window.getSelection();
  const range = document.createRange();
  
  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);
}