import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { config } from '@/config/permission';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    component: () => import('@/views/home/index.vue'),
    meta: { config: config.home }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
