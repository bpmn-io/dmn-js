/* eslint max-len: 0 */
export const HIT_POLICIES = [
  {
    label: 'Unique',
    value: {
      hitPolicy: 'UNIQUE',
      aggregation: undefined
    },
    explanation: 'No overlap is possible and all rules are disjoint. Only a single rule can be matched'
  },
  {
    label: 'First',
    value: {
      hitPolicy: 'FIRST',
      aggregation: undefined
    },
    explanation: 'Rules may overlap. The first matching rule will be chosen'
  },
  {
    label: 'Priority',
    value: {
      hitPolicy: 'PRIORITY',
      aggregation: undefined
    },
    explanation: 'Rules may overlap. The one with the highest priority will be chosen'
  },
  {
    label: 'Any',
    value: {
      hitPolicy: 'ANY',
      aggregation: undefined
    },
    explanation: 'Rules may overlap. Their output have to match'
  },
  {
    label: 'Collect',
    value: {
      hitPolicy: 'COLLECT',
      aggregation: undefined
    },
    explanation: 'Collects the values of all matching rules'
  },
  {
    label: 'Collect (Sum)',
    value: {
      hitPolicy: 'COLLECT',
      aggregation: 'SUM'
    },
    explanation: 'Collects the values of all matching rules and sums up to a single value'
  },
  {
    label: 'Collect (Min)',
    value: {
      hitPolicy: 'COLLECT',
      aggregation: 'MIN'
    },
    explanation: 'Collects the values of all matching rules and uses the lowest value'
  },
  {
    label: 'Collect (Max)',
    value: {
      hitPolicy: 'COLLECT',
      aggregation: 'MAX'
    },
    explanation: 'Collects the values of all matching rules and uses the highest value'
  },
  {
    label: 'Collect (Count)',
    value: {
      hitPolicy: 'COLLECT',
      aggregation: 'COUNT'
    },
    explanation: 'Collects the values of all matching rules and counts the number of them'
  },
  {
    label: 'Rule order',
    value: {
      hitPolicy: 'RULE ORDER',
      aggregation: undefined
    },
    explanation: 'Collects the values of all matching rules in rule order'
  },
  {
    label: 'Output order',
    value: {
      hitPolicy: 'OUTPUT ORDER',
      aggregation: undefined
    },
    explanation: 'Collects the values of all matching rules in decreasing output priority order'
  }
];
