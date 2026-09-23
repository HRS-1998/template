const buildConfig = require('./build-user/config');
const buildTool = require('./build-user/tool');
const IS_PROD = process.env.NODE_ENV !== 'development';
const tsImportPluginFactory = require('ts-import-plugin');
const webpackMerge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  //lintOnSave: true,
  parallel: false,
  publicPath: IS_PROD
    ? buildConfig.envConfig[process.env.VUE_APP_ENV]['domainUrl'] + buildConfig.appUrl
    : '/',
  pages: buildTool.getPages(),
  outputDir: 'dist',
  assetsDir: 'assets',
  productionSourceMap: false,
  css: {
    extract: IS_PROD, // 允许生成 CSS source maps?
    sourceMap: false, // pass custom options to pre-processor loaders. e.g. to pass options to // sass-loader, use { sass: { ... } }
    //requireModuleExtension: false,
    loaderOptions: {
      scss: {
        // 向全局sass样式传入共享的全局变量 （新版本sass-loader的参数改变）
        additionalData: `@import "~@/assets/scss/index.scss";`
      }
    }
  },
  // 所有 webpack-dev-server 的选项都支持。
  devServer: buildConfig.devServer,
  chainWebpack: (config) => {
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap((options) => {
        options = webpackMerge.merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: true
              })
            ]
          }),
          compilerOptions: {
            module: 'es2015'
          }
        });
        return options;
      });
  },
  configureWebpack: (config) => {
    if (IS_PROD) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: '../report.html'
        })
      );
    }
  }
};
