const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bpmn-js-differ.vanilla.js',
    library: 'BpmnJsDiffer',
    libraryTarget: 'umd',
    globalObject: 'window'
  },
  mode: 'production'
};
