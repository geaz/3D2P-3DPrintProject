const path = require('path');

module.exports = {
    entry: './src/apps/StlWebViewApp.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: 'StlWebViewApp.js',
        path: path.resolve(__dirname, 'out/apps'),
    },
    mode: 'production'
};