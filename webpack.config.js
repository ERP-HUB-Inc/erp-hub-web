var path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

var DIST_DIR = path.resolve(__dirname, "dist");
var SRC_DIR = path.resolve(__dirname, "src");

module.exports = {
    entry: SRC_DIR + "/index.js",
    output: {
        path: DIST_DIR + "/app",
        filename: "bundle.js"
    },
    node: {
       fs: "empty"
    },
    plugins: [
        new CleanWebpackPlugin(["dist"]),
        new HtmlWebpackPlugin({
            title: "POS",
            favicon: "./public/favicon.ico",
            template: "./public/index.html"
        })
    ],
    module: {
      rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ["react", "es2015", "stage-2"]
            }
        },
        {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }
      ]
    }
  };