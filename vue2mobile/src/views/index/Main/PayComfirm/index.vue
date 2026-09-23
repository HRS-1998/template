<template>
  <van-dialog
    class="paycomfirm-container"
    v-model="isShow"
    title="提示"
    show-cancel-button
    cancelButtonText="取消"
    confirmButtonText="确定"
    @cancel="cancel"
    @confirm="handleConfirm"
  >
    <p class="paycomfirm__tip">是否完成支付？</p>
  </van-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { searchOrder } from '@/api/ajax/order';
import { eventBus } from '@/assets/js/event-bus';
import { showLoading, toastText } from '@/assets/js/toast';

@Component
export default class PayComfirm extends Vue {
  @Prop({ type: Boolean, default: false }) show!: boolean;

  isShow: boolean = false;
  timer: any; // 定查询订单时器
  count: number = 0; // 查询订单次数

  @Watch('show')
  onShow(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal) {
      this.isShow = this.show;
    }
  }

  @Emit()
  cancel() {}

  @Emit()
  confirm() {}

  handleConfirm() {
    showLoading();
    this.timer = setInterval(() => {
      this.count++;
      this.searchOrderStatus();
    }, 2000);
  }

  searchOrderStatus() {
    searchOrder().then((res: any) => {
      this.confirm();
      if (res.Code !== 0) {
        toastText(res.Message);
        return;
      }
      // 购买成功
      if (res.Data === 1) {
        toastText('购买成功');
        eventBus.emit('loadGoodsInfo');
        clearInterval(this.timer);
        this.count = 0;
        return;
      }
      if (res.Data !== 15) {
        toastText(res.Message);
        return;
      }
      // res.Data=15表示等待付款：如果是识别到是的付款，则进行3次查询
      if (this.count === 3) {
        clearInterval(this.timer);
        this.count = 0;
        toastText(res.Message);
      } else {
        showLoading();
      }
    });
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
