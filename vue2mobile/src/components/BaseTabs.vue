<template>
  <van-tabs
    :type="type"
    v-model="activeNum"
    v-if="tabList.length > 0 ? true : false"
    @click="onClick"
  >
    <van-tab v-for="(item, index) in tabList" :title="`${item.Name}`" :key="`tabList${index}`">
      <template #title>
        <slot name="title" :title="item"></slot>
      </template>
    </van-tab>
  </van-tabs>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';

@Component
export default class BaseTabs extends Vue {
  @Prop({ type: Number, default: 0 }) active!: number;
  @Prop() tabList!: Array<any>;
  @Prop({ type: String, default: 'line' }) type!: string;

  activeNum: number = 0;

  @Watch('active')
  onActive(newVal: number, oldVal: number) {
    if (newVal !== oldVal) {
      this.activeNum = this.active;
    }
  }

  @Emit()
  onClick() {}
}
</script>

<style lang="scss"></style>
