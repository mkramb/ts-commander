const webpack = require('webpack')
const { pipe } = require('ramda')
const { addCommand } = require('../lib/vorpal')

const options = (vorpal) => {
  return vorpal
    .option('--prod', 'run in production mode')
    .option('--watch', 'start file watcher')
}

const action = (config, options, callback) => {
  if (options.prod) {
    config.webpack.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        comments: false
      })
    )
  }

  execute(config.webpack, options.watch, callback, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.error(
        stats.toJson({}, true)
      )
    }
  })
}

const execute = (config, shouldWatch, callback, onChange) => {
  if (shouldWatch) {
    webpack(config).watch({
      agregateTimeout: 300,
      poll: 1000
    }, onChange)
  }
  else {
    webpack(config, pipe(
      onChange,
      callback
    ))
  }
}

module.exports = addCommand({
  name: 'build', 
  description: 'build project bundle'
}, options, action)
