<template>
  <el-dialog
    v-model="status"
    destroy-on-close
    :width="width"
    :title="title"
    :close-on-click-modal="!isEdit"
    @closed="onClosed"
    v-bind="$attrs"
  >
    <div
      class="dialog-mode"
      :class="{ 'dialog-mode--limit': !$attrs.fullscreen }"
      v-loading="loading"
    >
      <slot></slot>
    </div>
    <template #footer>
      <div v-if="isFooter">
        <el-button @click="onCancel">{{ cancelTitle }}</el-button>
        <el-button type="primary" @click="onSubmit" :loading="confirmLoading" v-if="isEdit">
          {{ confirmTitle }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
defineProps({
  title: { type: String, default: 'title' },
  width: { type: String, default: '70%' },
  isFooter: { type: Boolean, default: true }, //显示操作
  isEdit: { type: Boolean, default: true }, //编辑模式
  cancelTitle: { type: String, default: '取消' },
  confirmTitle: { type: String, default: '确定' },
  loading: Boolean, //页面loading
  confirmLoading: Boolean //确认loading
});
const emit = defineEmits(['closed', 'confirm', 'cancel']);
const status = defineModel<boolean>();
function onSubmit() {
  emit('confirm');
}
function onClosed() {
  status.value = false;
  emit('closed');
}
function onCancel() {
  status.value = false;
  emit('cancel');
}
</script>
<style lang="scss">
.dialog-mode {
  padding: 10px;
  &--limit {
    max-width: 1000px;
  }
}
</style>
