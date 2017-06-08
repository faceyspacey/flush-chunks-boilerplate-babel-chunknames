const path = require('path')
const webpack = require('webpack')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')

module.exports = {
  name: 'client',
  target: 'web',
  devtool: 'source-map',
  entry: [path.resolve(__dirname, '../src/index.js')],
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '../build'),
    publicPath: '/static/'
  },
  module: {
    rules: [
      {
        // the client needs `css-modules-transform` removed from the babelrc
        // since `ExtractCssChunks` handles css transformation:
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['es2015', 'react', 'stage-2'],
            plugins: [] // notice 'css-modules-transform' is not here
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractCssChunks.extract({
          use: {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          }
        })
      }
    ]
  },
  plugins: [
    new StatsPlugin('stats.json'),
    new ExtractCssChunks(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].[chunkhash].js',
      minChunks: Infinity
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        screw_ie8: true,
        comments: false
      },
      sourceMap: true
    })
  ]
}
