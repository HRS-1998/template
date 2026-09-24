const buildConfig = require('./config');
import { globSync } from 'glob';
import { resolve } from 'path';
export type IEnv = 'stable' | 'dev' | 'ctest' | 'pre' | 'production' | 'development';

export const getEnvConfig = (viteEnv: IEnv) => {
  return buildConfig.envConfig[viteEnv as IEnv];
};

// 设置base
export const getBase = (viteEnv: IEnv) => {
  return viteEnv === 'development' ? '/' : getEnvConfig(viteEnv).domainUrl + buildConfig.appUrl;
};

interface IPageConfig {
  entry: string; //入口文件
  filename: string; //指定打包输出的index.html路径
  template: string; //模版页面
}
interface IPages {
  [key: string]: string;
}
const getMulu = function (filePath: string) {
  const newPath = filePath.replace(/\\/g, '/');
  const filename1 = newPath.substring(0, newPath.lastIndexOf('/'));
  const filename2 = filename1.substring(filename1.lastIndexOf('/') + 1);
  return filename2;
};
// 多页配置
export const getPages = () => {
  const pages: IPages = {
    //index: 'src/pages/index.html'
  };
  const rootIndexUrl = 'src/pages/index.html';
  const otherIndexUrl = 'src/pages/*/index.html';
  try {
    const indexFile = globSync(rootIndexUrl);
    if (indexFile.length > 0) {
      pages['index'] = resolve(__dirname, '../', rootIndexUrl);
    }
  } catch (e) {
    console.log(e);
  }

  try {
    const entryFiles = globSync(otherIndexUrl);
    entryFiles.forEach((filePath: string) => {
      const filename = getMulu(filePath);
      pages[filename] = resolve(__dirname, '../', filePath.replace(/\\/g, '/'));
    });
  } catch (e) {
    console.log(e);
  }
  //console.log('pages===', pages);
  return pages;
};
