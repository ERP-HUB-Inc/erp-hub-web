var path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

var DIST_DIR = path.resolve(__dirname, "build");
var SRC_DIR = path.resolve(__dirname, "src");

module.exports = {
  entry: SRC_DIR + "/index.js?v=1238238", // Entry point with version query string
  mode: 'development',
  output: {
    path: DIST_DIR, // Ensure correct output directory
    filename: "[name].[hash].js", // Use hash for cache busting
    publicPath: "/" // Set the public path for asset serving
  },
  resolve: {
    alias: {
      '@components': path.resolve(SRC_DIR, 'components'),
      '@layout': path.resolve(SRC_DIR, 'layout'),
      '@helper': path.resolve(SRC_DIR, 'helper'),
      '@enums': path.resolve(SRC_DIR, 'enums'),
      '@router': path.resolve(SRC_DIR, 'router'),
      '@services': path.resolve(SRC_DIR, 'services'),
      '@themes': path.resolve(SRC_DIR, 'themes'),
      '@common': path.resolve(SRC_DIR, 'app/modules/common'),
      '@dashboards': path.resolve(SRC_DIR, 'pages/Dashboard'),
      '@sales': path.resolve(SRC_DIR, 'pages/Sales'),
      '@purchases': path.resolve(SRC_DIR, 'pages/Purchasing'),
      '@inventories': path.resolve(SRC_DIR, 'pages/Inventory'),
      '@finances': path.resolve(SRC_DIR, 'pages/Finance'),
      '@reports': path.resolve(SRC_DIR, 'pages/Reports'),
      '@settings': path.resolve(SRC_DIR, 'pages/Setting'),
      '@redux': path.resolve(SRC_DIR, 'redux')
    }
  },
  optimization: {
    splitChunks: {
      chunks: "all" // Split common code into separate bundles
    }
  },
  plugins: [
    new Dotenv({ path: "./.env" }), // Loads environment variables from .env file
    new HtmlWebpackPlugin({
      title: "ERP HUB", // Title for HTML
      favicon: "./public/favicon.ico", // Favicon path
      template: "./public/index.html", // HTML template
      chunksSortMode: "none", // Keep the order of scripts as in the template
      hash: true // Add a hash to script files for cache busting
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/, // Process JavaScript files
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/, // Process CSS files
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/, // Process SCSS files
        use: [
          "style-loader", // Inject styles into the DOM
          "css-loader",   // Resolve CSS imports
          {
            loader: "sass-loader", // Compile SCSS to CSS
            options: {
              includePaths: ["absolute/path/a", "absolute/path/b"] // Add custom paths for SCSS
            }
          }
        ]
      },
      {
        test: /\.less$/, // Process LESS files
        use: [
          "style-loader", // Inject styles
          "css-loader",   // Resolve CSS imports
          {
            loader: "less-loader", // Compile LESS to CSS
            options: {
              modifyVars: {
                'primary-color': '#1DA57A', // Example customization of Ant Design
                'link-color': '#1DA57A',
                'border-radius-base': '2px'
              },
              javascriptEnabled: true // Enable JavaScript inside LESS
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|jpg|jpeg|png|gif)$/i, // Process font and image files
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]' // Specify output folder and file naming
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true, // Support for React Router's history API
    compress: true, // Enable gzip compression for assets
    hot: true, // Enable Hot Module Replacement
    port: 3000 // Port for the development server
  }
};

