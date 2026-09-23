<template>
  <van-field
    class="usercaptcha"
    v-model="value"
    ref="userCaptchaRef"
    :name="field"
    :rules="options.rules"
    :formatter="formatter"
    :left-icon="options.icon"
    :error="false"
    maxlength="6"
    placeholder="请输入短信验证码"
    clearable
  >
    <template #button>
      <a href="javascript:;" class="btn__sendcode" @click="doVerifyCode">
        <span v-if="!isSending">{{ getCodeText() }}</span>
        <van-loading color="#fe522e" v-if="isSending" />
      </a>
    </template>
  </van-field>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { eventBus } from '@/assets/js/event-bus';
import { toastText } from '@/assets/js/toast';

@Component
export default class BindPhone extends Vue {
  @Prop() data!: any;
  @Prop() field!: string;

  isNeedRepeatSend: boolean = false; // 是否需要重新发送：默认false
  isShowCountdown: boolean = false; // 是否显示倒计时：默认false不显示
  countdown: number = 60; // 倒计时：60秒
  timer: any = null;
  isSending: boolean = false;

  value: string = '';

  options: any = {
    icon: require('@/assets/img/activity/icon-msgcode.png'),
    rules: [
      {
        required: true,
        message: '请输入短信验证码'
      },
      {
        message: '请先获取验证码',
        validator: this.validatorVerifyCode
      },
      {
        message: '请输入6位验证码',
        validator: (val: any) => {
          if (!/\d{6}/.test(val)) {
            return false;
          }
          return true;
        }
      }
    ]
  };

  @Watch('data', { immediate: true, deep: true })
  onData(newVal: any, oldVal: any) {
    if (newVal === oldVal) return;
    this.value = newVal[this.field];
    this.reset();
  }

  @Watch('value')
  onValue(newVal: any, oldVal: any) {
    if (newVal === oldVal) return;
    this.data[this.field] = newVal;
  }

  validatorVerifyCode() {
    if (!this.isNeedRepeatSend) {
      return false;
    }
    return true;
  }

  reset() {
    Object.assign(this.$data, (this as any).$options.data.call(this));
  }

  formatter(val: any) {
    return val.replace(/\D/, '');
  }
  getCodeText() {
    // 定义相关文本为常量，方便维护和国际化处理
    const COUNTDOWN_TEXT = '获取验证码';
    const RESEND_TEXT = '重发验证码';

    // 早期返回减少嵌套，增加代码可读性
    if (this.isShowCountdown) {
      // 确保countdown为数字且非负，否则进行适当的错误处理或默认值设置
      if (typeof this.countdown !== 'number' || this.countdown < 0) {
        // 这里根据实际需求进行错误处理，例如返回默认值或显示错误信息
        return COUNTDOWN_TEXT;
      }
      return this.countdown + `s`;
    }

    // countdown部分处理完毕后，再判断是否需要重发验证码
    if (this.isNeedRepeatSend) {
      return RESEND_TEXT;
    }
    return COUNTDOWN_TEXT;
  }
  // 发送验证码
  doVerifyCode() {
    if (this.isShowCountdown) {
      return;
    }
    eventBus.emit('verifyMobile', () => {
      this.apiSendCode();
    });
  }

  // 接口：获取短信验证码
  apiSendCode() {
    if (this.isSending) {
      return;
    }
    this.isSending = true;
    this.doMockHttp({ Code: 0, Data: '', Message: '' }); // mock接口请求
  }

  doMockHttp(res: any) {
    this.hideSending();
    if (res.Code === 0) {
      this.doCountdown(); // 开始倒计时
      return;
    }
    toastText(res.Message || `服务端异常${res.Code}`);
    this.reset(); // 重置
  }

  // 开始倒计时
  doCountdown() {
    this.isNeedRepeatSend = true; // 需要重新发送
    this.isShowCountdown = true; // 显示倒计时
    const TIME_COUNT = 60;
    // const TIME_COUNT = 15;  // local test

    if (this.timer) return;
    this.countdown = TIME_COUNT;
    this.isShowCountdown = true; // 显示倒计时
    this.timer = setInterval(() => {
      if (this.countdown > 0 && this.countdown <= TIME_COUNT) {
        return this.countdown--;
      }
      this.isShowCountdown = false; // 隐藏倒计时
      clearInterval(this.timer);
      this.timer = null;
    }, 1000);
  }

  hideSending() {
    setTimeout(() => {
      this.isSending = false;
    }, 100);
  }
}
</script>

<style lang="scss">
.usercaptcha {
  .van-field__button {
    float: right;
    white-space: nowrap;
  }

  .btn {
    &__sendcode {
      @include wh(160px, 34px);
      border-left: 2px solid #ffac9b;
      padding-left: 20px;
      @include fc(28px, #fe522e);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
