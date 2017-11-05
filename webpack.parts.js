const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCssPlugin = require('purifycss-webpack');
exports.devServer = ({ host, port } = {}) => ({
    devServer: {
        historyApiFallback: true,
        stats: 'errors-only',
        host: process.env.HOST,
        port: process.env.PORT,
        overlay: {
            errors: true,
            warnings: true
        }
    }
});

exports.lintJavascript = ({ include, exclude, options }) => ({
    module: {
        rules: [{
            test: /\.js$/,
            enforce: 'pre',
            loader: 'eslint-loader',
            options: {
                emitWarning: true
            }
        }]
    }
});

exports.lintCss = ({ include, exclude }) => ({
    module: {
        rules: [{
            test: /\.css$/,
            include,
            exclude,
            enforce: 'pre',
            loader: 'postcss-loader',
            options: {
                plugins: () => ([
                    require('stylelint')({
                        ignoreFiles: 'node_module/**/*.css'
                    })
                ])
            }
        }]
    }
});

exports.loadCss = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                include,
                exclude,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
});

exports.extractCss = ({ include, exclude, use }) => {
    const plugin = new ExtractTextPlugin({
        filename: '[name].css'
    });

    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include,
                    exclude,
                    use: plugin.extract({
                        use,
                        fallback: 'style-loader'
                    })
                }
            ]
        },
        plugins: [plugin]
    };
};

exports.purifyCss = ({ paths }) => ({
    plugins: [
        new PurifyCssPlugin({ paths })
    ]
});