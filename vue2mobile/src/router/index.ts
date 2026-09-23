import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/index/Main/Home.vue';
import GoodsDetail from '@/views/index/Main/GoodsDetail/index.vue';
import Activity from '@/views/index/Activity/index.vue';
import Constant from './constant';

Vue.use(VueRouter);

const routes = [
  {
    path: `/`,
    name: Constant.HOME, // 首页
    component: Home,
    meta: {
      title: '兑换商城'
    }
  },
  {
    path: `/${Constant.RULE}`,
    name: Constant.RULE, // 规则页
    component: () => import(/* webpackChunkName: "rule" */ '@/views/index/RuleText/index.vue'),
    meta: {
      title: '规则'
    }
  },
  {
    path: `/${Constant.GOODSDETAIL}/:id`,
    name: Constant.GOODSDETAIL, // 商品详情页
    component: GoodsDetail,
    meta: {
      title: '商品详情页'
    }
  },
  {
    path: `/${Constant.RECORDLIST}`,
    name: Constant.RECORDLIST, // 记录列表页
    component: () =>
      import(/* webpackChunkName: "recordlist" */ '@/views/index/Main/RecordList.vue'),
    meta: {
      title: '明细'
    }
  },
  {
    path: `/${Constant.ACTIVITY}`,
    name: Constant.ACTIVITY, // 活动
    component: Activity,
    meta: {
      title: '活动'
    }
  },
  {
    path: `*`,
    redirect: '/'
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
