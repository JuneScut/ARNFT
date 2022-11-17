const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "source-map",
  resolve: {
    // 定义别名
    alias: {
      "@": path.resolve(__dirname, "src"),
      "~": path.resolve(__dirname, "node_modules"),
    },
    // 当你加载一个文件的时候,没有指定扩展名的时候，会自动寻找哪些扩展名
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?/,
        loader: "ts-loader",
        options: {
          transpileOnly: true, //只编译不检查
          compilerOptions: {
            module: "es2015",
          },
        },
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: "url-loader",
            options: {
              // 图片低于 10k 会被转换成 base64 格式的 dataUrl
              limit: 10 * 1024,
              // [hash] 占位符和 [contenthash] 是相同的含义
              // 都是表示文件内容的 hash 值，默认是使用 md5 hash 算法
              name: "[name].[contenthash].[ext]",
              // 保存到 images 文件夹下面
              outputPath: "images",
            },
          },
        ],
      },
      {
        // i 后缀忽略大小写
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    // 热更新
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
    static: "./dist",
    // contentBase: path.join(__dirname, "dist"),
    open: true,
    port: 3000,
    historyApiFallback: {
      // browserHistory的时候，刷新会报404. 自动重定向到index.html
      index: "./index.html",
    },
  },
};
