const webpack = require("webpack");
const path = require("path");

let config = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "./public"),
        filename: "bundle.js"
    },
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