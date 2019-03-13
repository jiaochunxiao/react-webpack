const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
// 打开浏览器
const opn = require('opn');
const env = process.argv[2];
// 指定端口号
const port = process.argv[3] || 8080;
const generateConf = require('./generateConfig');

const compilerCallback = function (err, stats) {
    if (err) {
        throw err;
    }
    process.stdout.write(
        stats.toString({
            // webpack --colors
            colors: true,
            // 是否添加缓存（但未构建)模块的信息
            cached: false,
            // 添加模块构建信息
            modules: true,
            // 增加子级信息
            children: false,
            // 增加包信息（ false 能允许较少的冗长输出）
            chunks: false,
            // 是否将内置模块增加到包信息
            chunkModules: false
        }) + '\n\n'
    );

    if (stats.hasErrors()) {
        console.log('Build failed with errors.\n');
        process.exit(1);
    }
    console.log('Build complete.\n');
    console.log(
        'Tip: built files are meant to be served over an HTTP server.\n' +
        "Opening index.html over file:// won't work.\n"
    );
};
// 生成 webpack config 信息
const conf = generateConf(env, port);
// 构建
const compiler = webpack(conf);
if (env === 'dev') {
    WebpackDevServer.addDevServerEntrypoints(conf, conf.devServer);
    const serverConfig = conf.devServer;
    const host = serverConfig.host || 'localhost';
    const usePort = serverConfig.port || 8008;
    const server = new WebpackDevServer(compiler, serverConfig);
    // 启动 server 监听指定端口
    server.listen(usePort, host, function () {
        console.log(`服务已部署在${usePort}端口`);
        opn(`http://localhost:${usePort}`, {app: 'google chrome'});
    });
}
else {
    compiler.run(compilerCallback);
}
