import { keys } from 'min-dash';

// eslint-disable-next-line
const COMPARISON_REGULAR_EXPRESSION = /^(-?(?:[0-9]|\.[0-9])+)$|^((?:<|>|=){0,2})\s*(-?(?:[0-9]|\.[0-9])+)$/;

// eslint-disable-next-line
const RANGE_REGULAR_EXPRESSION = /^(\[|\]){1}(-?(?:[0-9]|\.[0-9])+){1,}\.\.(-?(?:[0-9]|\.[0-9])+){1,}(\[|\]){1}$/;

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
  if (!string || isEmptyString(string.trim())) {
    return {
      type: 'comparison'
    };
  }

  const comparisonMatches = string.match(COMPARISON_REGULAR_EXPRESSION),
        rangeMatches = string.match(RANGE_REGULAR_EXPRESSION);

  if (comparisonMatches) {
    if (isNumber(comparisonMatches)) {
      return {
        type: 'comparison',
        value: parseFloat(comparisonMatches[1]),
        operator: 'equals'
      };
    } else if (isComparison(comparisonMatches)) {
      return {
        type: 'comparison',
        value: parseFloat(comparisonMatches[3]),
        operator: getOperatorName(comparisonMatches[2])
      };
    }

  } else if (rangeMatches) {
    return {
      type: 'range',
      values: [ rangeMatches[2], rangeMatches[3] ].map(value => parseFloat(value)),
      start: rangeMatches[1] === ']' ? 'exclude' : 'include',
      end: rangeMatches[4] === '[' ? 'exclude' : 'include'
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