const ISO_TIME_REGEX = /^(?:\d\d:){2}\d\dZ$/;

// eslint-disable-next-line
const BETWEEN_TIME_REGEX = /^\[time\("((?:\d\d:){2}\d\dZ)"\)..time\("((?:\d\d:){2}\d\dZ)"/;

// eslint-disable-next-line
const BEFORE_AFTER_TIME_REGEX = /^(<|>)\s*time\("((?:\d\d:){2}\d\dZ)"\)/;

const EXACT_TIME_REGEX = /^time\("((?:\d\d:){2}\d\dZ)"\)$/;

const EXACT = 'exact',
      BEFORE = 'before',
      AFTER = 'after',
      BETWEEN = 'between';

export function validateISOString(string) {
  if (!ISO_TIME_REGEX.test(string.trim())) {
    return 'Time must match pattern hh:mm:ssZ.';
  }
}

export function getTimeString(type, times) {
  if (type === EXACT) {
    return `time("${ times[0] }")`;
  } else if (type === BEFORE) {
    return `< time("${ times[0] }")`;
  } else if (type === AFTER) {
    return `> time("${ times[0] }")`;
  } else if (type === BETWEEN) {
    return `[time("${ times[0] }")..time("${ times[1] }")]`;
  }
}

export function getSampleTime() {
  const time = new Date();

  return time.toISOString().slice(11, -5) + 'Z';
}

export function parseString(string) {

  // emtpy
  if (!string || string.trim() === '') {
    return {
      type: 'exact',
      time: ''
    };
  }

  // between
  let matches = string.match(BETWEEN_TIME_REGEX);

  if (matches) {
    return {
      type: 'between',
      times: [ matches[1], matches[2] ]
    };
  }

  // before or after
  matches = string.match(BEFORE_AFTER_TIME_REGEX);

  if (matches) {
    return {
      type: matches[1] === '<' ? 'before' : 'after',
      time: matches[2]
    };
  }

  // exact
  matches = string.match(EXACT_TIME_REGEX);

  if (matches) {
    return {
      type: 'exact',
      time: matches[1]
    };
  }
}