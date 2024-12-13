const { defineConfig } = require('@vue/cli-service')
//const WorkerPlugin = require('worker-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      // preload: { preload: 'src/preload.js', preload2: 'src/preload2.js' }
      builderOptions: {
        // appId: 'com.example.origin',  // 应用 ID
        // productName: 'Origin',  // 产品名称
        // win: {
        //   target: ['nsis'],  // Windows 安装程序的打包目标
        // },
        // mac: {
        //   category: 'public.app-category.utilities',  // macOS 应用分类
        // },
        // linux: {
        //   target: ['AppImage', 'deb'],  // Linux 的打包目标
        // },
        // files: [
        //   'src/**/*',  // 需要打包的文件
        //   'log/*', 
        // ]
      }
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
