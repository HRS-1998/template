<template>
  <div class="activity">
    <div class="activity__main">
      <div class="btn-receive" @click="onReceive"></div>
      <rule />
    </div>
    <bind-phone :show="isShowBindPhone" @close="onClose" @bindafter="onBindAfter" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BindPhone from './BindPhone/index.vue';
import Rule from './Rule.vue';
import { toastText } from '@/assets/js/toast';

@Component({
  components: {
    BindPhone,
    Rule
  }
})
export default class Activity extends Vue {
  isShowBindPhone: boolean = false;

  // 领奖
  onReceive() {
    this.isShowBindPhone = true;
  }

  // 关闭
  onClose() {
    this.isShowBindPhone = false;
  }

  // 绑定手机后领奖
  onBindAfter() {
    this.onClose();
    // ...省略领奖逻辑
    toastText('优惠券领取成功');
  }
}
</script>

<style lang="scss">
.activity {
  padding-bottom: 100px;
  &__main {
    width: 100%;
    height: 1459px;
    @include bgimg-stretch('~@/assets/img/activity/activity-bg.jpg');
    overflow: hidden;
    .btn-receive {
      margin: 524px auto 0;
      @include wh(300px, 102px);
      @include bgimg-stretch('~@/assets/img/activity/btn-receive.png');
    }
  }
}
</style>
