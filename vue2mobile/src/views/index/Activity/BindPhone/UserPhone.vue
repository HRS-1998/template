<template>
  <van-field
    v-model="value"
    ref="userPhoneRef"
    :name="field"
    type="tel"
    :rules="options.rules"
    :formatter="formatter"
    :left-icon="options.icon"
    :error="false"
    maxlength="11"
    placeholder="请输入手机号"
    clearable
  />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { mapMutations } from 'vuex';
import { eventBus } from '@/assets/js/event-bus';
import { toastText } from '@/assets/js/toast';

@Component({
  methods: {
    ...mapMutations(['updateState'])
  }
})
export default class BindPhone extends Vue {
  @Prop() data!: any;
  @Prop() field!: string;

  value: string = '';
  options: object = {
    icon: require('@/assets/img/activity/icon-phone.png'),
    rules: [
      { required: true, message: '请输入11位手机号' },
      {
        pattern: /^1\d{10}$/,
        message: '输入的手机号格式不对'
      }
    ]
  };

  @Watch('data', { immediate: true, deep: true })
  onData(newVal: any, oldVal: any) {
    if (newVal === oldVal) return;
    this.value = newVal[this.field];
  }

  @Watch('value')
  onValue(newVal: string, oldVal: string) {
    if (newVal === oldVal) return;
    this.data[this.field] = newVal;
  }

  mounted() {
    eventBus.on('verifyMobile', (fn: any) => {
      const p = (this as any).$refs.userPhoneRef.validate();
      p.then((r: any) => {
        if (typeof r === 'undefined') {
          fn();
          return;
        }
        toastText(r.message);
      });
    });
  }

  formatter(val: any) {
    return val.replace(/^([^1]\d?)|\d{12,}$/, '');
  }

  beforeDestroy() {
    eventBus.off('verifyMobile');
  }
}
</script>

<style scoped></style>
