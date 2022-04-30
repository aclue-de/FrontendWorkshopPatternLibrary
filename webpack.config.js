module.exports = {
    entry:  __dirname + '/src/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'components.js',
        library: {
            name: 'components',
            type: 'umd'
        }
      },
};
