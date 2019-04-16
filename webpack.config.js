const path = require("path")

module.exports = {
  mode: 'none',
  target: 'node',
  entry: {
    xtouchCompact: "./src/xtouchCompact/controller.ts"},
  output: {
    filename: "[name]/[name].control.js",
    //path: "/Users/aubreyford/Documents/Bitwig Studio/Controller Scripts/[name]"
    path: path.resolve(__dirname, 'disttest')
  },
  resolve: {
    extensions: [".ts"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "awesome-typescript-loader"
      }
    ]
  }
}
