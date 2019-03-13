const webpack = require('webpack');
const path = require('path');

module.exports = function(vendors = [], env) {
    let entryOpts = vendors instanceof Array ? {vendors} : vendors;
    const options = {
        entry: entryOpts,
        output: {
            path: path.join(__dirname, '../dist/'),
            filename: '[name].js',
            library: '[name]'
        },
        plugins: [
            new webpack.DllPlugin({
                context: __dirname,
                path: path.join(__dirname, 'manifest.json'),
                name: '[name]'
            })
        ],
        mode: 'development'
    };

    if (env !== 'dev') {
        options.mode = 'production';
    }
    return new Promise((resolve, reject) => {
        webpack(options, function(err, stats) {
            if (err) {
                throw err;
            }
            process.stdout.write(
                stats.toString({
                    colors: true,
                    cached: false,
                    modules: true,
                    children: false,
                    chunks: false,
                    chunkModules: false
                }) + '\n\n'
            );
            
            if (stats.hasErrors()) {
                console.log('Build Dll failed with errors.\n');
                process.exit(1);
                reject();
            }
            console.log('Build Dll complete.\n');
            resolve();
            
        });
    })
};
