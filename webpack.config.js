const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const glob = require('glob');
const parts = require('./webpack.parts');

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};

const commonConfig = merge([
    {
        entry: {
            app: PATHS.app
        },
        output: {
            path: PATHS.build,
            filename: '[name].js'
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Webpack demo'
            })
        ]
    },
    parts.lintJavascript({ include: PATHS.app }),
    parts.lintCss({ include: PATHS.app })
]);

const productionConfig = merge([
    parts.extractCss({ use: 'css-loader' }),
    parts.purifyCss({
        paths: glob.sync(`${PATHS.app}/**/*`, { nodir: true })
    })
]);

const developmentConfig = merge([
    parts.devServer({
        host: process.env.HOST,
        port: process.env.HOST
    }),
    parts.loadCss()
]);

module.exports = (env) => {
    if (env === 'production') {
        return merge(commonConfig, productionConfig);
    } else {
        return merge(commonConfig, developmentConfig);
    }
};