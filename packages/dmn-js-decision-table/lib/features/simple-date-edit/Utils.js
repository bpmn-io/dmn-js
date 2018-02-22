const ISO_DATE_REGEX = /^\d{4}(?:-\d\d){2}T(?:\d\d:){2}\d\d$/;

// eslint-disable-next-line
const BETWEEN_DATE_REGEX = /^\[date and time\("(\d{4}(?:-\d\d){2}T(?:\d\d:){2}\d\d)"\)..date and time\("(\d{4}(?:-\d\d){2}T(?:\d\d:){2}\d\d)"/;

// eslint-disable-next-line
const BEFORE_AFTER_DATE_REGEX = /^(<|>)\s*date and time\("(\d{4}(?:-\d\d){2}T(?:\d\d:){2}\d\d)"\)/;

const EXACT_DATE_REGEX = /^date and time\("(\d{4}(?:-\d\d){2}T(?:\d\d:){2}\d\d)"\)$/;

const EXACT = 'exact',
      BEFORE = 'before',
      AFTER = 'after',
      BETWEEN = 'between';

export function validateISOString(string) {
  if (!ISO_DATE_REGEX.test(string.trim())) {
    return 'Date must match pattern yyyy-MM-ddTHH:mm:ss.';
  }
}

export function getDateString(type, dates) {
  if (type === EXACT) {
    return `date and time("${ dates[0] }")`;
  } else if (type === BEFORE) {
    return `< date and time("${ dates[0] }")`;
  } else if (type === AFTER) {
    return `> date and time("${ dates[0] }")`;
  } else if (type === BETWEEN) {
    return `[date and time("${ dates[0] }")..date and time("${ dates[1] }")]`;
  }
}

export function getSampleDate() {
  const date = new Date();

  date.setUTCHours(0, 0, 0, 0);

  return date.toISOString().slice(0,-5);
}

export function parseString(string) {

  // emtpy
  if (!string || string.trim() === '') {
    return {
      type: 'exact',
      date: ''
    };
  }

  // between
  let matches = string.match(BETWEEN_DATE_REGEX);

  if (matches) {
    return {
      type: 'between',
      dates: [ matches[1], matches[2] ]
    };
  }

  // before or after
  matches = string.match(BEFORE_AFTER_DATE_REGEX);

  if (matches) {
    return {
      type: matches[1] === '<' ? 'before' : 'after',
      date: matches[2]
    };
  }

  // exact
  matches = string.match(EXACT_DATE_REGEX);

  if (matches) {
    return {
      type: 'exact',
      date: matches[1]
    };
  }
}