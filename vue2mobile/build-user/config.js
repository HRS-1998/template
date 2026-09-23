module.exports = {
  appUrl: '/static/tcy365-webtest/tsdemo2011/', // 项目路径  如   /static/mobile/test/
  envConfig: {
    development: {
      domainUrl: '',
      indexPath: ''
    },
    stable: {
      domainUrl: '//innerstatic.tcy365.com',
      indexPath: '1505-stable'
    },
    dev: {
      domainUrl: '//static.tcy365.org:1506',
      indexPath: '1506-develop'
    },
    ctest: {
      domainUrl: '//teststatic.tcy365.com',
      indexPath: '1507-test'
    },
    pre: {
      domainUrl: '//prestatic.tcy365.com',
      indexPath: '2505-pre'
    },
    production: {
      domainUrl: '//static.tcy365.com', // http://doc.uc108.org:8002/web/#/168/16571 查看类型
      indexPath: '80-static'
    }
  },
  px2rem: {
    //rootValue: 100, //已经自动计算 vant 50  其他 100
    propList: ['*'],
    selectorBlackList: ['van-circle__layer', 'van-dialog'],
    minPixelValue: 1 //小于1px的不转换
  },
  isFile: false, //是否使用文件夹
  showPage: [], //["weixin", "sdw"]
  devServer: {
    //history server 模式
    // historyApiFallback: {
    //     rewrites: [
    //         {
    //             from: /.*/g,
    //             to: '/dest/game/index.html'
    //         }
    //     ]
    // },
    historyApiFallback: true,
    allowedHosts: 'all',
    port: 1506, // 端口号
    https: false,
    //open: true, // 配置自动启动浏览器
    //openPage: 'index.html',
    // 配置多个代理
    proxy: {
      '/api': {
        target: 'http://yapi.tcy365.org:3000/mock/1909', // 本地模拟数据服务器
        changeOrigin: true,
        logLevel: 'debug' //是否输出请求log
      }
    }
  }
};
