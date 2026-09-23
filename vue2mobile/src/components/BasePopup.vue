<template>
  <van-popup
    class="basepopup"
    round
    v-model="isShow"
    position="bottom"
    :style="{ height: height }"
    :closeable="true"
    :close-on-click-overlay="false"
    get-container="body"
    @close="close"
  >
    <div class="basepopup__title">
      <!-- <span>{{ title }}</span> -->
      {{ title }}
    </div>
    <slot name="center"></slot>
  </van-popup>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';

@Component
export default class BasePopup extends Vue {
  @Prop({ type: Boolean, default: false }) show!: boolean;
  @Prop({ type: String, default: '提示' }) title!: string;
  @Prop({ type: String, default: '30%' }) height!: string;

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
.basepopup {
  &__title {
    @include fc(42px, #010101);
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 150px;
    /* height: 174px;
    span {
      display: inline-block;
      height: 34px;
      line-height: 40px;
      margin-bottom: 40px;
    } */
  }
  .van-form {
    width: 85.3%;
    margin: 0 auto;
  }
}
</style>
