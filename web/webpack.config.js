const path = require('path');

module.exports = {
    entry: {
        StlViewerApp: './PrintProjects.Web/wwwroot/ts/StlViewerApp.ts',
        GalleryApp: './PrintProjects.Web/wwwroot/ts/GalleryApp.ts'
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
        path: path.resolve(__dirname, './PrintProjects.Web/wwwroot/js'),
    },
    mode: 'production'
};