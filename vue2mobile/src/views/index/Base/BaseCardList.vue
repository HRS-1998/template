<template>
  <div class="base-cardlist">
    <div class="stock">库存：{{ total }}</div>
    <div class="cardlist">
      <div class="cardlist__table">
        <div class="table__head">
          <div class="t1">ID</div>
          <div class="t2">金额</div>
          <div class="t3">购买日期</div>
        </div>
        <div class="table__list">
          <van-list
            v-model="isLoading"
            :finished="isFinished"
            :finished-text="finishedText"
            loading-text="loading"
            @load="onLoad"
          >
            <div class="table__body" v-for="(item, index) in cardList" :key="`cardList${index}`">
              <template>
                <div class="t1 column1">
                  <span class="text">{{ formatCard(item.CardNo) }}</span>
                </div>
                <div class="t2 column2">
                  <span>{{ formatNumber(item.GameCoinNum) }}</span>
                </div>
                <div class="t3 column3">
                  <span>{{ formatTime(item.CreateTime) }}</span>
                </div>
              </template>
            </div>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BaseBtn from './BaseBtn.vue';
import { cardPage } from '@/api/ajax/card';
import { fmtNumber } from '@/assets/js/fmt-number';
import dayjs from 'dayjs';
import { toastText } from '@/assets/js/toast';
import type { ResponseInfo, TypeCompleteFun } from '@/types/common.d';

@Component({
  components: {
    BaseBtn
  }
})
export default class BaseCardList extends Vue {
  pages: any = {
    PageIndex: 1,
    PageSize: 50
  };
  lastRecordId: number = 0; // 记录当前页的最小id
  cardList: any = [];
  total: number = 0;
  isLoading: boolean = false;
  isFinished: boolean = false;
  finishedText: string = '';
  cancel: any; // 取消函数
  tabchange: boolean = false;
  data: any; // 数据源

  init(data: any) {
    Object.assign(this.$data, (this as any).$options.data.call(this));
    this.data = data;
    this.cancel && this.cancel(); // 监听到类型变化时，上一个请求需要取消
    this.onLoad();
  }

  onLoad() {
    if (this.tabchange || !this.data) return;
    this.tabchange = true;
    const abort = (fn: TypeCompleteFun) => {
      this.cancel = fn;
    };
    const ajaxParams = {
      pageIndex: this.pages.PageIndex,
      pageSize: this.pages.PageSize,
      cardStatus: this.data.status, // 状态
      saleCoinNum: this.data.price, // 面值
      lastRecordId: this.lastRecordId
    };
    cardPage(ajaxParams, abort)
      .then((res: ResponseInfo) => {
        this.tabchange = false;
        this.isLoading = false; // 手动结束loading状态
        if (res.Code === 0) {
          this.doSuccess(res);
          return;
        }
        this.doFail();
        toastText(res.Message);
      })
      .catch(() => {
        this.doFail();
      });
  }

  doSuccess(res: ResponseInfo) {
    const list = res.Data.List;
    const len = list.length;
    this.total = res.Data.RecordCount;
    this.cardList = this.cardList.concat(list);
    if (this.cardList.length === 0) {
      this.isFinished = true; // 手动结束
      this.finishedText = '暂无数据';
      return;
    }
    // 记录当前第一页的最大ID值，服务端根据当前值进行排序
    if (len > 0 && this.pages.PageIndex === 1) {
      this.lastRecordId = list[0].Id + 1;
    }
    if (this.cardList.length < this.total) {
      this.pages.PageIndex++;
      return;
    }
    this.isFinished = true; // 手动结束
    this.finishedText = '已经加载完成';
  }

  doFail() {
    this.tabchange = false;
    this.isLoading = false;
    this.isFinished = false;
  }

  formatNumber(n: number): any {
    return fmtNumber(n);
  }

  formatCard(value: string): string {
    if (value.length >= 16) {
      return value.substring(0, 8) + '...';
    }
    return value;
  }

  formatTime(value: number): string {
    return dayjs(value).format('YYYY-MM-DD');
  }
}
</script>

<style lang="scss">
.base-cardlist {
  height: 100%;
  background: #ffffff;
  border-radius: 40px 40px 0 0;
  .stock {
    padding-left: 55px;
    padding-right: 42px;
    padding-top: 20px;
    word-break: break-all;
    @include fc(30px, $ft-green-1);
    font-weight: 700;
  }
  .cardlist {
    @include wh(100%, 100%);
    &__table {
      overflow: hidden;
      margin: 0 auto;
      width: 100%;
      height: calc(100% - 400px);
      padding: 20px 42px 40px 55px;
      box-sizing: border-box;
      .van-loading {
        display: none; // 防止出现多个loading
      }
      .table {
        &__head {
          height: 22px;
          @include fc(28px, #999ca2);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }
        &__list {
          height: 100%;
          overflow: scroll;
          @include scrollbar();
          /* background: yellow;
          opacity: 0.5; */
        }
        &__body {
          height: 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 41px;
          &:last-child {
            margin-bottom: 0;
          }
          &--none {
            display: none;
          }
          .column1 {
            @include fc(30px, #5c5f5f);
            display: inline-flex;
            .text {
              width: 170px;
              @include ellipsis();
            }
          }
          .column2 {
            @include fc(30px, #000000);
            font-weight: 400;
            span {
              padding-left: 10px;
              position: relative;
              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: -30px;
                @include wh(40px, 40px);
                @include bgimg-stretch('~@/assets/img/icon-gold.png');
              }
            }
          }
          .column3 {
            @include fc(30px, #5c5f5f);
            display: inline-flex;
            white-space: nowrap;
          }
        }
      }
      .t1 {
        flex: 1;
      }
      .t2 {
        flex: 1;
        text-align: center;
      }
      .t3 {
        padding-right: 5px;
        width: 180px;
      }
    }
  }
  .bottom {
    position: absolute;
    bottom: 118px;
    width: 100%;
    padding: 20px 32px 30px;
    box-sizing: border-box;
    &__layer {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      @include wh(92%, 108px);
      background: rgba(255, 53, 161, 0.3);
      filter: blur(12px);
    }
    .base-btn--pink {
      position: relative;
    }
  }
}
</style>
