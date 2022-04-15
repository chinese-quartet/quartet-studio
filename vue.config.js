const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const createThemeColorReplacerPlugin = require('./config/plugin.config')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function resolve(dir) {
  return path.join(__dirname, dir)
}

const isProd = process.env.NODE_ENV === 'production'

// vue.config.js
const vueConfig = {
  publicPath: isProd ? './' : '/',
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      }),
      // new BundleAnalyzerPlugin(),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true
            },
            mangle: true, // Note `mangle.properties` is `false` by default.
            module: false,
            output: {
              comments: false
            },
            toplevel: false,
            nameCache: null,
            ie8: false,
            keep_classnames: undefined,
            keep_fnames: false,
            safari10: false
          }
        })
      ],
      splitChunks: {
        cacheGroups: {
          g2: {
            name: 'chunk-g2',
            test: /[\\/]node_modules[\\/]@antv/,
            chunks: 'all',
            priority: 6,
            reuseExistingChunk: true,
            enforce: true
          },
          pdf: {
            name: 'chunk-pdf',
            test: /[\\/]node_modules[\\/]pdfjs-dist/,
            chunks: 'all',
            priority: 6,
            reuseExistingChunk: true,
            enforce: true
          },
          handsontable: {
            name: 'chunk-handsontable',
            test: /[\\/]node_modules[\\/]handsontable[\\/]/,
            chunks: 'all',
            priority: 6,
            reuseExistingChunk: true,
            enforce: true
          },
        }
      }
    }
  },

  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme
          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          // 'border-radius-base': '4px'
        },
        javascriptEnabled: true
      }
    },
    extract: true,
  },

  devServer: {
    // development server port 8000
    port: 3000
    // If you want to turn on the proxy, please remove the mockjs /src/main.js L11
    // proxy: {
    //   '/api': {
    //     target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
    //     ws: false,
    //     changeOrigin: true
    //   }
    // }
  },

  pages: {
    app: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['app', 'chunk-g2', 'chunk-pdf', 'chunk-handsontable']
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig