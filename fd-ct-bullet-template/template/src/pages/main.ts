import { createApp } from 'vue';
import pinia from '@/stores/store';
import router from '@/router';
import '@/assets/css/common.scss';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import * as ElementPlusIconsVue from '@/assets/js/icon';
import { alias } from '@/config/permission';
import { clearEmptyData, showMessage, interceptErrorPublic } from '@/utils';
import { routerInit } from '@/assets/js/permission';
import type { ResponseInfo } from '@/types/common.d';
import App from './App.vue';
import {
  Search,
  SearchItem,
  Http,
  Permission,
  ListTemp,
  ListTempItem,
  Table,
  TableColumn,
  Input,
  TextareaContent,
  TransferTree
} from 'ct-dart3';

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app
  .use(pinia)
  .use(router)
  .use(ElementPlus, { size: 'small', zIndex: 3000, locale: zhCn })
  .use(ElementPlusIconsVue)
  .use(Search)
  .use(SearchItem)
  .use(ListTemp)
  .use(ListTempItem)
  .use(Table)
  .use(TableColumn)
  .use(Input)
  .use(TextareaContent)
  .use(TransferTree)
  .use(Http, {
    requestInterceptor(opts: any) {
      opts.params = clearEmptyData(opts.params);
      opts.data = clearEmptyData(opts.data);
    },
    interceptError(res: any) {
      interceptErrorPublic(res);
    },
    interceptorSuccess(res: ResponseInfo) {
      const data: any = JSON.parse(JSON.stringify(res).toLowerCase());

      // 对响应成功数据做点什么
      if (data.code !== 0) {
        showMessage(data.message);
      }
    },
    timeout: 60000,
    lowercasekey: true
  })
  .use(Permission, {
    //设置权限别名
    alias: alias(),
    router: router
  });

app.mount('#app');
routerInit(Permission);
