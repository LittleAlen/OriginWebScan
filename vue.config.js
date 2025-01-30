const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
   outputDir: 'dist_electron',
    publicPath: './',
    devServer: {
      port: 8080,
      proxy: {
          // 可以根据需要添加代理配置，方便开发过程中跨域请求
      }
  }
})
