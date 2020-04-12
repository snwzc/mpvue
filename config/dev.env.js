var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"https://jinrongt.jihustore.com/"'
  // API_HOST: '"http://192.168.100.185:8080/"'
})
