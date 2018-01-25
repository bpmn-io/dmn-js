import { keys } from 'lodash';

// eslint-disable-next-line
const COMPARISON_REGULAR_EXPRESSION = /^(-?(?:[0-9]|[0-9]e[0-9]|\.[0-9])+)$|^((?:<|>|=){0,2})\s*(-?(?:[0-9]|[0-9]e[0-9]|\.[0-9])+)$/;

// eslint-disable-next-line
const RANGE_REGULAR_EXPRESSION = /^(\[|\]){1}-?([0-9]|[0-9]e[0-9]|\.[0-9]){1,}\.\.-?([0-9]|[0-9]e[0-9]|\.[0-9]){1,}(\[|\]){1}$/;

export const operators = {
  equals: '=',
  less: '<',
  lessEquals: '<=',
  greater: '>',
  greaterEquals: '>='
};

function getOperatorName(string) {
  return keys(operators).filter(key => {
    return string === operators[ key ];
  })[0];
}

export function parseString(string) {
  if (isEmptyString(string.trim())) {
    return {
      type: 'comparison'
    };
  }

  if (COMPARISON_REGULAR_EXPRESSION.test(string)) {

    const matches = string.match(COMPARISON_REGULAR_EXPRESSION);

    if (isNumber(matches)) {
      return {
        type: 'comparison',
        value: parseFloat(matches[1]),
        operator: 'equals'
      };
    } else if (isComparison(matches)) {
      return {
        type: 'comparison',
        value: parseFloat(matches[3]),
        operator: getOperatorName(matches[2])
      };
    }

  } else if (RANGE_REGULAR_EXPRESSION.test(string)) {

    const matches = string.match(RANGE_REGULAR_EXPRESSION);

    const values = string.match(/([^[\]]*)(?:\.\.)([^[\]]*)/);

    return {
      type: 'range',
      values: values.slice(1).map(value => parseFloat(value)),
      start: matches[1] === ']' ? 'exclude' : 'include',
      end: matches[4] === '[' ? 'exclude' : 'include'
    };
  }

}

export function isEmptyString(string) {
  return string === '';
}

function isNumber(matches) {
  return matches[0] && matches[1] && !matches[2] && !matches[3];
}

function isComparison(matches) {
  return matches[0] && !matches[1] && matches[2] && matches[3];
}

export function getComparisonString(comparisonOperator, comparisonValue) {
  if (comparisonOperator === 'equals') {
    return `${ comparisonValue }`;
  } else {
    return `${ operators[comparisonOperator] } ${ comparisonValue }`;
  }
}

export function getRangeString(
    rangeStartValue,
    rangeEndValue,
    rangeStartType,
    rangeEndType) {
  const rangeStartChar = rangeStartType === 'exclude' ? ']' : '[',
        rangeEndChar = rangeEndType === 'exclude' ? '[' : ']';

  return `${ rangeStartChar }${ rangeStartValue }..${ rangeEndValue }${ rangeEndChar }`;
}