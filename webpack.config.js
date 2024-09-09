var webpack = require("webpack"),
  path = require("path"),
  // fileSystem = require("fs-extra"),
  env = require("./utils/env"),
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  TerserPlugin = require("terser-webpack-plugin");
var { CleanWebpackPlugin } = require("clean-webpack-plugin");
var ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
var ReactRefreshTypeScript = require("react-refresh-typescript");

// const ASSET_PATH = process.env.ASSET_PATH || "/";
const isDevelopment = process.env.NODE_ENV !== "production";

var options = {
  entry: {
    popup: path.join(__dirname, "src", "entries", "Popup", "index.tsx"),
    background: path.join(
      __dirname,
      "src",
      "entries",
      "Background",
      "index.ts"
    ),
    contentScript: path.join(
      __dirname,
      "src",
      "entries",
      "Content",
      "index.ts"
    ),
    content: path.join(__dirname, "src", "entries", "Content", "content.ts"),
    sidePanel: path.join(__dirname, "src", "entries", "SidePanel", "index.tsx"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
    // publicPath: ASSET_PATH,
  },
  resolve: {
    symlinks: false,
    fallback: {
      vm: require.resolve("vm-browserify"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      url: require.resolve("url/"),
      http: require.resolve("stream-http"),
      process: require.resolve("process/browser"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: [
          {
            loader: require.resolve("ts-loader"),
            options: {
              getCustomTransformers: () => ({
                before: [isDevelopment && ReactRefreshTypeScript()].filter(
                  Boolean
                ),
              }),
              transpileOnly: isDevelopment,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        // look for .css or .scss files
        test: /\.(css|scss)$/,
        // in the `src` directory
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new CleanWebpackPlugin({ verbose: false }),
    new webpack.ProgressPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    // new webpack.EnvironmentPlugin(["NODE_ENV"]),
    // new ExtReloader({
    //   manifest: path.resolve(__dirname, "src/manifest.json")
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/manifest.json",
          to: path.join(__dirname, "build"),
          force: true,
          transform: function (content, path) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              })
            );
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "entries", "Popup", "index.html"),
      filename: "popup.html",
      chunks: ["popup"],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(
        __dirname,
        "src",
        "entries",
        "SidePanel",
        "index.html"
      ),
      filename: "sidePanel.html",
      chunks: ["sidePanel"],
      cache: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "node_modules/tlsn-js/build",
          to: path.join(__dirname, "build"),
          force: true,
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.join(__dirname, "src", "assets"), to: "assets" }],
    }),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ].filter(Boolean),
  infrastructureLogging: {
    level: "info",
  },
  devServer: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
};

if (isDevelopment) {
  options.devtool = "cheap-module-source-map";
} else {
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  };
}

module.exports = options;
