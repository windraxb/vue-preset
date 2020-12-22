'use strict'

const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const pkg = require('./package.json')

const N = '\n'
const resolve = (dir) => {
  return path.join(__dirname, './', dir)
}

const isProd = () => {
  return process.env.NODE_ENV === 'production'
}

const genPlugins = () => {
  const plugins = []
  if (isProd()) {
    plugins.push(
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          ['js', 'css'].join('|')
          +')$'
        ),
        threshold: 10240,
        minRatio: 0.8,
        cache: true
      })
    )
  }

  return plugins
}

const getOptimization = () => {
  let optimization = {}
  if (isProd()) {
    optimization = {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log']
            }
          }
        })
      ]
    }
  }
  return optimization
}

module.exports = {
  publicPath: './',
  assetsDir: 'static',
  lintOnSave: !isProd(),
  productionSourceMap: false,
  css: {
    extract: isProd(),
    sourceMap: isProd(),
    loaderOptions: {}
  },
  configureWebpack: () => ({
    name: `${pkg.name}`,
    resolve: {
      alias: {
        '@': resolve('src'),
        '@components': resolve('src/components'),
        '@mixins': resolve('src/mixins'),
        '@filters': resolve('src/filters'),
        '@store': resolve('src/store'),
        '@views': resolve('src/views'),

        'services': resolve('src/services'),
        'variable': resolve('src/assets/style/variable.less'),
        'utils': resolve('node_modules/@windraxb/cloud-utils/dist/cloud-utils.esm'),
        'mixins': resolve('node_modules/@windraxb/common-less/commonless.less')
      }
    },
    plugins: genPlugins(),
    optimization: getOptimization()
  }),
  chainWebpack: (config) => {
    config.
      when(!isProd(),
        config => config.devtool('cheap-eval-source-map')
      )

    config
      .plugin('preload')
      .tap(args => {
        args[0].fileBlacklist.push(/runtime\./)
        return args
      })

    config
      .plugin('html')
      .tap(args => {
        args[0].minify = {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
        return args
      })

    config.module.
      rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhiteSpace = true
        return options
      })
      .end()

    config
      .when(isProd(),
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .use('script-ext-html-webpack-plugin', [{
              inline: /runtime\..*\.js$/
            }])
            .end()

          config
            .optimization
            .splitChunks({
              chunks: 'all',
              cacheGroups: {
                vendors: {
                  name: 'chunk-vendors',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial'
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'),
                  minChunks: 3,
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        })
  }
}
