<template>
  <base-dialog
    title="选择支付方式"
    :show="isShow"
    :showClose="true"
    clsname="paydialog"
    @close="close"
  >
    <template v-slot:center>
      <pay
        :show="isShow"
        :goods-data="goodsData"
        @pay-alipay="handlePayAliPay"
        @pay-wechat="handlePayWechat"
      />
    </template>
  </base-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import BaseDialog from '@/components/BaseDialog.vue';
import Pay from '../Pay/index.vue';
import { createOrder } from '@/api/ajax/order';
import { getPayWay, dealResData } from './payway';
import { paramsFromUrl } from '@/assets/js/url-params';
import { showLoading, hideLoading, toastText } from '@/assets/js/toast';
import type { IGoodsData } from '@/types/index.d';
import type { ResponseInfo } from '@/types/common.d';

@Component({
  components: {
    BaseDialog,
    Pay
  }
})
export default class PayDialog extends Vue {
  @Prop({ type: Boolean, default: false }) show!: boolean;
  @Prop({
    type: Object,
    default: () => ({})
  })
  goodsDetail!: any;

  isShow: boolean = false;
  goodsData: IGoodsData = {
    goodsName: '',
    goodsPrice: 0
  };
  payway: any = {
    PayWayAlias: '',
    PayWayVersionNo: ''
  };
  payname: string = '';

  @Watch('show')
  onShow(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal) {
      this.isShow = this.show;
      newVal ? this.initGoodsData() : '';
    }
  }

  @Emit()
  close() {}

  @Emit()
  onPayClick() {
    console.log('点击了支付');
  }

  initGoodsData() {
    this.goodsData.goodsName = this.goodsDetail.GoodsName;
    this.goodsData.goodsPrice = this.goodsDetail.GoodsCurrency[0].CurrencyCounts;
  }

  handlePayAliPay() {
    this.payname = 'zfbpay';
    this.payway = getPayWay(this, 'zfb');
    this.apiCreateOrder();
  }

  handlePayWechat() {
    this.payname = 'wxpay';
    this.payway = getPayWay(this, 'wx');
    this.apiCreateOrder();
  }

  apiCreateOrder() {
    showLoading();
    createOrder().then((res: ResponseInfo) => {
      hideLoading();
      if (res.Code !== 0) {
        toastText(res.Message);
        return;
      }
      this.dealSuc(res);
    });
  }

  dealSuc(res: ResponseInfo) {
    // 如果是apk包的悬浮球，则使用当前页面进行支付
    if (paramsFromUrl().type === 'lyballapk') {
      this.doSdkPay(res);
      return;
    }

    const resData = dealResData(res.Data);
    window.parent.postMessage(
      JSON.stringify({
        act: 'couponshop',
        data: {
          resData: resData,
          payname: this.payname
        }
      }),
      '*'
    );
    this.onPayClick();
  }

  doSdkPay(res: ResponseInfo) {
    showLoading();
    // sdk支付时，确认支付的标识，1则表示支付宝支付，2则表示微信支付
    const payNumberMark = this.payname === 'wxpay' ? 2 : 1;
    const targetUrl = {
      payway: payNumberMark,
      orderInfo: res.Data.OrderInfo
    };

    console.log('apk包悬浮球充值数据', targetUrl);
    this.$nat.appBridge('tcy_payForProductForH5Game', targetUrl).then((r: any) => {
      console.log('支付回调', res);
      // 失败时，需要提示
      if (r.code === -1) {
        toastText(r.msg);
        return;
      }
      hideLoading();
      this.onPayClick();
    });
  }
}
</script>

<style lang="scss">
.paydialog {
  background-color: #ececf0;
  height: 530px;
  width: 620px;
}
</style>
