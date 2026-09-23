<template>
  <div class="homeheader">
    <div class="homeheader__top" v-show="expiredCount > 0">
      提示：您有{{ expiredCount }}张礼券将于{{ expiredMonth }}月01日过期
    </div>

    <div class="homeheader__info">
      <div class="left">
        <div class="my-giftcoupon">
          <span class="ft-1">我的礼券</span>
          <router-link :to="recordListPage" class="ft-2">明细&nbsp;></router-link>
        </div>
        <div class="giftcoupon-count">{{ fmtNum(giftCoupon) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getLeftNum, getExpireNum } from '@/api/ajax/activity';
import Constant from '@/router/constant';
import { thousandSeparator } from '@/assets/js/fmt-number';

@Component
export default class HomeHeader extends Vue {
  expiredMonth: number | string = 0; // 过期月份
  expiredCount: number = 0; // 过期的数量
  giftCoupon: number | string = '--'; // 礼券数量

  get recordListPage() {
    return { path: `/${Constant.RECORDLIST}` };
  }

  // 签到地址
  get signUrl() {
    return process.env.VUE_APP_SIGN_URL;
  }

  mounted() {
    this.initData();
    this.expiredMonth = this.getExpiredMonth();
  }

  initData() {
    getLeftNum().then((res: any) => {
      if (res.Code === 0) {
        this.giftCoupon = res.Data;
      } else {
        this.giftCoupon = '--';
      }
    });
    getExpireNum().then((res: any) => {
      if (res.Code === 0) {
        this.expiredCount = res.Data;
      } else {
        this.expiredCount = 0;
      }
    });
  }

  getExpiredMonth() {
    const curMonth = new Date().getMonth() + 1;
    return curMonth + 1 > 12 ? '01' : curMonth + 1;
  }

  fmtNum(n: any) {
    if (n === '--') return n;
    return thousandSeparator(n);
  }
}
</script>

<style lang="scss">
.homeheader {
  padding-bottom: 20px;
  background-color: #f7f7f7;

  &__top {
    width: 100%;
    padding: 20px 0 20px 40px;
    box-sizing: border-box;
    background-color: #fef1c5;
    color: #f0a83a;
    font-size: 28px;
  }

  &__info {
    display: flex;
    justify-content: space-between;
    padding: 20px 40px;
    background-color: #fff;

    .left {
      display: flex;
      align-items: center;

      .my-giftcoupon {
        display: flex;
        flex-direction: column;
        margin-right: 25px;

        .ft-1 {
          @include fc(32px, $ft-gray-1);
          margin-bottom: 5px;
        }

        .ft-2 {
          @include fc(24px, $ft-gray-2);
        }
      }

      .giftcoupon-count {
        @include fc(52px, $ft-gray-3);
      }
    }
  }
}
</style>
