const {merge} = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = merge(common, {
  mode: "production",
  devtool: "inline-source-map",
  watch: true
})
