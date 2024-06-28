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
        target: 'https://caseusshopify.enactstage.com/caseusapi',
        changeOrigin: true,
        secure: false,
        pathRewrite: {'^/product/data': '/product/data'}
      },
      '/product/variant/img': {
        target: 'https://caseusshopify.enactstage.com/caseusapi',
        changeOrigin: true,
        secure: false,
        pathRewrite: {'^/product/variant/img': '/product/variant/img'}
      }
    }
  }
};
