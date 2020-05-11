export const HIT_POLICIES = [
  {
    label: 'Unique',
    value: {
      hitPolicy: 'UNIQUE',
      aggregation: undefined
    }
  },
  {
    label: 'First',
    value: {
      hitPolicy: 'FIRST',
      aggregation: undefined
    }
  },
  {
    label: 'Priority',
    value: {
      hitPolicy: 'PRIORITY',
      aggregation: undefined
    }
  },
  {
    label: 'Any',
    value: {
      hitPolicy: 'ANY',
      aggregation: undefined
    }
  },
  {
    label: 'Collect',
    value: {
      hitPolicy: 'COLLECT',
      aggregation: undefined
    }
  },
  {
    label: 'Collect (Sum)',
    value: {
      hitPolicy: 'COLLECT',
      aggregation: 'SUM'
    }
  },
  {
    label: 'Collect (Min)',
    value: {
      hitPolicy: 'COLLECT',
      aggregation: 'MIN'
    }
  },
  {
    label: 'Collect (Max)',
    value: {
      hitPolicy: 'COLLECT',
      aggregation: 'MAX'
    }
  },
  {
    label: 'Collect (Count)',
    value: {
      hitPolicy: 'COLLECT',
      aggregation: 'COUNT'
    }
  },
  {
    label: 'Rule order',
    value: {
      hitPolicy: 'RULE ORDER',
      aggregation: undefined
    }
  },
  {
    label: 'Output order',
    value: {
      hitPolicy: 'OUTPUT ORDER',
      aggregation: undefined
    }
  }
];
