<template>
  <van-dialog
    class="payresult-container"
    v-model="isShow"
    title="未获取到支付信息"
    show-cancel-button
    cancelButtonText="取消支付"
    confirmButtonText="继续支付"
    @cancel="cancel"
    @confirm="confirm"
  >
    <p class="payresult__tip">
      未获取您的支付信息，若您放弃支付，请选择【取消支付】，若您想完成支付，请选择【继续支付】
    </p>
  </van-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

@Component
export default class PayResult extends Vue {
  @Prop({ type: Boolean, default: false }) show!: boolean;

  isShow: boolean = false;

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
}
</script>

<style lang="scss">
@import './index.scss';
</style>
