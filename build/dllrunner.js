const dllRunner = require('./webpack-dll');
const env = process.argv[2];

const vendors = ['react', 'react-dom', 'react-router-dom', 'axios'];

dllRunner(vendors, env).then(result => {
    console.log('Dll build success!');
}).catch(err => {
    console.log(err);
});
