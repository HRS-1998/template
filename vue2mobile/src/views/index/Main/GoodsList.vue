<template>
  <div class="goodslist">
    <div class="goodslist__top">
      <span class="title">
        {{ title }}
      </span>
    </div>

    <template v-if="listData.length > 0 && !loading">
      <div
        v-for="(item, index) in listData"
        :key="'goodslist-' + index"
        :class="['goodslist__box', index % 2 === 0 ? 'odd' : 'even']"
        @click="goDetail(item)"
      >
        <img :src="item.GoodsImagePath" alt="" />
        <div class="goodsname">{{ item.GoodsName }}</div>
        <div class="goodsprice">{{ item.GoodsCurrency[0].CurrencyCounts }}{{ unit }}</div>
      </div>
    </template>
    <template v-if="listData.length === 0 && !loading">
      <div class="tips tips--mrt20">暂无数据</div>
    </template>
    <template v-if="loading">
      <div class="tips tips--mrt20">加载中...</div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

@Component
export default class GoodsList extends Vue {
  @Prop({ type: String }) title!: '';
  @Prop({ type: String }) unit!: '';
  @Prop({ type: Array, default: () => [] }) listData!: [];
  @Prop({ type: Boolean, default: false }) loading!: boolean;

  @Emit()
  goDetail(item: any) {
    return item;
  }
}
</script>

<style lang="scss">
.goodslist {
  padding-bottom: 40px;
  &:last-child {
    padding-bottom: 100px;
  }
  &__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .title {
      border-left: 10px solid $ft-green-1;
      padding-left: 10px;
      @include fc(28px, $ft-gray-3);
    }
  }

  &__box {
    position: relative;
    &::before {
      @include all-border-1px(#e4e4e4, 10px);
    }
    text-align: center;
    display: inline-block;
    width: 48%;
    margin-bottom: 2%;
    &.odd {
      margin-right: 2%;
    }
    &.even {
      margin-right: 0;
    }

    img {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      display: block;
      @include wh(120px, 120px); // UI图片提供的大小是：120*120
      margin: 0 auto;
      padding-top: 20px;
    }

    .goodsname {
      margin: 15px auto 0;
      padding-bottom: 15px;
      box-sizing: border-box;
      @include fc(26px, #121212);
      position: relative;
      &::before {
        @include border-1px(#e4e4e4, bottom);
      }
      @include ellipsis(1);
      white-space: nowrap;
      display: block;
    }

    .goodsprice {
      padding: 15px 0;
      box-sizing: border-box;
      @include fc(28px, #f8a45c);
      @include ellipsis(1);
      white-space: nowrap;
      display: block;
    }
  }

  .tips {
    text-align: center;
    @include fc(28px, $ft-gray-4);
    &--mrt20 {
      padding-top: 20%;
      padding-bottom: 20%;
    }
  }
}
</style>
