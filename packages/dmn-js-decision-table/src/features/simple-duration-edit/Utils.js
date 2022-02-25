import { keys } from 'min-dash';

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

export function parseDuration(text) {
  if (!text || isEmptyString(text.trim())) {
    return {
      type: 'comparison',
      values: []
    };
  }

  const parsedComparison = parseComparison(text);

  if (parsedComparison) {
    return parsedComparison;
  }

  const parsedRange = parseRange(text);

  if (parsedRange) {
    return parsedRange;
  }
}

export function isEmptyString(string) {
  return string === '';
}

export function getComparisonString(comparisonOperator, comparisonValue) {
  if (comparisonOperator === 'equals') {
    return `duration("${ comparisonValue }")`;
  } else {
    return `${ operators[comparisonOperator] } duration("${ comparisonValue }")`;
  }
}

export function getRangeString(
    rangeStartValue,
    rangeEndValue,
    rangeStartType,
    rangeEndType) {
  const rangeStartChar = rangeStartType === 'exclude' ? ']' : '[',
        rangeEndChar = rangeEndType === 'exclude' ? '[' : ']';

  return `${ rangeStartChar }duration("${ rangeStartValue }")` +
    `..duration("${ rangeEndValue }")${ rangeEndChar }`;
}

export function validateDuration(type, value) {
  if (type === 'yearMonthDuration') {
    return validateYearMonthDuration(value);
  } else if (type === 'dayTimeDuration') {
    return validateDayTimeDuration(value);
  }
}

function validateYearMonthDuration(value) {
  return /^P(\d+Y\d+M|\d+Y|\d+M)$/.test(value);
}

function validateDayTimeDuration(value) {
  return /^P(\d+DT\d+H|\d+D|T\d+H)$/.test(value);
}

export function withoutDurationCall(text) {
  const result = /^duration\("([^"]*)"\)$/.exec(text);
  return result && result[1];
}

function parseComparison(text) {
  const exactValue = withoutDurationCall(text);

  if (exactValue) {
    return {
      type: 'comparison',
      operator: 'equals',
      values: [ exactValue ]
    };
  }

  const {
    operator,
    value
  } = match(/^(?<operator>=|(:?<|>)=?)\s*duration\("(?<value>[^"]*)"\)$/, text);

  if (operator && value) {
    return {
      type: 'comparison',
      values: [ value ],
      operator: getOperatorName(operator)
    };
  }
}

function parseRange(text) {
  const {
    start,
    end,
    firstValue,
    secondValue
  // eslint-disable-next-line
  } = match(/^(?<start>[[\]])duration\("(?<firstValue>[^"]*)"\)\.\.duration\("(?<secondValue>[^"]*)"\)(?<end>[[\]])$/, text);

  if (start && end) {
    return {
      type: 'range',
      values: [ firstValue, secondValue ],
      start: start === ']' ? 'exclude' : 'include',
      end: end === '[' ? 'exclude' : 'include'
    };
  }
}

function match(regex, input) {
  const {
    groups
  } = regex.exec(input) || { groups: {} };

  return groups;
}
