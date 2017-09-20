const webpack = require('webpack'),
    path = require('path');

module.exports = {
    entry: __dirname + "/main.js", //已多次提及的唯一入口文件
    output: {
        path: __dirname + "/dist",
        //filename: "bundle-[hash].js"
        filename: "agile.ui.js"
    },
    devtool: 'none',
    module: {
        rules: [
            {
                test: /\.aui$/,
                use: {
                    loader: "aui-loader"
                }
            },
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: {
            'AuiComponent': path.join(__dirname, "./libs/AuiComponent.js")
        }
    },
    plugins: []
};