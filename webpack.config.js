var path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

var DIST_DIR = path.resolve(__dirname, "build");
var SRC_DIR = path.resolve(__dirname, "src");


module.exports = {
  entry: SRC_DIR + "/index.js?v=1238238",
  output: {
    path: DIST_DIR + "/",
    filename: "[name].[hash].js",
    publicPath: "/"
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  node: {
    fs: "empty"
  },
  plugins: [
    new Dotenv({path: "./.env.prod"}),
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      title: "POS",
      favicon: "./public/favicon.ico",
      template: "./public/index.html",
      chunksSortMode: "none",
      hash: true
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
      },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader",
          options: {
            includePaths: ["absolute/path/a", "absolute/path/b"]
          }
        }]
      },
      {
        test: /\.(woff(2)?|ttf|jpeg|eot|jpg|gif|png|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "fonts/",
          }
        }]
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    inline: false,
    port: 8008
  }
};
