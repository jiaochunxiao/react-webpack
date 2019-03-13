const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = function(env) {
    let commonLoaders = [
        {
            test: /\.js$/,
            include: [
                path.resolve(__dirname, '../src'),
            ],
            use: ['happypack/loader?id=js'],
        },
        {
            test: /\.(jpe?g|png|gif)$/,
            loader: 'url-loader',
            options: {
                limit: 4000,
                publicPath: './',
                name: 'images/[name].[ext]',
            },
        },
    ];
    let cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: env === 'dev',
        },
    };
    let cssLoaders = [];

    if (env !== 'dev') {
        let postcssloader = {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins: loader => [
                    autoprefixer({
                        browsers: ['ie > 1', 'chrome > 1', "ff > 1"]
                    }),
                    cssnano(),
                ]
            },
        };
        let extractLoader = {
            loader: MiniCssExtractPlugin.loader,
            options: {
                public: '../',
            },
        };
        let lessLoader = [extractLoader, cssLoader, postcssloader, 'less-loader'];
        cssLoaders = [
            {
                test: /\.css$/,
                use: [extractLoader, 'css-loader', postcssloader],
            },
            {
                test: /\.less$/,
                use: lessLoader,
            }
        ];
    }
    else {
        cssLoaders = [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                use: ['style-loader', cssLoader, 'less-loader'],
            }
        ]
    }
    return commonLoaders.concat(cssLoaders);
};
