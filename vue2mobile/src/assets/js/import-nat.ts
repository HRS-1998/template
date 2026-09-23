import Vue from 'vue';
import { Http, AppBridge } from 'nat';
import type { ResponseInfo } from '@/types/common.d';

// 响应失败拦截器
const interceptError: any = function (res: ResponseInfo, config: any) {
  // 对响应失败数据做点什么
  // console.log(res, 'interceptError');

  if (window._dlk) {
    window._dlk.push({
      ec: 1010044,
      c: JSON.stringify(res), //内容
      s1: config.url, //接口地址
      s2: JSON.stringify(config.data), //接口参数
      s3: 'ajax' //类型
    });
  }

  Vue.prototype.$Toast.clear();
  if (res.Code === 555) {
    Vue.prototype.$dialog.alert({
      message: '服务器连接失败，请稍后再试(555)'
    });
  } else if (res.Code === 666) {
    Vue.prototype.$dialog.alert({
      message: '服务器连接超时，请稍后再试(666)'
    });
  }
};

// 响应成功拦截器
const interceptorSuccess: any = function (res: ResponseInfo, config: any) {
  // 对响应成功数据做点什么
  // console.log(res, 'interceptorSuccess');

  if (res.Code !== 0 && window._dlk) {
    window._dlk.push({
      ec: 1010044,
      c: JSON.stringify(res), //内容
      s1: config.url, //接口地址
      s2: JSON.stringify(config.data), //接口参数
      s3: 'ajax' //类型
    });
  }
};

// 请求拦截器 res: any
const requestInterceptor = function () {
  // 在发送请求之前做些什么
  // console.log(res, 'requestInterceptor');
};

// 方式一：组件注册时配置
Vue.use(Http, {
  interceptError: interceptError,
  interceptorSuccess: interceptorSuccess,
  requestInterceptor: requestInterceptor,
  timeout: 15000
});
Vue.use(AppBridge);
