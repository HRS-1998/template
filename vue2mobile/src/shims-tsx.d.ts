import Vue, { VNode } from 'vue';
import VueRouter, { Route } from 'vue-router';

declare global {
  namespace JSX {
    type Element = VNode;
    type ElementClass = Vue;
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
  interface Window {
    HtmlInterface: any;
    _dlk: any;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $route: Route;
    $router: VueRouter;
    $nat: any;
  }
}
