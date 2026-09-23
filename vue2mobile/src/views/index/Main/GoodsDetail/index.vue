<template>
  <div class="goodsdetail">
    <div class="goodsdetail__content">
      <!-- 头部 -->
      <div class="goodsdetail__top">
        <i class="btn-back" @click="handleBack"></i>
        <div class="goodsdetail__top-img">
          <img :src="goodsDetail.GoodsImagePath" alt="" v-if="goodsDetail.GoodsImagePath !== ''" />
        </div>
        <div class="goodsname">{{ goodsDetail.GoodsDisplayName }}</div>
        <div class="goodsprice">
          <span>{{ goodsDetail.GoodsCurrency[0].CurrencyCounts }}</span>
          <template v-if="isCashBuy">元</template>
          <template v-else>礼券</template>
        </div>
        <div class="fc">剩余 {{ count }} 件</div>
      </div>

      <!-- 中间 -->
      <div class="goodsdetail__center">
        <h3 class="goodstitle">商品描述</h3>
        <div class="goodsdec" v-html="goodsDetail.Description"></div>
      </div>
    </div>

    <!-- 底部 -->
    <div class="goodsdetail__bottom">
      <template v-if="isCashBuy">
        <base-btn name="立即购买" class="base-btn--normal" @on-click="handleBuy" />
      </template>
      <template v-else>
        <base-btn name="立即领取" class="base-btn--normal" @on-click="handleReceive" />
      </template>
    </div>

    <!-- 支付弹窗 -->
    <pay-dialog
      :show="isShowPay"
      :goodsDetail="goodsDetail"
      @close="isShowPay = false"
      @on-pay-click="onPayClick"
    />

    <!-- 支付确认弹窗 -->
    <pay-comfirm
      :show="isShowPayComfirm"
      @cancel="onPayComfirmCancel"
      @confirm="onPayComfirmConfirm"
    />

    <!-- 支付结果弹窗 -->
    <pay-result :show="isShowPayResult" @cancel="onPayResultCancel" @confirm="onPayResultConfirm" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
import PayDialog from '../PayDialog/index.vue';
import PayComfirm from '../PayComfirm/index.vue';
import PayResult from '../PayResult/index.vue';
import BaseBtn from '@/views/index/Base/BaseBtn.vue';
import { getGoodsInfo, directExchange } from '@/api/ajax/goods';
import { isiOS } from '@/utils';
import Constant from '@/router/constant';
import { CODE, CODE_TEXT } from '@/config/code';
import { eventBus } from '@/assets/js/event-bus';
import { toastText } from '@/assets/js/toast';
import type { ResponseInfo } from '@/types/common.d';

@Component({
  components: {
    PayDialog,
    PayComfirm,
    PayResult,
    BaseBtn
  },
  computed: {
    ...mapState(['cacheGoodsDetail'])
  }
})
export default class GoodsDetail extends Vue {
  goodsDetail: any = {
    GoodsImagePath: '', // 图片路径
    RemainStock: 0, // 库存
    GoodsCurrency: [
      {
        CurrencyType: 0, // 货币类型：6=礼券，100=人民币
        CurrencyCounts: 0 // 扣除数量，即价格
      }
    ]
  }; // 商品详情
  count: number = 0; // 剩余数量
  isCashBuy = false; // 是否人民币购买：true=是（人民币购买），false=否（礼券兑换）
  isShowPay: boolean = false; // 是否显示支付弹窗
  isShowPayComfirm: boolean = false; // 是否显示支付确认弹窗
  isShowPayResult: boolean = false; // 是否显示支付结果弹窗

  @Watch('$route', { immediate: true }) // route: Route
  onRouter() {
    this.loadGoodsInfo();
  }

  mounted() {
    eventBus.on('loadGoodsInfo', () => {
      this.loadGoodsInfoAjax();
    });
  }

  handleBack() {
    // 兼容处理：108社区的ios端打开外部浏览器后切回到客户端，路由回退异常，所以特殊处理下
    if (document.referrer !== '' && document.referrer.indexOf('108sq') > -1 && isiOS()) {
      this.$router.push({ name: Constant.HOME });
      return;
    }
    this.$router.go(-1);
  }

  loadGoodsInfo() {
    this.goodsDetail = (this as any).cacheGoodsDetail;
    this.count = this.goodsDetail.RemainStock; // 剩余数量
    this.isCashBuy = this.goodsDetail.GoodsCurrency[0].CurrencyType === 100; // CurrencyType货币类型：6=礼券，100=人民币
  }

  loadGoodsInfoAjax() {
    const _params = {
      GoodsId: Number(this.$route.params.id)
    };
    getGoodsInfo(_params).then((res: ResponseInfo) => {
      if (!(res.Code === 0)) {
        toastText(res.Message);
        return;
      }
      this.goodsDetail = res.Data;
      this.count = this.goodsDetail.RemainStock; // 剩余数量
      this.isCashBuy = this.goodsDetail.GoodsCurrency[0].CurrencyType === 100; // CurrencyType货币类型：6=礼券，100=人民币
    });
  }

  // 立即兑换
  handleReceive() {
    directExchange().then((res: ResponseInfo) => {
      if (res.Code === 0) {
        toastText('领取成功');
        this.loadGoodsInfoAjax();
        return;
      }

      if (res.Code === CODE.GIFT_NOT_ENOUGH) {
        toastText(CODE_TEXT[CODE.GIFT_NOT_ENOUGH]);
        return;
      }
      toastText(res.Message || '服务异常，请稍后重试');
    });
  }

  // 立即购买
  handleBuy() {
    this.isShowPay = true;
  }

  onPayClick() {
    this.isShowPay = false;
    this.isShowPayComfirm = true;
  }

  onPayComfirmCancel() {
    this.isShowPayComfirm = false;
  }

  onPayComfirmConfirm() {
    this.isShowPayComfirm = false;
    this.isShowPayResult = true;
  }

  onPayResultCancel() {
    this.isShowPayResult = false;
  }

  onPayResultConfirm() {
    this.isShowPayResult = false;
    this.isShowPayComfirm = true;
  }

  beforeDestroy() {
    eventBus.off('loadGoodsInfo');
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
