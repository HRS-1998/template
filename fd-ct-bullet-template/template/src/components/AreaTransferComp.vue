<template>
  <el-radio-group v-model="areaType" @change="onAreaTypeChange" :disabled="readonly">
    <el-radio :value="1">全国</el-radio>
    <el-radio :value="2">定向地区</el-radio>
  </el-radio-group>
  <dart-transfer-tree
    :data="areaData"
    :dataMap="dataMap"
    :is-expand-all="[false, true]"
    :titles="['可选', '已选']"
    :left-tree-show="!readonly"
    :is-righ-clear="!readonly"
    filterable
    v-bind="$attrs"
    show-overflow-tooltip
    ref="treeRef"
    @check-change="onCheckChange"
    v-if="areaType === 2"
  />
</template>

<!-- 注意：使用此组件时，请提前解开入口页面 index.html 中的 area.js 文件-->
<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';

withDefaults(defineProps<{ readonly: boolean }>(), { readonly: false });
const emits = defineEmits(['type-change', 'data-change']);
const areaType = defineModel<number>('type');
const areaIdList = defineModel<any>('list');
const treeRef = ref();
const areaData = (window as any).CTVUEAREA;
const dataMap = {
  value: 'value',
  label: 'label',
  children: 'children'
};
const isInternalUpdate = ref(false); // 避免循环更新

const onAreaTypeChange = (value: number) => {
  areaIdList.value = [];
  emits('type-change', value);
};

const onCheckChange = (data: string[]) => {
  isInternalUpdate.value = true;
  areaIdList.value = data;
  emits('data-change', data);
};

watch(
  areaIdList.value,
  (newVal: string[]) => {
    if (isInternalUpdate.value || areaType.value === 1) return;
    nextTick(() => {
      treeRef.value.setCheckedKeys(newVal);
    });
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss" scoped>
:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset !important;
}
</style>
