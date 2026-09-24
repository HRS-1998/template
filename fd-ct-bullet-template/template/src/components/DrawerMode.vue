<template>
  <el-drawer
    v-model="status"
    destroy-on-close
    :size="size"
    :close-on-click-modal="!isEdit"
    @closed="onClosed"
    v-bind="$attrs"
  >
    <template #header>
      <div v-if="!$slots.header">
        <span>{{ title }}</span>
        <span>13456</span>
      </div>
      <slot name="header"></slot>
    </template>
    <div class="drawer-mode" :class="{ 'drawer-mode--limit': !isWidthAll }" v-loading="loading">
      <slot></slot>
      <div
        :style="{ 'padding-left': footerIsCenter ? 0 : labelWidth + 'px' }"
        v-if="isFooter"
        :class="{ tc: footerIsCenter }"
      >
        <slot name="footer"></slot>
        <template v-if="!$slots.footer">
          <el-button @click="onCancel">{{ cancelTitle }}</el-button>
          <el-button type="primary" @click="onSubmit" :loading="confirmLoading" v-if="isEdit">
            {{ confirmTitle }}
          </el-button>
        </template>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
defineProps({
  title: { type: String, default: 'title' },
  labelWidth: { type: Number, default: 100 },
  isFooter: { type: Boolean, default: true }, //显示操作
  footerIsCenter: { type: Boolean, default: false }, //操作居中
  isEdit: { type: Boolean, default: true }, //编辑模式
  cancelTitle: { type: String, default: '取消' },
  confirmTitle: { type: String, default: '确定' },
  size: { type: String, default: '70%' },
  isWidthAll: Boolean, //内容宽度是否100%
  loading: Boolean, //页面loading
  confirmLoading: Boolean //确认loading
});
const emit = defineEmits(['closed', 'confirm', 'cancel']);
const status = defineModel<boolean>();
function onSubmit() {
  emit('confirm');
}
function onClosed() {
  emit('closed');
}
function onCancel() {
  status.value = false;
  emit('cancel');
}
</script>
<style lang="scss">
.drawer-mode {
  padding: 10px;
  &--limit {
    max-width: 1000px;
  }
}
</style>
