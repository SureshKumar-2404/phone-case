const path = require("path");

module.exports = {
  entry: {
    'root': "./src/main.jsx"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: "cart-tool-tip.bundle.js",
    path: path.resolve(__dirname, "assets")
  },
  devServer: {
    proxy: {
      '/product/data': {
        target: 'http://13.232.134.145:8006',
        changeOrigin: true,
        secure: false,
        pathRewrite: {'^/product/data': '/product/data'}
      },
      '/product/variant/img': {
        target: 'http://13.232.134.145:8006',
        changeOrigin: true,
        secure: false,
        pathRewrite: {'^/product/variant/img': '/product/variant/img'}
      }
    }
  }
};
