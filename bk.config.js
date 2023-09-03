const { resolve } = require('path');
const isProduction = process.env.NODE_ENV === 'production';
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
module.exports = {
  appConfig() {
    const config = {
      indexPath: './index.html',
      mainPath: './src/main.ts',
      // publicPath: '',
      // outputDir: __dirname + '/dist',// 打包输出目录
      assetsDir: '',
      devServer: {
        host: 'local.zhoulujun.net',
        port: 9013,
      }
    }
    if (isProduction) {
      Object.assign(config, {
        minChunkSize: 10000000,
        target: 'lib',
        needSplitChunks: false,
        classificatoryStatic: false,
        library: 'MonacoEditor', // 库名，在全局环境下被挂载在window下
      })
    }
    return config
  },
  configureWebpack(_webpackConfig) {
    webpackConfig = _webpackConfig;

    webpackConfig.resolve = {
      ...webpackConfig.resolve,
      symlinks: false,
      extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
      alias: {
        ...webpackConfig.resolve?.alias,
        // extensions: ['.js', '.jsx', '.ts', '.tsx'],
        '@': resolve(__dirname, './src'),
      },
    };
    webpackConfig.plugins.push(
      new MonacoWebpackPlugin({
        // available options are documented at
        // https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        languages: ['json']
      })
    )
    // debugger;
    // webpackConfig.stats = {
    //   ...webpackConfig.stats,
    //   children: true,
    // }
    // webpackConfig.module.rules.push(
    //   {
    //     test: /\.worker\.js$/,
    //     use: { loader: 'worker-loader' },
    //   },
    // )
    if (isProduction) {
      webpackConfig.entry = {
        index: './src/index.ts',
      }
      webpackConfig.externals = {
        'vue': 'vue',
        'monaco-editor': 'monaco-editor',
        'monaco-promql': 'monaco-promql',
        'bkui-vue': 'bkui-vue',
      }
      webpackConfig.output = {
        path: resolve(__dirname, './dist'),
        filename: '[name].js',
        publicPath: '',
        libraryTarget: 'umd',
      }
    }

  },
};
