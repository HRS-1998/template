<template>
  <!-- 异常弹窗 -->
  <base-dialog :show="show" class="poperror">
    <template v-slot:center>
      <div class="poperror__text" v-html="text"></div>
      <div class="poperror__bottom">
        <base-btn name="确认" class="base-btn--primary" @on-click="close" />
      </div>
    </template>
  </base-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import BaseDialog from '@/components/BaseDialog.vue';
import BaseBtn from './BaseBtn.vue';
import { mapState, mapMutations } from 'vuex';

@Component({
  components: {
    BaseDialog,
    BaseBtn
  },
  computed: {
    ...mapState(['errorPop'])
  },
  methods: {
    ...mapMutations(['updateState'])
  }
})
export default class PopError extends Vue {
  show: boolean = false;
  text: any = '';

  @Watch('errorPop', { immediate: true, deep: true })
  onErrorPop() {
    const errorPop = (this as any).errorPop;
    this.show = errorPop.isShow;
    if (!this.show) return;
    this.text = errorPop.text || '服务异常，请稍后重试';
  }

  mounted() {
    this.show = false;
  }

  close() {
    (this as any).updateState({ errorPop: { isShow: false } });
  }
}
</script>

<style lang="scss">
.poperror {
  &__text {
    text-align: center;
    @include fc(36px, #5c5f5f);
    margin-bottom: 78px;
    line-height: 48px;
  }
  &__bottom {
    width: 80%;
    margin: 0 auto;
  }
}
</style>
