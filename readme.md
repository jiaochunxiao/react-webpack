## React-startkit

react项目脚手架


### webpack 打包配置

+ 开发环境

1、配置dllrunner.js vendors，将需要打包的公共文件放入vendors，执行 yarn devDll/npm run devDll;
*步骤一只在未生成 vendors.js 时，执行一次。如果未添加新的公共文件，无需重复打包编译*
2、执行 yarn dev/npm run dev，进行打包构建，并实时编译。

+ 生产环境

1、yarn prodDll/npm run prodDll;
2、yarn prod;
