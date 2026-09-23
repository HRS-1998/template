<template>
  <div class="activity-rule">
    <div class="activity-rule__title">活动规则：</div>
    <ul class="activity-rule__content">
      <li>1、活动时间：即日起至2023年12月31日。</li>
      <li>2、嘀嗒出行用户可领取顺风车券包，券额随机分配，以实际到账为准。</li>
      <li>
        3、每个用户仅限使用1个账号参与活动，同一身份信息、同一手机号、同一设备ID、同支付账号均被认为是同一用户。每个用户限领1次。
      </li>
      <li>
        4、此活动顺风车红包仅限顺风车开通地区可用，具体使用规则和有效期以“嘀嗒出行App-我的钱包-优惠券”中到账为准。
      </li>
      <li>
        5、若您对本活动有任何疑问，请联系嘀嗒出行客服400-163-0886(免长途费)，嘀嗒出行将会在法律允许的范围内对本活动给予必要的说明和解释。
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Rule extends Vue {}
</script>

<style lang="scss">
.activity-rule {
  @include fc(30px, #000);
  width: 90%;
  margin: 5px auto 0;
  padding: 26px 22px;
  box-sizing: border-box;
  &__title {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 14px;
  }
}
</style>
