const path = require('path');
const glob = require('glob');
const buildConfig = require('./config');
const root = path.resolve(__dirname, '../src/pages/');

const getMulu = function (filePath) {
  const filename1 = filePath.substring(0, filePath.lastIndexOf('/'));
  const filename2 = filename1.substring(filename1.lastIndexOf('/') + 1);

  return filename2;
};

module.exports.getPages = function () {
  const entryFiles = glob.sync(root + '/*/main.ts');
  const map = {};

  entryFiles.forEach((filePath) => {
    const filename = getMulu(filePath);
    //let filenameStr = '';

    if (buildConfig.showPage.length > 0 && buildConfig.showPage.indexOf(filename) < 0) {
      return;
    }

    //map[filename] = entryRoot + filename + '/main.js';
    // if (buildConfig.isFile) {
    //   filenameStr = `dist/${filename}/index.html`;
    // } else {
    //   filenameStr = `dist/${filename}.html`;
    // }
    map[filename] = {
      // page 的入口
      entry: `src/pages/${filename}/main.ts`,
      // 模板来源
      template: `public/${filename}.html`,
      // 在 dist/index.html 的输出
      //filename: filenameStr,
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      //   chunks: ['chunk-vendors', 'chunk-common', filename],
      //inject: 'body',//<script>标签指定插入的位置 原本是head里面
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      }
    };
  });
  return map;
};
