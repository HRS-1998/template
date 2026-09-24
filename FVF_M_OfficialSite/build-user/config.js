export default {
    appUrl: '/', // 项目路径  如   /static/mobile/test/
    requirejs: [
        // {
        //     Entry: 'assets/js/app/', //文件入口文件夹
        //     Name: 'main.js' //入口
        // }
    ],
    envConfig: {
        development: {
            domainUrl: '//vsfun.nian30.cn:1505',
            indexPath: '',
            apkUrl: 'http://md01.tv108.cn:1505/1/1990001/123'
        },
        // 运维平台测试打包用stable-inner
        stable: {
            domainUrl: '',
            indexPath: '1505-stable',
            apkUrl: 'http://md01.tv108.cn:1505/1/1990001/123' // /工作室id/应用id/渠道id
        },
        dev: {
            domainUrl: 'vsfun.nian30.cn:1505',
            indexPath: '1505',
            apkUrl: 'http://md01.tv108.cn:1505/1/1990001/123'
        },
        ctest: {
            domainUrl: '//vsfun.com',
            indexPath: '1507-test',
            apkUrl: 'http://md01.tv108.cn:1505/1/1990001/123'
        },
        pre: {
            domainUrl: '//vsfun.com',
            indexPath: '2505-pre',
            apkUrl: 'http://md01.tv108.cn:2505/1/1990001/123'
        },
        production: {
            domainUrl: '',
            indexPath: '80-static',
            apkUrl: 'https://md01.fightfun.com/1/2000002/100002'
        }
    },

    devServer: {
        port: 1507, // 端口号
        host1: 'localhost', // 主机名1
        host2: 'a.admin.ct108.org', // 主机名2
        // host3: '0.0.0.0',
        proxy: {
            '/api': {
                // target: 'http://yapi.tcy365.org:3000/mock/2304', // 本地模拟数据服务器
                target: 'http://192.168.105.71:1505', // 本地模拟数据服务器
                changeOrigin: true
            }
        }
    }
};
