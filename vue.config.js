let proxyObj = {};
const CompressionPlugin = require("compression-webpack-plugin");
// proxyObj['/ws'] = {
//     ws: true,
//     target: "wss://localhost"
// };
proxyObj['/'] = {
    ws: false,
    target: 'http://localhost',
    //target: 'http://10.10.114.5:8081',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}
module.exports = {
    publicPath: "",
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            return {
                plugins: [
                    new CompressionPlugin({
                        test: /\.js$|\.html$|\.css/,
                        threshold: 1024,
                        deleteOriginalAssets: false
                    })
                ]
            }
        }
    }
}
