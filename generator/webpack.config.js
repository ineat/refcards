const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');


let config = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "./dist/assets"),
        filename: "bundle.js"
    },
    devServer: {
        contentBase:path.resolve(__dirname, "public"),
        port:3000,
        publicPath:"/assets/",
        watchContentBase: true
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: '../git/assets', to: "public/git"   }
            ]
        })
    ],
    externals: {
        'fs':'require("fs")',
        'buffer': 'require("buffer")',
        'http': 'require("http")',
        'https': 'require("https")',
        'zlib': 'require("zlib")',
        'util': 'require("util")',
        'path': 'require("path")',
    }
}

module.exports = config;