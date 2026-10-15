export function parseString(string) {
  if (!string || isEmptyString(string)) {
    return 'none';
  } else if (string.trim() === 'true') {
    return 'true';
  } else if (string.trim() === 'false') {
    return 'false';
  }
}

function isEmptyString(string) {
  return string === '';
}