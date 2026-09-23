import '@/assets/css/reset.css'; // 重置样式
import '@/assets/js/import-vant'; // 导入需要的vant的组件
import 'ts-polyfill';
import Vue from 'vue';
import App from './App.vue';
import Component from 'vue-class-component';
import router from '@/router/index';
import store from '@/store/index';
import '@/assets/js/import-nat'; // 导入nat组件

Vue.config.productionTip = false;

Component.registerHooks([
  'beforeRouteEnter', //进入路由之前
  'beforeRouteLeave', //离开路由之前
  'beforeRouteUpdate'
]);

new Vue({
  router,
  store,
  render: (h: any) => h(App)
}).$mount('#app');
