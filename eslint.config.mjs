import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  build: [
    '*.mjs',
    '*.js',
    'packages/*/*.mjs',
    'packages/*/*.mjs',
    'packages/*/*.js',
    'tasks/*.mjs',
    'packages/*/tasks/*.mjs',
    'packages/dmn-js/test/distro/karma.conf.js'
  ],
  test: [
    '**/test/**/*.js'
  ],
  ignored: [
    '**/lib',
    '**/dist',
    '**/coverage'
  ]
};

export default [
  {
    ignores: files.ignored
  },

  // build
  ...bpmnIoPlugin.configs.node.map(config => {
    return {
      ...config,
      files: files.build
    };
  }),

  // lib + test
  ...bpmnIoPlugin.configs.browser.map(config => {
    return {
      ...config,
      ignores: files.build
    };
  }),
  ...bpmnIoPlugin.configs.jsx.map(config => {
    return {
      ...config,
      ignores: files.build
    };
  }),
  {
    rules: {
      'max-len': [ 'error', { 'code': 90 } ],
      'no-restricted-imports': [ 'error', {
        'patterns': [ 'dmn-js/src', 'dmn-js-*/src' ]
      } ],
      'react/display-name': 'off',
      'react/no-deprecated': 'off',
      'react/jsx-key': 'off', // TODO(@barmac): reenable and fix problems
      'react/no-unknown-property': 'off',
    },
    ignores: files.build
  },

  // test
  ...bpmnIoPlugin.configs.mocha.map(config => {
    return {
      ...config,
      files: files.test
    };
  }),
  {
    languageOptions: {
      globals: {
        require: true
      }
    },
    files: files.test
  }
];
