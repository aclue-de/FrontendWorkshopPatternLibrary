module.exports = {
    entry: {
        'generateVersion': './generateVersion/main.ts',
        'deleteBranchVersions': './deleteBranchVersions/main.ts',
    },
    target: 'node',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: '[name]/dist/main.js',
        path: __dirname
    },
}
