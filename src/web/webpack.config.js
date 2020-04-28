const path = require('path');

module.exports = {
    entry: {
        StlViewerApp: './wwwroot/ts/StlViewerApp.ts'
    },
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
        filename: '[name].js',
        path: path.resolve(__dirname, './wwwroot/js'),
    },
    mode: 'production'
};