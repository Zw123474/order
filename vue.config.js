const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const defaultSettings = require('./src/settings.js')
const port = process.env.port || process.env.npm_config_port || 9527 // dev port
const name = defaultSettings.title || '富阳工单' // page title
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '富阳工单'
        return args
      })
    // // set svg-sprite-loader
    // config.module
    //   .rule('svg')
    //   .exclude.add(resolve('src/icons'))
    //   .end()
    // config.module
    //   .rule('icons')
    //   .test(/\.svg$/)
    //   .include.add(resolve('src/icons'))
    //   .end()
    //   .use('svg-sprite-loader')
    //   .loader('svg-sprite-loader')
    //   .options({
    //     symbolId: 'icon-[name]'
    //   })
    //   .end()

  },
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  // lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    // overlay: {
    //   warnings: false,
    //   errors: true
    // },
    proxy: {
      '/api': {
        target: 'http://gongdan.java.68hanchen.com/api', // 接口地址的前缀
        // target: 'http://192.168.0.59:8281',// 接口本地地址
        changeOrigin: true, // 允许websockets跨域
        pathRewrite: {
          // '^/api': 'https://szwy.zjwsrc.com/admin'
          '^/api': ''
        }
      }
    },
  },
  // configureWebpack: {
  //   // provide the app's title in webpack's name field, so that
  //   // it can be accessed in index.html to inject the correct title.
  //   name: name,
  //   resolve: {
  //     alias: {
  //       '@': resolve('src')
  //     }
  //   }
  // },
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            'text-color': '#111',
            'border-color': '#eee',
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            hack: `true; @import "${path.join(__dirname, 'src/styles/theme.less')}";`
          }
        }
      }
    }
  },
  lintOnSave: false,
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {// 为生产环境修改配置...
      config.mode = 'production';
      config["performance"] = {//打包文件大小配置
        "maxEntrypointSize": 10000000,
        "maxAssetSize": 30000000
      }
    }
  }
})
