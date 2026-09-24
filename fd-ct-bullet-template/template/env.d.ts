/// <reference types="vite/client" />
//解决无法找到模块的bug
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module 'gulp';
