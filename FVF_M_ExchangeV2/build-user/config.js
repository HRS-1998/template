export default {
    appUrl: './', // 项目路径  如   /static/mobile/test/
    requirejs: [
        // {
        //     Entry: 'assets/js/app/', //文件入口文件夹
        //     Name: 'main.js' //入口
        // }
    ],
    envConfig: {
        development: {
            domainUrl: '',
            indexPath: ''
        },
        stable: {
            domainUrl: '',
            indexPath: '1505-stable'
        },
        dev: {
            domainUrl: '',
            indexPath: '1506-develop'
        },
        ctest: {
            domainUrl: '',
            indexPath: '1507-test'
        },
        pre: {
            domainUrl: '',
            indexPath: '2505-pre'
        },
        production: {
            domainUrl: '',
            indexPath: '80-static'
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
