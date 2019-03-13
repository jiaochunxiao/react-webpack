const path = require('path');
const webpack = require('webpack');
// 提取样式到单独的文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩样式文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// 
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// 
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({size: 4});

const commonLoader = require('./common_config');
module.exports = function(env, port) {
    const commonLoaders = commonLoader(env);
    const config = {
        mode: 'development',
        module: {
            rules: commonLoaders,
        },
        output: {
            path: path.join(__dirname, '../dist'),
            filename: `[name].js`,
            publicPath: '/',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.less', '.css'],
            alias: {
                '@components': path.resolve('src/components'),
                '@pages': path.resolve('src/pages'),
            },
        },
    };
    if (env === 'dev') {
        config.entry = {
            main: ['webpack-dev-server/client?http://localhost:8080/', path.join(__dirname, '../src/index.js')],
        };
        config.devtool = 'eval-source-map';
        config.plugins = [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"development"',
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./manifest.json'),
                name: 'vendors'
            }),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, '../index-dev.html'),
                filename: './index.html',
            }),
            new HappyPack({
                id: 'js',
                verbose: false,
                threadPool: happyThreadPool,
                loaders: [
                    {
                        loader: 'babel-loader',
                        query: {
                            cacheDirectory: true,
                        }
                    }
                ]
            }),
        ];
        config.devServer = {
            contentBase: path.resolve(__dirname, '../dist'),
            compress: true,
            hotOnly: false,
            disableHostCheck: true,
            port: port,
            host: "0.0.0.0",
            open: true,
            hot: false,
            inline: true,
            watchContentBase: true,
            overlay: {
                warnings: false,
                errors: true
            }
        };
    }
    else {
        config.mode = 'production';
        config.plugins = [
            // 作用域提升
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"',
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),
            new OptimizeCssAssetsPlugin(),
            // 引入 manifest.json
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./manifest.json'),
                name: 'vendors'
            }),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, '../index-prod.html'),
                filename: './index.html',
                version: new Date().getTime(),
                inject: false,
            }),
            new HappyPack({
                id: 'js',
                verbose: false,
                threadPool: happyThreadPool,
                loaders: [
                    {
                        loader: 'babel-loader',
                        query: {
                            cacheDirectory: true,
                        }
                    }
                ]
            }),
            new BundleAnalyzerPlugin(),
        ];
    }
    return config;
}
