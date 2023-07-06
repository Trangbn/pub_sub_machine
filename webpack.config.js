const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { RunScriptWebpackPlugin } = require("run-script-webpack-plugin");

module.exports = {
  entry: ["webpack/hot/poll?100", "./src/app.ts"],
  target: "node",
  externals: [
    nodeExternals({
      allowlist: ["webpack/hot/poll?100"],
    }),
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  mode: "development",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new RunScriptWebpackPlugin({
      name: "src/app.js",
      autoRestart: true,
    }),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "src/app.js",
    libraryTarget: "commonjs2",
  },
};
