const path = require('path');

module.exports = {
    entry: './src/StlViewerApp.tsx',
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
        filename: 'StlViewerApp.js',
        path: path.resolve(__dirname, 'out'),
    },
    mode: 'development'
};