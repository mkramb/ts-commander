#!/usr/bin/env node

const vorpal = require('vorpal')()
const merge = require('webpack-merge')
const onDeath = require('death')

const {
  resolveAppPath,
  requireIfExists
} = require('../utils/resolve')

const config = merge.smart(
  require('../config'),
  requireIfExists(resolveAppPath('app.config'))
)

require('../commands/build')(vorpal, config)
require('../commands/compile')(vorpal, config)

vorpal
  .delimiter('ts-commander ❯❯❯')
  .parse(process.argv)
  .show()

onDeath(() => {
  process.stdin.setRawMode(false)
  process.exit()
})