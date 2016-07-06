module.exports = {
  __init__: [ 'simpleMode', 'simpleModeRules' ],
  __depends__: [],
  simpleMode: [ 'type', require('./SimpleMode') ],
  simpleModeRules: [ 'type', require('./SimpleModeRules') ]
};
