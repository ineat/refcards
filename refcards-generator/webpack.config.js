const webpack = require("webpack");
const path = require("path");

let config = {
    entry: "index.js",
    output: {
        path: path.resolve(__dirname, "./public"),
        filename: "public/bundle.js"
    }
}

module.exports = config;