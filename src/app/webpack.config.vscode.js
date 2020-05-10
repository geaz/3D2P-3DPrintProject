const path = require('path');

module.exports = {
    entry: './src/StlViewer.vscode.tsx',
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
        filename: 'StlViewer.js',
        path: path.resolve(__dirname, '../vscode/out'),
    },
    mode: 'production'
};