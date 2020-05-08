const path = require('path');

module.exports = {
    entry: './src/PrintProjectApp.tsx',
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
        filename: 'app.js',
        path: path.resolve(__dirname, '../desktop/PrintProject.App/app'),
    },
    mode: 'production'
};