const path = require("path")
const copyPlug = require('copy-webpack-plugin')

module.exports = {
  mode: 'none',
  target: 'node',
  entry: {
    xtouchCompact: "./src/xtouchCompact/controller.ts"
  },
  output: {
    filename: "[name]/[name].js",
    path: "/Users/aubreyford/Documents/Bitwig Studio/Controller Scripts/",
    //path: path.resolve(__dirname, 'dist'),
    library: 'Controller',
    libraryExport: 'default'
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "awesome-typescript-loader"
      },
      {
        test: /\.js$/,
        use: "file-loader"
      }
    ]
  },
  plugins: [
    new copyPlug([
      {
        from: 'src/**/index.js',
        to: '[folder]/index.control.js',
        toType: 'template'
      }
    ])
  ]
}
