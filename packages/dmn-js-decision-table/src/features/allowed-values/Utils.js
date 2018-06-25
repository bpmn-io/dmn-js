export function parseString(string) {

  // empty string or no string at all
  if (!string || isEmptyString(string.trim())) {
    return {
      values: []
    };
  }

  // disjunction
  let values = string.split(',');

  const result = {
    values: []
  };

  let openString = '';

  values.forEach(value => {
    openString += value;

    if (/^"[^"]*"$/.test(openString.trim())) {
      result.values.push(openString.trim());

      openString = '';
    } else {
      openString += ',';
    }
  });

  if (!openString) {
    return result;
  }
}

function isEmptyString(string) {
  return string === '';
}

export function getValuesArray(values) {
  return values.map(value => value.value);
}