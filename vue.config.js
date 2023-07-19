const { defineConfig } = require('@vue/cli-service')
//const WorkerPlugin = require('worker-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js'
      // preload: { preload: 'src/preload.js', preload2: 'src/preload2.js' }
    }
  },
  devServer: {
    client: {
      overlay: {
          runtimeErrors: false,
      },
    },
  },
  // configureWebpack: {
  //   plugins: [new WorkerPlugin()]
  // }
})
