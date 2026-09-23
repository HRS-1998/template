<template>
  <div id="app">
    <router-view></router-view>

    <!-- 底部tabbar -->
    <van-tabbar v-model="active" v-if="list.length > 0 && isShowFooter" @change="onChange">
      <van-tabbar-item v-for="(item, index) in list" :key="`tabbar-${index}`" :icon="item.icon">
        {{ item.name }}
      </van-tabbar-item>
    </van-tabbar>

    <!-- 通用异常弹窗 -->
    <pop-error />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import PopError from '@/views/index/Base/PopError.vue'; // 异常弹窗
import Constant from '@/router/constant';
import type { TypeAnyObject } from '@/types/common.d';

@Component({
  components: {
    PopError
  }
})
export default class App extends Vue {
  active: number = 0;
  list: Array<any> = [
    { name: '首页', icon: 'home-o' },
    { name: '规则', icon: 'description-o' },
    { name: '活动', icon: 'fire-o' }
  ];
  routerObj: TypeAnyObject = {
    0: Constant.HOME,
    1: Constant.RULE,
    2: Constant.ACTIVITY
  };

  get isShowFooter() {
    const notShowRouter = [Constant.GOODSDETAIL, Constant.RECORDLIST]; // 不显示的路由
    return !this.isIncludeRouter(notShowRouter);
  }

  @Watch('$route', { immediate: true })
  changeRouter() {
    this.setActiveIndex();
  }

  // 设置激活的下标
  setActiveIndex() {
    const values = Object.values(this.routerObj);
    const idx = values.findIndex((item) => `/${item}` === this.$route.path);
    this.active = idx < 0 ? 0 : idx;
  }

  isIncludeRouter(arr: Array<any>) {
    if (arr.indexOf((this as any).$route.name) > -1) {
      return true;
    }
    return false;
  }

  onChange(index: number) {
    const curRouter = this.routerObj[index];
    if (!curRouter) {
      return;
    }
    this.active = index;
    this.$router.push({
      name: curRouter
    });
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}

.van-tabbar-item--active {
  color: $ft-green-1;
}
</style>
