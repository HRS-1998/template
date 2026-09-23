<template>
  <div class="homelist">
    <template>
      <goods-list
        title="直接购买"
        unit="元"
        :list-data="goodsListByCash"
        :loading="isLoading"
        @go-detail="goDetail"
      />
    </template>

    <goods-list
      title="礼券兑换"
      unit="礼券"
      :list-data="goodsListByGift"
      :loading="isLoading"
      @go-detail="goDetail"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapMutations } from 'vuex';
import GoodsList from './GoodsList.vue';
import { getGoodsList } from '@/api/ajax/goods';
import Constant from '@/router/constant';
import { toastText } from '@/assets/js/toast';

@Component({
  components: {
    GoodsList
  },
  methods: {
    ...mapMutations(['updateState'])
  }
})
export default class HomeCenter extends Vue {
  goodsListByCash: Array<any> = []; // 商品数据（人民币购买）
  goodsListByGift: Array<any> = []; // 商品数据（礼券购买）
  isLoading: boolean = false; // 是否在加载数据

  mounted() {
    this.initGoodsList();
  }

  initGoodsList() {
    this.isLoading = true;
    getGoodsList({ guide: 123 })
      .then((res: any) => {
        this.isLoading = false;
        if (res.Code !== 0) {
          toastText(res.Message);
          return;
        }

        res.Data.GoodsGroupDetails.forEach((item: any) => {
          // CurrencyType货币类型： 6-礼券，100-人民币
          if (item.GoodsCurrency[0].CurrencyType === 100) {
            this.goodsListByCash.push(item);
          } else {
            this.goodsListByGift.push(item);
          }
        });
      })
      .catch(() => {
        this.isLoading = false;
      });
  }

  goDetail(item: any) {
    (this as any).updateState({ cacheGoodsDetail: item }); // store存储
    // (this as any).updateState({ errorPop: { isShow: true, text: '异常了' } });  // 本地测试弹窗使用
    this.$router.push({
      name: Constant.GOODSDETAIL,
      params: { id: item.GoodsId }
    });
  }
}
</script>

<style lang="scss">
.homelist {
  width: 100%;
  padding: 20px 40px;
  box-sizing: border-box;
}
</style>
