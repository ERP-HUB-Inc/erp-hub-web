var path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

var DIST_DIR = path.resolve(__dirname, "dist");
var SRC_DIR = path.resolve(__dirname, "src");

module.exports = {
    entry: SRC_DIR + "/index.js",
    output: {
        path: DIST_DIR + "/app",
        filename: "bundle.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
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