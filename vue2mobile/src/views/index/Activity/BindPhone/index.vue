<template>
  <base-dialog :show="show" :showClose="true" clsname="bindphone" @close="close">
    <template #top>
      <div class="bindphone__top">绑定手机</div>
    </template>

    <!-- 表单 -->
    <template #center>
      <van-form
        @submit="onSubmitForm"
        @failed="onFailedForm"
        class="ct-van-field"
        ref="bindphoneRef"
      >
        <user-phone :data="data" field="Mobile"></user-phone>
        <user-captcha :data="data" field="VerifyCode"></user-captcha>
        <div class="bindphone__button">
          <van-button
            class="btn-receive"
            color="#FE532F"
            block
            type="primary"
            native-type="submit"
            :disabled="!isCanSubmit"
          >
            提交
          </van-button>
        </div>
      </van-form>
    </template>
  </base-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import BaseDialog from '@/components/BaseDialog.vue';
import UserPhone from './UserPhone.vue';
import UserCaptcha from './UserCaptcha.vue';
import { showLoading, hideLoading, toastText } from '@/assets/js/toast';

interface IPhoneInfo {
  Mobile: string | number; // 手机号
  VerifyCode: string; // 验证码
}

@Component({
  components: {
    BaseDialog,
    UserPhone,
    UserCaptcha
  }
})
export default class BindPhone extends Vue {
  @Prop() show!: boolean;

  data: IPhoneInfo = {
    Mobile: '', // 手机号
    VerifyCode: '' // 验证码
  };
  isCanSubmit: boolean = false;

  @Watch('show')
  onShow(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal && newVal) {
      this.reset();
    }
  }

  @Watch('data', { immediate: true, deep: true })
  onData(newVal: IPhoneInfo) {
    const { Mobile, VerifyCode } = newVal;
    this.isCanSubmit = Mobile !== '' && VerifyCode !== '';
  }

  @Emit()
  close() {}

  @Emit()
  bindafter(params: boolean) {
    return params;
  }

  reset() {
    Object.assign(this.$data, (this as any).$options.data.call(this));
    const form: any = this.$refs.bindphoneRef;
    if (!form) return;
    form.resetValidation();
  }

  apiBindPhone(values: any) {
    console.log('绑定手机提交信息', values);
    showLoading();
    // mock接口请求
    setTimeout(() => {
      hideLoading();
      this.close();
      this.bindafter(true);
    }, 2000);
  }

  onSubmitForm(values: any) {
    this.apiBindPhone(values);
  }

  onFailedForm(values: any) {
    toastText('请填写完整');
    console.log('校验失败values', values);
  }
}
</script>

<style lang="scss">
.bindphone {
  &__top {
    margin: 30px 0;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    @include fc(36px, #0f1113);
    font-weight: 500;
  }
  &__button {
    margin: 70px auto 30px;
    .btn-receive {
      width: 100%;
      height: 88px;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      @include fc(34px, #fff);
    }
  }
}

.ct-van-field {
  width: 90%;
  margin: 0 auto;
  .van-field__error-message {
    font-size: 26px;
    position: absolute;
    top: 66px;
    left: -40px;
  }

  .van-cell {
    align-items: center;
    overflow: visible;
    height: 88px;
    background: #f6f6f8;
    border-radius: 8px;
    margin-bottom: 52px;
    &:last-child {
      margin-bottom: 0 !important;
    }
    &:after {
      display: none;
    }
  }

  .van-field--error {
    .van-field__body {
      margin-top: 66px;
    }
  }
}
</style>
