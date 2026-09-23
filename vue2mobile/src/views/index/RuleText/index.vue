<template>
  <div class="rule">
    <div class="rule__list">
      <h3>1. 礼券是什么？</h3>
      <p>
        礼券是跨平台的消耗货币，通过奖励活动产出，玩家在积累到一定数量后，就可以用相应数量的礼券领取奖品。
      </p>
    </div>
    <div class="rule__list">
      <h3>2. 礼券有什么用？</h3>
      <p>在同城游APP的礼券商城中可以使用礼券领取商品，包括话费，游戏道具，各种珍贵礼品。</p>
      <ul>
        <li>礼券使用限制：</li>
        <li>1.礼券领取商品请在有效期内予以使用;</li>
        <li>2.违反活动限制或者采取非正常流程获利的用户将无法参加领取活动；</li>
        <li>3.是否可以领取商品，以商品页面实际显示为准。</li>
      </ul>
    </div>
    <div class="rule__list">
      <h3>3. 如何获得礼券？</h3>
      <ul>
        <li>
          1.签到获取礼券：每个用户每天可以签到一次，具体奖励数量以用户选择签到方式和签到天数为准；
        </li>
        <li>2.玩游戏赚礼券，部分游戏已经开通礼券功能，用户可以在游戏中轻松获得礼券；</li>
        <li>3.同城游app开展的活动可以获得大量礼券，具体以活动通告为准。</li>
      </ul>
    </div>
    <div class="rule__list">
      <h3>4. 礼券有效期</h3>
      <p>礼券的有效期为2个月，逾期自动作废，具体请在礼券到期明细中查看。</p>
    </div>
    <div class="rule__list">
      <h3>5. 礼券有效期test</h3>
      <p>礼券的有效期为2个月，逾期自动作废，具体请在礼券到期明细中查看。</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class RuleText extends Vue {}
</script>

<style lang="scss">
.rule {
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding: 20px 40px 100px;
  box-sizing: border-box;

  &__list {
    position: relative;
    &::before {
      @include border-1px(#dcdcdc, bottom);
    }
    &:last-child {
      &::before {
        @include border-1px(transparent, bottom);
      }
    }
    padding-top: 20px;
    padding-bottom: 20px;

    h3 {
      @include fc(32px, $ft-green-1);
      font-weight: 400;
    }

    p,
    ul {
      margin: 20px;
      @include fc(26px, $ft-gray-2);
    }

    li {
      margin-bottom: 8px;
    }
  }
}
</style>
