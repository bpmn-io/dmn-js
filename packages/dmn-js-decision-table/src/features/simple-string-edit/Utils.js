import { isInput } from 'dmn-js-shared/lib/util/ModelUtil';

/**
 * Parse input/output entry string to unary tests and type of unary tests.
 *
 * Example:
 *
 * not("foo", "bar")
 *
 * returns
 *
 * {
 *   type: 'negation',
 *   values: [ "foo", "bar, baz" ]
 * }
 *
 * @param {String} string - Input/Output entry as string e.g. "foo", "bar".
 */
export function parseString(string) {

  // empty string or no string at all
  if (!string || isEmptyString(string.trim())) {
    return {
      type: 'disjunction',
      values: []
    };
  }

  // disjunction
  let values = string.split(',');

  const result = {
    type: 'disjunction',
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

  // negation
  result.type = 'negation';
  result.values = [];

  openString = '';

  const matches = string.match(/^\s*not\((.*)\)\s*$/);

  if (matches) {
    values = matches[1].split(',');

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
}

// TODO(philippfromme): seperate when refactoring component
export function getInputOrOutputValues(inputOrOutput) {
  const inputOrOutputValues =
    isInput(inputOrOutput) ?
      inputOrOutput.inputValues :
      inputOrOutput.outputValues;

  if (!inputOrOutputValues || isEmptyString(inputOrOutputValues.text)) {
    return [];
  } else {
    return inputOrOutputValues.text.split(',').map(value => value.trim());
  }
}

function isEmptyString(string) {
  return string === '';
}