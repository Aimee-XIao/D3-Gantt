module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://10.254.130.228:8097/',
        // target: 'http://10.255.203.160:9091/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/stat': {
        target: 'http://10.254.130.228:8097/',
        // target: 'http://10.255.1.5:9090/',
        changeOrigin: false,
        pathRewrite: {
          '^/stat': '/'
        }
      },
      '/aiis': {
        target: 'http://10.254.130.228:8097/',
        // target: 'http://10.255.203.160:9091/',
        // target: 'http://10.255.8.4:9091/',
        changeOrigin: false,
        pathRewrite: {
          '^/aiis': '/'
        }
      },
      '/other': {
        target: 'http://10.254.130.228:8097/',
        changeOrigin: true,
        pathRewrite: {
          '^/other': '/'
        }
      },
      '/mqtt': {
        target: 'http://10.254.130.47:9002/',
        changeOrigin: true,
        pathRewrite: {
          '^/mqtt': '/'
        }
      }
    },
  },
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/style/custom/var.global.scss";`
      }
    }
  }
}
