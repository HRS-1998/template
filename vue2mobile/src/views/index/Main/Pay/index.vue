<template>
  <div class="pay-container">
    <div class="pay">
      <!-- 头部 -->
      <div class="pay__header">选择支付方式</div>

      <!-- 商品信息 -->
      <div class="pay__info">
        <div class="pay__info--row pay__info--goods">商品名称：{{ productData.goodsName }}</div>
        <div class="pay__info--row">
          支付金额：
          <span class="pay__info--price">￥{{ productData.goodsPrice }}</span>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="pay__payway">
        <h4 class="pay__payway__title">支付方式</h4>

        <!-- 支付宝 -->
        <div class="pay__payway__row" @click="payAlipay">
          <img class="icon--pay" src="./img/icon-alipay.png" alt="" />
          <span>
            支付宝
            <img class="icon--recommend" src="./img/icon-recommend.png" alt="" />
          </span>
          <img class="icon--right" src="./img/icon-right.png" alt="" />
        </div>

        <!-- 微信 -->
        <div class="pay__payway__row" @click="payWechat">
          <img class="icon--pay" src="./img/icon-wechat.png" alt="" />
          <span>微信</span>
          <img class="icon--right" src="./img/icon-right.png" alt="" />
        </div>
      </div>

      <div class="pay__tip">适度娱乐，理性消费</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import type { IGoodsData } from '@/types/index.d';

@Component
export default class Pay extends Vue {
  @Prop({ type: Object, default: () => {} }) goodsData!: IGoodsData;
  @Prop({ type: Boolean, default: false }) show!: boolean;

  productData!: IGoodsData;

  @Watch('goodsData', { immediate: true, deep: true })
  onGoodsData(newVal: IGoodsData, oldVal: IGoodsData) {
    if (newVal !== oldVal) {
      this.productData = newVal;
    }
  }

  @Emit()
  payAlipay() {}

  @Emit()
  payWechat() {}
}
</script>

<style lang="scss">
@import './index.scss';
</style>
