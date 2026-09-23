<template>
  <van-dialog
    v-model="isShow"
    get-container="body"
    :className="['basedialog', clsname]"
    @close="close"
  >
    <i class="icon-close" @click="close" v-if="showClose"></i>
    <slot name="top">
      <div class="top"></div>
    </slot>
    <slot name="center"></slot>
    <slot name="bottom"></slot>
  </van-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';

@Component
export default class BaseDialog extends Vue {
  @Prop({ type: Boolean, default: false }) show!: boolean;
  @Prop({ type: Boolean, default: false }) showClose!: boolean;
  @Prop({ type: String, default: '' }) title!: string;
  @Prop({ type: String, default: '' }) clsname!: string;

  isShow: boolean = false;

  @Watch('show')
  onShow(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal) {
      this.isShow = this.show;
    }
  }

  @Emit()
  close() {}
}
</script>

<style lang="scss">
.basedialog {
  .van-dialog__header,
  .van-dialog__footer {
    display: none;
  }
}

.basedialog {
  padding-bottom: 38px;
  width: 620px; // 弹窗-宽
  .icon-close {
    z-index: 1;
    position: absolute;
    right: 5px;
    top: 5px;
    content: '';
    display: inline-block;
    @include wh(60px, 60px);
    @include bgimg-stretch('~@/assets/img/icon-close.png');
  }

  .top {
    padding-top: 38px;
    padding-bottom: 10px;
    font-weight: 500;
    line-height: 38px;
    text-align: center;
  }
}
</style>
