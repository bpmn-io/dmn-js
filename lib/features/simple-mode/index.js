module.exports = {
  __init__: [ 'simpleMode', 'simpleModeRules' ],
  simpleMode: [ 'type', require('./SimpleMode') ],
  simpleModeRules: [ 'type', require('./SimpleModeRules') ]
};
