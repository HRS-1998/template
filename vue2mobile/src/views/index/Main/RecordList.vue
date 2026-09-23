<template>
  <div class="recordlist">
    <div class="recordlist__top">
      <i class="btn-back" @click="handleBack"></i>
      明&nbsp;&nbsp;细
    </div>

    <!-- 状态tab -->
    <div class="status-tabs">
      <base-tabs :active="statusActive" :tabList="statusList" @on-click="onClickStatusTabs" />
    </div>

    <!-- 价格tab -->
    <div class="price-tabs">
      <base-tabs
        type="card"
        :active="priceActive"
        :tabList="priceList"
        @on-click="onClickPriceTabs"
      >
        <template v-slot:title="{ title }">
          <i class="icon-gold"></i>
          <span class="name">{{ formatNumber(title.Name) }}</span>
        </template>
      </base-tabs>
    </div>

    <!-- 点卡列表 -->
    <base-card-list ref="baseCardList" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { cardStatusList, cardSalePriceList } from '@/api/ajax/card';
import BaseTabs from '@/components/BaseTabs.vue';
import BaseCardList from '../Base/BaseCardList.vue';
import { fmtNumber } from '@/assets/js/fmt-number';
import type { ResponseInfo } from '@/types/common.d';

interface ICardData {
  status: number;
  price: number;
}

@Component({
  components: {
    BaseTabs,
    BaseCardList
  }
})
export default class HomeMyCard extends Vue {
  statusActive: number = 0; // 选中状态的下标
  statusList: Array<any> = [];
  priceActive: number = 0; // 选中面值的下标
  priceList: Array<any> = [];
  cardData: ICardData = { status: -1, price: -1 };

  mounted() {
    this.init();
  }

  handleBack() {
    this.$router.go(-1);
  }

  async init() {
    // 获取状态枚举值
    const p1 = () => {
      return new Promise((resolve: any) => {
        cardStatusList().then((res: ResponseInfo) => {
          resolve(true);
          if (res.Code !== 0) {
            return;
          }
          this.statusList = res.Data;
          if (this.statusList.length > 0) {
            this.cardData.status = this.statusList[0].Value;
          }
        });
      });
    };

    // 获取面额枚举值
    const p2 = () => {
      return new Promise((resolve: any) => {
        cardSalePriceList().then((res: ResponseInfo) => {
          resolve(true);
          if (res.Code !== 0) {
            return;
          }
          this.priceList.length = 0;
          res.Data.PriceList.forEach((item: any, index: any) => {
            this.priceList.push({ Value: index, Name: item });
          });
          if (this.priceList.length > 0) {
            // 匹配默认的面额值
            const curSelectedIndex = res.Data.PriceList.findIndex((item: any) => {
              return item === res.Data.SelectPrice;
            });
            this.priceActive = curSelectedIndex < 0 ? 0 : curSelectedIndex;
            this.cardData.price = this.priceList[this.priceActive].Name;
          }
        });
      });
    };

    try {
      await p1();
      await p2();
      this.renderList(); // 初始化
    } catch (e) {
      console.log('e', e);
    }
  }

  renderList() {
    (this as any).$refs.baseCardList.init(this.cardData);
  }

  onClickStatusTabs(value: number) {
    this.cardData.status = this.statusList[value].Value;
    this.renderList();
  }

  onClickPriceTabs(value: number) {
    this.cardData.price = this.priceList[value].Name;
    this.renderList();
  }

  formatNumber(n: number) {
    return fmtNumber(n);
  }
}
</script>

<style lang="scss">
@mixin mlr() {
  margin-left: 1px;
  margin-right: 1px;
  box-sizing: border-box;
}

.recordlist {
  background-color: #f6f6f6;
  height: 100%;
  overflow: hidden;

  &__top {
    background-color: $ft-green-1;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    @include fc(38px, #fff);
    .btn-back {
      position: absolute;
      top: 16px;
      left: 20px;
      @include wh(60px, 60px);
      /* background-color: #00aa61; */
      border-radius: 40px;
      &::after {
        content: ' ';
        position: absolute;
        top: 8px;
        left: 8px;
        @include wh(30px, 30px);
        @include bgimg-stretch('~@/assets/img/icon-back.png');
      }
    }
  }

  .status-tabs {
    @include mlr();
    height: 90px;
    background-color: $ft-green-1;
    .van-tabs--line .van-tabs__wrap {
      height: 90px;
    }
    .van-tab {
      @include fc(24px, #5c5f5f);
      transition: all 0.15s ease;
      &--active {
        @include fc(30px, $ft-green-1);
        font-weight: 700;
      }
    }
    .van-tabs__line {
      @include wh(50px, 3px);
      background: $ft-green-1;
      border-radius: 1px;
    }
  }
  .price-tabs {
    @include mlr();
    height: 130px;
    overflow: hidden;
    .van-tabs {
      margin-top: 30px;
      margin-bottom: 30px;
      height: 70px;
      &__wrap {
        height: 70px;
      }
      &__nav--card {
        margin: 0;
        border: none;
        background-color: #f6f6f6;
        height: 70px;
        .van-tab {
          border-color: #fff;
          background-color: #fff;
          height: 70px;
          border-radius: 35px;
          @include fc(30px, #000000);
          transition: all 0.15s ease;
          &--active {
            border-color: $ft-green-1;
            background-color: $ft-green-1;
            @include fc(30px, #fff);
            font-weight: 700;
          }
          margin-right: 27px;
          &:first-child {
            margin-left: 30px;
          }
          .van-tab__text {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .icon-gold {
            margin-right: 8px;
            display: inline-block;
            @include wh(40px, 40px);
            @include bgimg-stretch('~@/assets/img/icon-gold.png');
          }
        }
      }
    }
  }
}
</style>
